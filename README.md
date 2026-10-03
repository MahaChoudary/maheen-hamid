# Maheen AI Portfolio

MAHEEN HAMID — AI Engineer | Full-Stack AI Systems. Existing Next.js App Router, TypeScript and Tailwind application with server-side Mira, Resume–Job Matcher and dynamic Tech Explainer. The original avatar, original resume PDF and planning documents are preserved. This upgrade continues the saved codebase; it replaces the old notes collection and unused development preview fixture as requested. Six optimized cover artworks and the uploaded professional photo are included.

Live Groq and hosted Upstash verification was not performed in this recovery; genuine account credentials were not supplied. Production has no mock AI fallback. Automated provider fixtures exist only in tests; external-account factuality, latency, privacy settings and hosted deployment still require live verification.

## Local setup

Prerequisites: Node.js 24 LTS, npm and Git. Automated browser tests additionally need Chromium and Redis 7+.

```bash
cd maheen-ai-portfolio
npm ci
cp .env.example .env.local
npm run dev
```

PowerShell: `Copy-Item .env.example .env.local`. Open http://localhost:3000. Frontend and backend use the same `npm run dev` process and port; there is no separate server application to start. Static pages, search and ordinary CLI commands work without AI credentials. Generative requests show a clean unavailable state when configuration is missing.

Production:

```bash
npm run build
npm start
```

## Server environment

Only use ignored `.env.local` or deployment server settings for actual values. No secret uses `NEXT_PUBLIC_`. `.env.example` contains blank placeholders only.

```dotenv
SITE_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
AI_ENABLED=true
AI_PRIVACY_VERIFIED=true
AI_PROVIDER=groq
GROQ_API_KEY=<server-secret>
GROQ_MODEL=openai/gpt-oss-20b
UPSTASH_REDIS_REST_URL=<https-rest-endpoint>
UPSTASH_REDIS_REST_TOKEN=<server-secret>
RATE_LIMIT_HMAC_SECRET=<random-32-or-more-characters>
AI_IP_SOURCE=local
```

Set `AI_PRIVACY_VERIFIED=true` only after checking actual provider data controls, including Groq ZDR, and host handling. It is an operator attestation, not an automated guarantee. Generate the HMAC secret locally:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

| Variable | Meaning/default |
| --- | --- |
| `SITE_URL` | Verified public origin for canonical/sitemap URLs; optional locally. No invented domain. |
| `ALLOWED_ORIGINS` | Comma-separated exact HTTP(S) origins; defaults to `SITE_URL`, then `http://localhost:3000`. No wildcard. |
| `AI_ENABLED` | `true` enables model requests; defaults off. Fixed facts remain deterministic. Vercel preview inference is always blocked. |
| `AI_PRIVACY_VERIFIED` | Explicit operator attestation; defaults false and blocks inference. Not an automated account verification. |
| `AI_PROVIDER` | `groq` (default) or `openai-compatible`. No automatic provider failover. |
| `GROQ_API_KEY`, `GROQ_MODEL` | Groq server secret and default `openai/gpt-oss-20b`. |
| `AI_PROVIDER_NAME` | Provider name shown on the Privacy page; name the actual service. |
| `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL` | Compatible server credential, HTTPS OpenAI-compatible `/v1` base and model; `AI_MODEL` also overrides the Groq model. |
| `AI_TOKENIZER` | `o200k_base` default, or `cl100k_base`. Must match the configured model. |
| `AI_TOKENIZER_VERIFIED` | Must be `true` for non-default/unknown model combinations after verification. Groq GPT-OSS 20B/120B + `o200k_base` are recognized; conservative envelope overhead is reserved. |
| `AI_RESPONSE_FORMAT` | `json_schema` default (strict structured output); explicitly use `json_object` only for a verified compatible service. Output validation remains mandatory. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Required distributed quota store; HTTPS REST endpoint and server token. No prompt storage. |
| `RATE_LIMIT_HMAC_SECRET` | Random secret at least 32 characters; daily pseudonymous IP quota identifiers. |
| `AI_IP_SOURCE` | `local` shares a loopback identity and accepts only loopback origins. Production implementation: `vercel`, using its trusted header only inside actual Vercel runtime. Generic-host live inference is blocked until a trusted adapter is implemented. |
| `AI_DAILY_REQUEST_LIMIT` | Optional lower global ceiling, 1–20; default 20. |
| `AI_DAILY_TOKEN_LIMIT` | Optional lower global token ceiling, 1–100000; default 100000. |


Restart dev after environment changes. Rebuild production when public provider/privacy/enablement settings change; their version is embedded in static pages. A version mismatch requires renewed acceptance. `localhost` and `127.0.0.1` are different origins.

Groq GPT-OSS 20B remains the default: simple server integration and strict structured JSON. Rejected model/configuration requests can make one bounded retry on the same Groq provider: GPT-OSS 120B if 20B is unavailable, or JSON mode if strict format is rejected. No inference retry on network failures/429/5xx, provider switching or account cycling occurs. Account free-tier eligibility, model availability, pricing and quotas must be checked before activation: [structured output](https://console.groq.com/docs/structured-outputs), [Groq limits](https://console.groq.com/docs/rate-limits), [data controls](https://console.groq.com/docs/your-data), [Upstash pricing](https://upstash.com/pricing/redis). Groq is pinned to `openai/gpt-oss-20b` / `openai/gpt-oss-120b`; unrecognized Groq model configuration uses the documented 20B default. An OpenAI-compatible endpoint can use another explicitly attested model; changing a provider also requires privacy, tokenizer and structured-output checks. No frontend rewrite is needed.

## API and AI behavior

All POST bodies include `requestId` (UUID), `consent: true` and current `disclosureVersion` supplied by the interface.

| Endpoint | Additional request fields | Result |
| --- | --- | --- |
| `/api/assistant` | `question` (1–1000 chars), optional `history` (≤6 turns) | Natural answer; personal facts grounded when needed; empty retrieval alone does not block a conversational answer. |
| `/api/match` | `jobDescription` (1–6000 chars), `acknowledgement: true` | Role Snapshot, categorized literal requirements, Best Evidence and practical actions. |
| `/api/explain` | `topic` (1–500 chars) | Structured technical explanation and Mermaid source plus accessible description. |

All three provide OPTIONS exact-origin CORS and GET 405. JSON bodies are limited to 32 KB. `Accept: application/x-ndjson` yields sequenced event/result messages, buffered until generation and validation complete. `Accept: application/json` yields `{runId, requestId, messages, complete}` on success. Both formats return a typed JSON error with the actual HTTP failure status (429, 502, 503 or 504), rather than committing an early 200 response. Public error messages are friendly; safe codes and stage diagnostics remain server-side/development-only.

Flow: acknowledged submission → strict origin/body/schema validation → intent routing → applicable retrieval → atomic quota reservation → a bounded server-side model request → parse and validate → UI result or deliberate retry error.

- **Mira:** conversation/technical/portfolio/mixed intent routing. Greetings, thanks and general technical questions skip portfolio retrieval and evidence gates. Factual portfolio questions use versioned public records; mixed answers ground their personal portion. History resolves follow-ups but never establishes facts. Simple identity/contact/availability and unknown-employer questions can remain deterministic. Casual replies still require the normal provider/privacy/quota/security configuration.
- **Grounding:** trusted source IDs are resolved to server-owned records. Natural paraphrasing and multi-source synthesis are accepted. Specific personal credential/tenure/metric claims, qualification upgrades and protected-trait assessment remain guarded. This is not a mathematical guarantee of semantic truth; real-model evaluation remains necessary.
- **Matcher:** semantic comparison with a specific AI explanation for each requirement, literal original job spans, exact trusted evidence spans, protected-trait exclusion and conservative tenure handling. No lexical-overlap veto, fit percentage or hiring verdict. Generation/schema failure returns an error without attaching a keyword comparison or fallback result.
- **Tech Explainer:** open technical topics, no portfolio corpus or forced personal connection. Its response includes overview, steps, example, pitfalls, takeaway and Mermaid. Mermaid is lazy-loaded only after a result, uses strict security and themed SVG, and blocks HTML/directives/links/callbacks. Ancillary explanation fields are optional when reading output; a non-empty, bounded overview remains required. Missing, malformed or unsafe diagrams are repaired or rebuilt from the generated explanation steps, independently of the text. Runtime syntax failures get a separate safe Mermaid fallback. Diagrams describe concepts, not actual execution.
- **Privacy:** one acceptance per disclosure version. Chat stays in session memory (≤20 displayed messages, ≤6 submitted history turns). No transcript, job text or model output in Redis, localStorage or application logs. Privacy/provider information is on `/privacy`, not in recurring composer/debug panels.

Hybrid portfolio retrieval remains local TF-IDF/SVD latent semantic analysis plus BM25 and reciprocal-rank fusion. No new embedding API, vector database or visitor-query persistence. Out-of-vocabulary questions can still miss context; aliases and conversational history help. Technical articles are instructional material, not proof of personal credentials.

## Limits and security

Atomic Upstash Lua reserves independent per-feature windows for a signed, HttpOnly anonymous session: Mira 30 messages, Explainer 10 requests and Matcher 10 analyses per 10 minutes. Leases are per session/feature; one tool cannot occupy another tool’s lease. Broad per-IP/feature abuse guards allow 200 requests/10 minutes and 1000/day. Deployment cost defaults are 2000 requests/day, 2M tokens/day and 100K reserved tokens/minute. Daily cost budgets can be adjusted explicitly. A genuine upstream 429 may impose a shared provider cooldown. Missing/quota-failed Redis blocks model access.

Loopback `next dev` has effectively unrestricted request/token budgets; all validation, origin, privacy and provider checks still apply. `AI_ENFORCE_PRODUCTION_LIMITS=true` runs production budgets locally for verification. This bypass cannot be enabled on a public origin or production build.

Mira: ≤3500 input +1200 completion tokens. Matcher: ≤4500 +3000. Explainer: ≤4500 +2600. Portfolio evidence ≤1500 tokens/5 sources. Requests use a 25-second deadline and 30-second lease. Confirmed usage reconciles reservations; unknown usage stays reserved. No automatic retry of a billable generation failure. Cancellation aborts local updates/best-effort processing, not already-submitted provider consumption. Limits may affect long roles or conversations; shorten the request rather than bypassing guards.

Production live inference currently requires genuine Vercel trusted-IP provenance (`AI_IP_SOURCE=vercel`). Local shared identity is permitted only for loopback origins. Vercel preview AI is blocked. No arbitrary tool, shell, eval, filesystem execution or model-triggered privileged action. Secrets stay on the server. CSP/resources remain same-origin; client text is escaped and links are application-owned.

## Content and maintenance

| File | Edit here |
| --- | --- |
| `src/content/site.ts` | Profile/contact/GitHub, navigation, availability, capability and single resume config. |
| `src/content/projects.ts` | Reviewed published cases; Wukala-GPT uses only existing CV project statements. |
| `src/content/writing.ts` | Exactly six illustrated articles across AI, RAG, backend, frontend and software trends, with primary references and runtime diagrams. |
| `src/content/ecosystem.ts` | Eight engineering groups with tools grouped by purpose; no status filters or proficiency ratings. |
| `src/content/knowledge.ts` | Explicitly reviewed personal facts for RAG; updating a PDF does not automatically ingest new facts. |
| `src/features/explainer/diagram-safety.ts` | Shared generated-diagram safety envelope. |

`predev`/`prebuild` regenerate versioned search and knowledge artifacts. Search covers published pages, case studies and writing, excluding drafts, preview fixtures and planning docs. Add writing records with unique slugs, real dates, useful content and primary references. Do not turn instructional articles or exploration tools into personal factual evidence automatically.

The original resume stays unchanged at `public/documents/maheen-hamid-resume.pdf` (SHA-256 `6d2adef4794ad8ff3e09b8200d642280d53816bb8905b9884804e7bf2e2fd6e9`). `/resume` and `/resume/view` use the actual PDF, lazy same-origin PDF.js and original-file download. Replace the static file and update the central resume metadata to publish a new CV. Builds reject missing/non-PDF assets. No reconstructed resume or screenshots replace the original.

Navigation remains Home | Work | Writing | Playground | About | Contact. Theme and Pause Motion are navbar icon controls. The safe CLI retains all 16 commands; `resume`/`cv` are aliases, `open` uses allowlisted destinations, `search` stays local and enabled `ask` shares Mira/consent/quotas. Systems/Workflow remain explicit illustrative teaching experiences.

Motion uses native scroll/CSS, visibility/reduced-motion/tab gates and restrained portrait/background/hero behavior. The hero never blocks content. Pausing stops ambient animation; reduced motion provides the complete static experience. Mermaid/code diagrams have text alternatives. No heavy motion library or canvas framework was added.

All approved `docs/01-discovery`–`docs/04-system`, Phase 5 files and assets remain present. Dated implementation records supersede historical mock-only descriptions without restarting planning.

## Verification

```bash
npx playwright install chromium
# Install Redis 7+ with your system package manager, then:
npm run type-check
npm run lint
npm test
npm run build
npm run test:ai-browser
npm run test:browser
npm run test:resume
```

`REDIS_SERVER_PATH` may point to a test Redis binary. `CHROMIUM_MODULE_PATH` may select an installed CI Chromium package. They are test-runner configuration, not deployment values. Browser scripts launch their own app processes; run builds before production suites, not while those suites are using the build.

- Unit suites cover request/provider/schema/security, natural synthesis, intent routing, semantic comparison, tolerant text/diagram recovery, independent 30/10/10 windows, signed session cookies, proper HTTP failures, local search/CLI and real ephemeral Redis Lua.
- AI browser suite uses actual Next UI/API and actual Redis with an explicitly synthetic upstream. It checks chat, Matcher, CLI, runtime Mermaid/theme/text alternative, malformed output, missing keys, failure/quota/cancellation and responsive accessibility. It does not certify real Groq model output.
- Production browser suite checks all main routes plus published cases/articles, both themes, nav/focus, search/CLI, consent/session, offline errors, the filter-free ecosystem, motion pause, responsive widths 320/390/768/1280 and axe.
- Resume suite checks actual PDF rendering, original bytes/download, entry points, mobile and accessibility.

Manual product checks after configuring genuine account settings:

1. Mira: say hello, ask a technical question, then ask “How does Maheen combine RAG and full-stack apps?”. Verify natural replies and a grounded personal answer without debug/source clutter.
2. Ask “How many years did Maheen work at Google?”. Verify no invented employer or tenure.
3. Matcher: submit non-confidential React/TypeScript, RAG and duration requirements. Verify Strong/Partial/Gaps, Best Evidence, next steps, and no hiring score. Analyze another role works.
4. Tech Explainer: enter an arbitrary topic such as Kubernetes or API gateways. Verify real explanation, themed SVG and text alternative; change theme and test mobile.
5. CLI: enabled `ask` uses the shared chat, ordinary commands remain local, and shell syntax never executes. Stop/Clear reject stale updates.
6. Check navbar controls, reduced motion, keyboard/focus and original PDF download.

A separate deliberate live smoke test is available after starting the app with genuine verified settings:

```bash
npm run test:provider
```

It first verifies Groq’s authenticated active-model listing, then checks casual/grounded Mira, multiple explanations and multiple JDs against the configured real provider and shared quotas. It was not run in this recovery because genuine account credentials were not supplied. External-account behavior, model factuality/latency and Upstash hosted connectivity remain unverified.

## Deployment

Configure the production HTTPS origin, server secrets, privacy attestation and trusted IP strategy. Verify hosting/free-tier/commercial-use eligibility before choosing a plan. Build and deploy with AI initially off; enable/rebuild only after real-account privacy, provider, quotas and factuality checks. No billing, deployment or GitHub push is performed automatically.

For an empty repository you own:

```bash
git init -b main
git add .
git commit -m "Complete portfolio implementation"
git remote add origin https://github.com/22101356-Maheen/maheen-ai-portfolio.git
git push -u origin main
```

The delivery archive excludes environment values, dependencies, build output and test screenshots. It preserves source, package lock, empty `.env.example`, docs and original assets.


## Final verification — 3 October 2026

| Check | Result |
| --- | --- |
| Type-check | Passed; route types generated, zero TypeScript errors. |
| ESLint | Passed, no errors or warnings. |
| Unit/backend/security | 144 tests across 6 files passed, including real local Redis Lua. |
| Production build | Passed; 33 generated pages and all three API routes. |
| AI browser contracts | Passed: real UI/API, synthetic upstream, real Redis; no external Groq call. |
| Production browser | Passed: routes, both themes, responsive/keyboard/axe, search/CLI, pause and offline states. |
| Resume browser | Passed: actual PDF preview, new-tab viewer, byte-identical download, mobile, no-JS and entry points. |
| Assets/secrets | Original avatar/PDF preserved; no actual key signatures or non-example environment files in delivery. |

Mira acceptance questions were checked through the actual UI/API:

| Question | Verified behavior |
| --- | --- |
| Who is Maheen? | Approved identity answer; deterministic source lookup. |
| How does Maheen combine RAG and full-stack apps? | Relevant retrieval → synthetic provider → parsed/validated natural answer; AI mode. |
| How do her backend skills support her AI work? | Natural grounded synthesis; AI mode. |
| What is Wukala-GPT? | Reviewed project evidence, natural response; AI mode. |
| Is she available for remote work? | Approved availability answer; deterministic source lookup. |
| How many years did Maheen work at Google? | Insufficient evidence / not documented; no employer or tenure invented. |

Matcher semantic support, exact requirement/evidence spans, tenure downgrade, protected exclusions and safe error states passed. Runtime Mermaid geometry, theme and malformed/unsafe output were checked. Missing keys, model failure, parse failure, quota outage, timeouts and cancellation remained visible failures, not successful fallback answers.

**Remaining verification boundary:** real Groq inference and hosted Upstash connectivity were not executed; genuine account credentials were not supplied. No actual provider factuality/latency, hosted account configuration or production deployment is certified by these synthetic tests. Final file/change details are in `IMPLEMENTATION_HANDOFF.md`.
