import 'server-only';

import { randomUUID } from 'node:crypto';

import { aiConfig } from '../config';
import { safeError, ServiceError } from '../errors';
import {
  checkOrigin,
  readValidated,
  responseHeaders,
  quotaIdentity,
} from '../security/request';
import { QuotaStore } from '../security/quota';
import { prepare, execute } from '../ai/service';
import { CompatibleProvider } from '../ai/provider';
import { diagnostic } from '../ai/diagnostics';

import {
  assistantRequestSchema,
  matchRequestSchema,
  explainRequestSchema,
  type Kind,
  type StreamMessage,
  type TraceEvent,
} from '@/features/ai/contracts';

function estimateResultTokens(
  inputTokens: number,
  result: unknown,
): number {
  try {
    const outputChars = JSON.stringify(result).length;
    const estimatedOutputTokens = Math.max(1, Math.ceil(outputChars / 4));

    return inputTokens + estimatedOutputTokens;
  } catch {
    return inputTokens + 256;
  }
}

function normalizeFailure(error: unknown) {
  const safe = safeError(error);

  const validationCodes = new Set([
    'ANSWER_NOT_VERIFIED',
    'COMPARISON_NOT_VERIFIED',
    'EXPLANATION_INVALID',
    'INVALID_MATCHER_OUTPUT',
  ]);

  if (validationCodes.has(safe.error.code)) {
    return {
      ...safe,
      status: 422,
      error: {
        ...safe.error,
        message:
          'The AI response could not be validated safely. Please retry.',
      },
    };
  }

  return safe;
}

export async function options(request: Request) {
  try {
    const origin = checkOrigin(request, aiConfig());

    return new Response(null, {
      status: 204,
      headers: {
        ...responseHeaders(origin),
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '600',
      },
    });
  } catch (error) {
    const safe = safeError(error);

    return Response.json(safe.error, {
      status: safe.status,
      headers: responseHeaders(),
    });
  }
}

export function methodNotAllowed() {
  return Response.json(
    {
      code: 'METHOD_NOT_ALLOWED',
      message: 'Use POST with JSON.',
    },
    {
      status: 405,
      headers: {
        ...responseHeaders(),
        Allow: 'POST, OPTIONS',
      },
    },
  );
}

export async function handle(request: Request, kind: Kind) {
  let origin: string | undefined;

  try {
    const config = aiConfig();

    origin = checkOrigin(request, config);

    const input =
      kind === 'assistant'
        ? await readValidated(request, assistantRequestSchema)
        : kind === 'match'
          ? await readValidated(request, matchRequestSchema)
          : await readValidated(request, explainRequestSchema);

    if (input.disclosureVersion !== config.disclosureVersion) {
      return Response.json(
        {
          code: 'DISCLOSURE_CHANGED',
          message:
            'Provider disclosure changed. Review it and submit again.',
          disclosure: {
            provider: config.provider,
            disclosureVersion: config.disclosureVersion,
            enabled: config.enabled,
            privacyVerified: config.privacyVerified,
          },
        },
        {
          status: 409,
          headers: responseHeaders(origin),
        },
      );
    }

    const text =
      'question' in input
        ? input.question
        : 'jobDescription' in input
          ? input.jobDescription
          : input.topic;

    const prepared = prepare(
      kind,
      text,
      config,
      'history' in input ? input.history : [],
    );

    const runId = randomUUID();
    const store = new QuotaStore(config);

    const identity = prepared.deterministic
      ? undefined
      : quotaIdentity(request, config);

    let reservation:
      | Awaited<ReturnType<QuotaStore['reserve']>>
      | undefined;

    if (identity) {
      try {
        reservation = await store.reserve(
          identity,
          runId,
          prepared.inputTokens + prepared.completion,
          kind,
        );
      } catch (error) {
        const safe = safeError(error);

        /*
         * In local development, Redis/quota infrastructure should not make
         * the AI tools unusable. Production still fails closed.
         */
        if (
          process.env.NODE_ENV !== 'production' &&
          safe.error.code === 'QUOTA_UNAVAILABLE'
        ) {
          diagnostic('quota.bypassed', {
            kind,
            code: safe.error.code,
          });
        } else {
          throw error;
        }
      }
    }

    const abort = new AbortController();

    let timedOut = false;
    let providerRequestSent = false;

    const deadline = setTimeout(() => {
      timedOut = true;

      abort.abort(
        new DOMException('Deadline reached', 'TimeoutError'),
      );
    }, config.deadlineMs);

    const disconnect = () => {
      abort.abort(
        new DOMException('Client disconnected', 'AbortError'),
      );
    };

    request.signal.addEventListener('abort', disconnect, {
      once: true,
    });

    let sequence = 0;
    let terminal = false;
    let httpStatus = 200;

    const start = Date.now();

    const event = (
      stage: TraceEvent['stage'],
      detail: string,
      sourceIds?: string[],
    ): TraceEvent => ({
      runId,
      requestId: input.requestId,
      sequence: ++sequence,
      at: new Date().toISOString(),
      stage,
      detail,

      ...(sourceIds ? { sourceIds } : {}),

      ...(stage === 'completed' ||
      stage === 'failed' ||
      stage === 'cancelled' ||
      stage === 'insufficient_evidence'
        ? {
            durationMs: Date.now() - start,
          }
        : {}),
    });

    const work = async (
      send: (message: StreamMessage) => void,
    ) => {
      let actualUsage: number | undefined;

      try {
        send({
          type: 'event',
          event: event(
            'request.accepted',
            'Input, origin and disclosure acknowledgement validated.',
          ),
        });

        const provider = new CompatibleProvider(config);

        const wrapped = {
          generate: (
            ...args: Parameters<typeof provider.generate>
          ) =>
            provider.generate(
              args[0],
              args[1],
              args[2],
              args[3],
              args[4],
              () => {
                providerRequestSent = true;
              },
            ),
        };

        const result = await execute(
          prepared,
          config,
          abort.signal,
          (stage, detail, sourceIds) =>
            send({
              type: 'event',
              event: event(stage, detail, sourceIds),
            }),
          wrapped,
          store,
        );

        /*
         * Prefer real provider usage.
         * If the provider omits usage, estimate it so the entire reserved
         * token budget does not stay locked.
         */
        actualUsage =
          result.usage?.totalTokens ??
          estimateResultTokens(
            prepared.inputTokens,
            result,
          );

        if (abort.signal.aborted) {
          throw abort.signal.reason;
        }

        send({
          type: 'event',
          event: event(
            result.status === 'insufficient_evidence'
              ? 'insufficient_evidence'
              : 'completed',
            'Run finished; validated result content is ready.',
          ),
        });

        send({
          type: 'result',
          runId,
          requestId: input.requestId,
          result,
        });

        terminal = true;
      } catch (error) {
        const safe = timedOut
          ? safeError(
              new ServiceError(
                504,
                'TIMEOUT',
                'The request deadline was reached. Please retry.',
              ),
            )
          : normalizeFailure(error);

        httpStatus = safe.status;

        diagnostic('request.failed', {
          kind,
          code: safe.error.code,
        });

        if (safe.error.code === 'PROVIDER_QUOTA') {
          await store
            .cooldown(safe.error.retryAfter || 60)
            .catch(() => {});
        }

        send({
          type: 'event',
          event: event(
            abort.signal.aborted && !timedOut
              ? 'cancelled'
              : 'failed',
            safe.error.message,
          ),
        });

        send({
          type: 'error',
          runId,
          requestId: input.requestId,
          error: safe.error,
        });

        terminal = true;
      } finally {
        clearTimeout(deadline);

        request.signal.removeEventListener(
          'abort',
          disconnect,
        );

        if (reservation) {
          /*
           * If no provider request was actually sent, charge zero.
           * If it was sent, always finish using real or estimated usage.
           *
           * Never leave the full reservation locked just because the
           * provider omitted token usage metadata.
           */
          const usageToCommit = providerRequestSent
            ? actualUsage ??
              prepared.inputTokens +
                Math.min(prepared.completion, 256)
            : 0;

          await reservation
            .finish(usageToCommit)
            .catch((error) => {
              diagnostic('quota.finish_failed', {
                kind,
                code: safeError(error).error.code,
              });
            });
        }
      }
    };

    /*
     * Buffer until provider + validation finish so a failed run can return
     * its real HTTP status instead of returning HTTP 200 first.
     */
    const messages: StreamMessage[] = [];

    await work((message) => {
      messages.push(message);
    });

    const errorMessage = messages.find(
      (message) => message.type === 'error',
    );

    const headers = {
      ...responseHeaders(origin),

      ...(identity?.cookie
        ? {
            'Set-Cookie': identity.cookie,
          }
        : {}),

      ...(errorMessage?.type === 'error' &&
      errorMessage.error.retryAfter
        ? {
            'Retry-After': String(
              errorMessage.error.retryAfter,
            ),
          }
        : {}),

      'Cache-Control': 'no-store',
    };

    if (errorMessage?.type === 'error') {
      return Response.json(errorMessage.error, {
        status: httpStatus,
        headers,
      });
    }

    if (
      request.headers
        .get('accept')
        ?.includes('application/x-ndjson')
    ) {
      return new Response(
        messages
          .map((message) => JSON.stringify(message) + '\n')
          .join(''),
        {
          status: httpStatus,
          headers: {
            ...headers,
            'Content-Type':
              'application/x-ndjson; charset=utf-8',
          },
        },
      );
    }

    return Response.json(
      {
        runId,
        requestId: input.requestId,
        messages,
        complete: terminal,
      },
      {
        status: httpStatus,
        headers,
      },
    );
  } catch (error) {
    const safe = normalizeFailure(error);

    diagnostic('request.failed', {
      kind,
      code: safe.error.code,
    });

    return Response.json(safe.error, {
      status: safe.status,
      headers: {
        ...responseHeaders(origin),

        ...(safe.error.retryAfter
          ? {
              'Retry-After': String(
                safe.error.retryAfter,
              ),
            }
          : {}),

        'Cache-Control': 'no-store',
      },
    });
  }
}