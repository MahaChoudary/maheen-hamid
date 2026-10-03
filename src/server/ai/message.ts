import type { ApiError } from '@/features/ai/contracts';

export function friendlyError(error: ApiError): string {
  const retry = error.retryAfter ? ` Try again in ${error.retryAfter}s.` : '';

  if (['AI_DISABLED','PRIVACY_NOT_VERIFIED','PROVIDER_NOT_CONFIGURED','TOKENIZER_NOT_VERIFIED','QUOTA_NOT_CONFIGURED','CONFIGURATION'].includes(error.code))
    return 'AI is temporarily unavailable. Please try again later.';

  if (['INVALID_INPUT','TOKEN_LIMIT'].includes(error.code))
    return 'Please shorten your text and keep the key details.';

  if (error.code === 'CONSENT_REQUIRED') return 'Choose Continue before sending.';
  if (error.code === 'DISCLOSURE_CHANGED') return 'The privacy notice changed. Please continue again.';
  if (error.code === 'CANCELLED') return 'Request stopped.';

  if (error.code === 'SESSION_WINDOW') return `You’ve reached this tool’s temporary request limit.${retry}`;
  if (error.code === 'IP_ABUSE_WINDOW' || error.code === 'IP_DAY') return `Too many requests from this connection.${retry}`;
  if (error.code === 'PROVIDER_QUOTA') return `The AI provider is temporarily rate-limited.${retry}`;
  if (error.code === 'QUOTA_UNAVAILABLE') return 'The quota service is temporarily unavailable. Please retry.';
  if (error.code === 'TOKEN_WINDOW' || error.code === 'TOKEN_DAY') return `Temporary AI token limit reached.${retry}`;
  if (error.code === 'COOLDOWN' || error.code === 'BUSY') return `AI is temporarily busy.${retry}`;

  if (['ANSWER_NOT_VERIFIED','COMPARISON_NOT_VERIFIED','INVALID_MATCHER_OUTPUT','EXPLANATION_INVALID'].includes(error.code))
    return 'The AI response could not be processed correctly. Please retry.';

  if (error.code === 'MODEL_UNAVAILABLE') return 'The selected AI model is temporarily unavailable. Please retry.';
  if (error.code === 'TIMEOUT') return 'The AI took too long to respond. Please retry.';

  return error.message || 'Something interrupted this response. Please try again.';
}