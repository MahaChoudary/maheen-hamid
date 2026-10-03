# Implementation Handoff

Phase 5 · Final planning delivery · 30 September 2026

## Goal and fixed decisions

- Build a memorable, avatar-led, multipage AI Engineer portfolio that lets recruiters understand Maheen's story, capabilities and evidence through polished visuals and useful interactions.
- Public brand: **MAHEEN HAMID**. Headline: **AI Engineer | Full-Stack AI Systems**. Public copy: English. “The Living Blueprint” is internal only.
- Next.js App Router, TypeScript, Tailwind, CSS/Motion and accessible HTML/SVG. No visitor authentication. Email-first Let’s Talk.
- Complete the frontend before backend/AI work. No website code is included in this planning delivery.

## Authoritative files

Latest owner corrections and this implementation order override conflicting older navigation, CLI or motion restrictions. Preserve unaffected specifications.

| Authority | Files |
| --- | --- |
| Approved content | `docs/01-discovery/PROJECT_BRIEF.md`, `USER_PROFILE.md`, `CONTENT_INVENTORY.md` |
| Strategy | `docs/02-strategy/REFERENCE_AUDIT.md`, `CREATIVE_DIRECTION.md` |
| Experience, subject to latest corrections | `docs/03-experience/SITE_MAP.md`, `UX_STORYBOARD.md`, `MOTION_SPEC.md`, `PORTFOLIO_WIREFRAMES.pdf` |
| Corrected system specifications, v1.1 | `docs/04-system/DESIGN_SYSTEM.md`, `TECH_ARCHITECTURE.md`, `AI_ASSISTANT_SPEC.md` |
| Execution and completion | This file and `ACCEPTANCE_CHECKLIST.md` |

Filenames after the first entry in each row share that row's directory. Use Phase 4 for detailed tokens, component states, schemas, budgets and security rules; do not re-plan them.

## Exact navigation and routes

**Home | About | Projects | Lab | Let’s Talk** → `/`, `/about`, `/projects`, `/lab`, `/contact`.

Additional routes: `/projects/[slug]` (published cases only), `/lab/systems`, `/lab/assistant`, `/lab/matcher`, `/lab/how-it-works`, `/lab/terminal`, `/privacy`. Include a branded 404. Search and Terminal are global utilities; all Systems and AI experiences sit under Lab.

## Five implementation stages

| Stage | Deliverable / exit condition |
| --- | --- |
| **1. Foundation** | Next/TypeScript setup; tokens and approved high-contrast variant; responsive shell; typed public content; reusable UI; static mock adapter. No provider credentials or backend infrastructure. |
| **2. Complete Frontend** | Every page and responsive state; avatar storytelling and polished motion; functional local search and complete safe CLI; deterministic Systems lessons; mocked Assistant, Matcher and workflow interfaces. Deliver the first milestone below. |
| **3. Frontend Review and Refinement** | Review every route in the browser on desktop/mobile, keyboard and reduced motion. Fix visual, interaction, accessibility and performance issues. Obtain explicit approval of the working frontend before Stage 4. |
| **4. Backend Integration** | After approval: API handlers, input/output validation, security, distributed Redis quotas and failure handling. Verify provider/hosting eligibility and account limits. Test contracts with stubbed inference before live AI. |
| **5. AI Integration and Deployment** | Integrate approved corpus/RAG and verified Groq configuration; validate citations, matcher and actual-event telemetry; test CLI ask. Verify privacy, quotas and deployment. Run production checks, then deploy and smoke-test. |

**Exact first milestone:** one locally runnable, complete browser-reviewable frontend—not only a landing page—with all listed page templates, responsive desktop/mobile layouts, polished motion, working navigation/storytelling, functional local search, functional safe CLI, interactive Systems lessons and clearly mocked Assistant/Matcher/workflow interfaces. All empty/loading/result/error/unavailable/cancel states must be reviewable. No API key, Groq, Upstash, RAG service or hosting decision is required. Project case layout is reviewed using an explicitly illustrative development fixture, excluded from public navigation, search and publication; no fabricated project slug goes live.

## Structure and reusable components

- `src/app`: pages, layouts and route states; API handlers only in Stage 4.
- `src/components/ui` and `shell`: Button, Link, Field, Dialog, Tabs, Status, Card, Wordmark, Header, MobileMenu, Footer, utility launchers and AppearanceControl.
- `src/features/search`, `terminal`, `lab`, `assistant`, `matcher`: SearchDialog/Results; Terminal/Input/Output; LabCard, SystemDiagram, Stepper, WorkflowTrace; AssistantPanel, EvidenceCard and MatchMatrix.
- `src/content`, `src/generated`, `src/mocks`: approved records, generated local search index, isolated demo fixtures/adapter.
- `src/server/ai`, `src/server/security`: later integration only. `public`: approved avatar/media/CV. `tests`: behaviour and integration checks.

## Page-by-page frontend build order

1. Shared shell and Home: identity, storytelling, avatar and primary actions.
2. About and Let’s Talk: confirmed profile, education, availability and contact links.
3. Projects and case template: honest empty state and reusable case layout.
4. Lab hub and Systems: functional labelled diagrams and step sequences.
5. Portfolio Terminal plus global Search/Terminal launchers.
6. Assistant, Matcher and How My AI Thinks: static demos and every interface state.
7. Privacy and 404; complete cross-page transitions and responsive refinement.

## Search and CLI

Search uses the local published-content index, including body text; supports reviewed aliases, result excerpts/anchors, keyboard selection, Cmd/Ctrl+K, no matches and index failure. No model calls or stored queries. Exclude draft cases and mock fixtures.

Complete CLI: `help`, `about`, `whoami`, `skills`, `projects`, `lab`, `experience`, `education`, `contact`, `resume`, `cv`, `clear`, `theme`, `open [destination]`, `search [query]`, `ask [question]`.

- `resume` and `cv` are aliases; `about`/`whoami` use the approved profile. Missing experience/CV content is `[DEFERRED]`.
- `theme` toggles Default/High contrast only; `clear` clears volatile history/output and stops active ask updates.
- `open` allowlist: home, about, projects, lab, systems, assistant, matcher, workflow, terminal, contact, privacy. Show trusted destination links; workflow maps to `/lab/how-it-works`.
- `search` uses global local search. `ask` uses the shared Portfolio Assistant only when AI is enabled; otherwise show an honest unavailable message and `/lab/assistant` link.
- No shell execution, eval, arbitrary URLs, filesystem access, command chaining or model-selected commands. Escape all input/output. Share live ask disclosure, validation, citations and quotas with the Assistant; no bypass.

## Lab, avatar and motion

- Systems is a real deterministic educational interaction. Assistant/Matcher/workflow demos use static data and explicit **Demo — static data** labels. Mock events never claim actual execution; no submitted text leaves the browser during the frontend milestone.
- Preserve premium native-scroll reveals, avatar-frame depth/cursor lighting, controlled backgrounds, animated data flow and page/Lab transitions. Pause small loops offscreen, on hidden tabs and through a visible control.
- Never warp faces, fake speech, hijack scrolling or gate content behind animation. Reduced motion delivers the complete static experience. Layered avatar assets: `[DEFERRED]`.
- Three.js is reserved for one meaningful future experience, never decorative-only or required for this frontend.

## Content and integration boundaries

- **Real:** approved identity, story, education, qualified capabilities, contacts, opportunity preferences and supplied avatar. CV existence is confirmed.
- **Placeholders:** labelled demo UI data and honest project empty states, never fabricated credentials, employment, metrics or project evidence.
- **[DEFERRED]:** CV asset/extraction, future case studies/media/results, experience details, relocation status, layered artwork, domain/repository and integration credentials/settings.
- Wukala-GPT is an ordinary project only; no academic/FYP wording or old repository link.
- Backend scope: `/api/assistant`, `/api/match`, schemas, security and shared quota controls. No public admin, contact API or account system.
- AI scope: approved-source retrieval, evidence-linked answers, matcher matrix and real event telemetry. Provider choice/limits, Groq, Upstash and hosting eligibility remain provisional until integration verification; they never block frontend work.

## Testing and deployment order

Frontend build/type checks → local search/CLI behaviour → browser review of every route/state → responsive/accessibility/reduced-motion/performance fixes → **frontend approval gate** → API/security/quota tests → grounded AI/citation/adversarial tests → verify privacy/provider/hosting configuration → production build and release checks → deployment and smoke test. Keep AI disabled on failure; never silently activate billing or publish mock results as live AI.

## Backend/AI implementation record — 1 October 2026

The owner approved the frontend milestone and authorized Backend + AI implementation. The planning sections above remain historical authority; their frontend-only mock/no-API descriptions no longer describe the current implementation. No additional planning phase or visual redesign was performed.

### Implemented features and boundaries

- Existing Next App Router application now owns both backend endpoints; no separate Python service, primary database, accounts, contact API or upload endpoint was added.
- `POST /api/assistant`: approved public lexical retrieval, deterministic structured facts/unknowns, one bounded server-side provider call where evidence allows, strict quote/source checks, honest fallback and actual events.
- `POST /api/match`: exact submitted requirement spans, up to 12 rows, qualified evidence categories, protected-trait exclusion, incomplete labels and profile-only scope. No CV content was invented; no score or hiring decision.
- Both APIs: typed strict JSON, exact-origin checks/CORS OPTIONS, size/token guards, safe errors, no-store responses, streaming NDJSON or buffered JSON, abort/deadline handling. GET returns 405.
- Groq GPT-OSS 20B default and configurable OpenAI-compatible server adapter; model, base URL, response format and compatible tokenizer configuration are environment-based. No client secrets, tool calls, provider-selected URLs/actions, retries or paid failover.
- Upstash REST atomic Lua reservations enforce shared approved IP/day/rolling/token limits and one generation lease; idempotent reported-usage reconciliation, conservative unknown consumption, cooldown and fail-closed outages. Only quota metadata persists, ≤48 hours; no prompt/result database or application logging.
- Assistant/Matcher static demonstration responses were removed from production. Both existing forms now submit to the real APIs with unchecked provider disclosure, retained-input failures, local stop/clear, verified excerpts and actual request events. Enabled CLI `ask` shares the exact Assistant transport/disclosure/quotas. All other CLI commands and search remain local.
- Systems and workflow teaching sequences intentionally remain deterministic/illustrative; the workflow links to actual Assistant/Matcher events. No fabricated execution traces or private reasoning are shown.
- Original design preserved; frontend changes are limited to integration controls/results/traces, honest labels, source anchors and actual privacy handling. All approved docs/assets are preserved.

### Data flow and implementation decisions

Explicit acknowledged user action → strict origin/body/schema/disclosure validation → reviewed/versioned public retrieval → deterministic response or atomic quota reservation → configured server-side provider → schema/exact quote/original requirement validation → safe result and sequenced server events → existing UI. CLI asks enter the same path. Clearing removes volatile local data; abort is best effort and cannot recall text already sent.

Quote-first output is the selected implementation of the approved evidence-safety boundary: models select evidence/category records, while server templates supply public prose. Reason: exact spans can be checked and new credentials/URLs never enter the accepted output. Tradeoff: less flexible synthesis than freeform paraphrases; fallback: labelled approved excerpts/keyword lookup. This is not a claim that a valid source quote proves semantic relevance.

Configuration details, activation gates, exact commands, environment variables, provider switching and manual verification are in README. `.env.example` contains empty placeholders only. Public disclosure settings are build-time; environment/provider changes require a production rebuild. Production inference currently requires verified Vercel client-IP provenance; local mode only permits loopback origins.

### Verification achieved

- Type-check, lint and production build passed; 18 generated routes plus two dynamic APIs.
- 24 backend tests passed, including actual ephemeral Redis Lua concurrency, reservation/reconciliation, limits, retention, outages and request/provider/evidence/CLI contracts.
- Production browser suite passed: all routes, every CLI command, search/failure/retry/focus, deterministic source responses, disabled AI, responsive widths 320/390/768/1280, high contrast, motion pause/reduced motion, no-JS content and axe accessibility checks. Measured initial script transfer 159 KB; fonts 117 KB; search/terminal additions 20 KB.
- AI browser contract suite passed using actual Next endpoints/UI, real Redis and a **synthetic upstream**: Assistant, Matcher, enabled CLI ask, actual traces, invalid citations, model 500/429, cancellation/stale updates, timeout, quota outage, validation/CORS/methods and affected mobile/axe checks. Actual app restart without its key verified UI/API `PROVIDER_NOT_CONFIGURED` and no upstream call.
- `npm run test:provider` deliberately reported **NOT RUN** because no genuine credentials/privacy verification were supplied. Synthetic contracts do not certify real Groq model behavior or Upstash account connectivity. Live-model end-to-end release approval is therefore **not achieved**.

### Remaining [DEFERRED] work and release requirements

| Item | Exact reason / activation requirement |
| --- | --- |
| Genuine Groq/Upstash account connectivity, real Assistant/Matcher/CLI inference and factuality evaluation | No credentials or verified account settings are available. Configure ignored server environment, verify ZDR/limits/token accounting, run `test:provider` and the README browser journeys before declaring live AI complete. Production never swaps in a fake model. |
| Public hosting/push/domain | No remote or public deployment was created. Verify Vercel commercial-use eligibility/cost, exact HTTPS origins and trusted IP quotas; deploy initially with AI off, then rebuild/enable only after account and release checks. |
| Alternative-host trusted-IP/Worker adapter | Approved initial target is Next/Vercel. No alternative runtime is assumed compatible; implement/test only if hosting selection requires it. |
| CV asset and approved extraction | CV existence is confirmed, but its file was not supplied. Matcher correctly remains profile-only. |
| Future case studies/results, experience, relocation, layered avatar, final polish/advanced animation | Explicitly deferred by owner or unavailable approved content; no evidence or assets fabricated. |

No core generative API is a placeholder. Its provider request path is implemented, but external account activation and real-model validation remain required. No payment or deployment is silently activated. The complete project ZIP excludes dependencies, build output, test screenshots and all secret environment files; it retains source, tests, package lock, empty `.env.example`, all planning documents, artwork and Git history.

## Supplied resume integration — 1 October 2026

- Original uploaded one-page CV is now published unchanged at `public/documents/maheen-hamid-resume.pdf`; SHA-256: `6d2adef4794ad8ff3e09b8200d642280d53816bb8905b9884804e7bf2e2fd6e9`. Resume asset availability is no longer deferred.
- `/resume` provides recruiter-friendly context, actual PDF preview, View Resume and Download PDF. `/resume/view` is an accessible full-page browser reader with a text alternative and original-file actions. No reconstructed resume or image-only download.
- The single `resume` config in `src/content/site.ts` controls document location and metadata; replacing the static PDF and updating that config requires no page redesign. Build generation rejects missing/non-PDF assets and supplies same-origin PDF.js resources. The viewer is lazy-loaded; mobile uses the full-page reading action.
- Work dropdown/mobile accordion, footer, homepage, About, `/hire-me`, local search and safe CLI resume/CV actions expose the real resume. `/hire-me` uses only approved capability/availability copy.
- Existing backend/provider/quota/security architecture is preserved. CV availability/source links are corrected. Full CV ingestion into the AI corpus is still separate; Matcher honestly remains profile-only, without fabricating imported resume evidence.
- Verified production PDF rendering/text, new-tab viewing and browser download byte equality with the actual upload; responsive widths 320/390/768, Work hover/click/keyboard/ESC/outside close, entry points, no-JS download links and axe checks passed. Production all-route/search/CLI/motion/accessibility regression suite passed. Type-check, lint, production build and 18 backend contract/evidence tests passed. Quota integration/account activation are unchanged by this scoped resume update; no new environment variables.

## Recruiter experience refactor — 1 October 2026

This record implements the owner’s attached refactor instructions and supersedes earlier single-turn/excerpt-only, high-contrast, profile-only and simple-navigation descriptions. All historical Phase 1–5 planning files and the original avatar/PDF remain intact.

- **Mira:** shared root-session chat with natural message bubbles, compact expandable sources, optional observable-event details, global Ask Mira drawer and homepage CTA. Full route remains `/lab/assistant`. Sources open their pages and close the drawer; keyboard focus/ESC/modal boundaries remain functional.
- **Consent/context:** one provider/privacy-disclosure acceptance is stored in `maheen.ai-consent`, keyed to its version. No transcript persists. Up to 20 local messages; up to six prior messages (≤1,400 characters each) enter the next server request as untrusted context. Clear/reload removes chat. Matcher and enabled CLI ask reuse consent. No inference on open/typing.
- **Hybrid RAG:** local TF-IDF/SVD latent semantic vectors, cosine similarity and BM25, weighted reciprocal-rank fusion and recruiter-intent reranking. Identity routing precedes stop-word filtering; unsupported tenure/employers remain unknown. Local LSA avoids a new embedding processor/cost; it is weaker than a pretrained neural encoder. Lexical fallback survives vector failure. No visitor-vector database/cache.
- **Corpus:** reviewed supplied-CV summary/skills, Wukala-GPT statements and existing approved profile/capabilities are centralized in `src/content/knowledge.ts`. Owner qualifiers remain intact; original source PDF is unchanged. No academic project label, old Wukala repository link, invented employment, metrics or credentials enters authored public evidence.
- **Answer contract:** real natural `answer`, simple claims/source IDs and limitation codes. Assistant evidence quotes are resolved from trusted records on the server. Validation checks schema, retrieved source membership, evidence presence and targeted credential/number/qualification/protected-trait guards; no answer/claim equality, lexical-overlap percentage or capitalization checks. Provider/parse/assistant-validation failures return typed errors and a labelled source fallback, with a deliberate retry control. Matcher retains exact job/evidence quotes and its distinct validation. These checks do not guarantee semantic truth; real-provider evaluation remains required.
- **Matcher:** Analyze fit explicitly acknowledges non-confidential text, uses the existing `/api/match`, then displays a natural factual summary and Matched/Partial/Not evidenced groups with compact evidence. Exact requirements, protected-trait exclusion, no percentage/hiring verdict and quota limits are preserved.
- **Tech Explainer:** `/lab/explainer`, 13 authored topics, local query routing/chips, explanation/example/work connection and typed node/edge/label SVG with a text alternative. No generated images, visitor Mermaid, HTML/eval or provider call. All diagrams are illustrative, not execution traces.
- **Terminal:** MAHEEN monospace/ASCII-style command center, `maheen@portfolio ~ %`, fullscreen/modal/mobile chrome, autofocus/history/tab completion/ESC. All 16 allowlisted commands remain; resume/CV aliases, local search and safe open destinations are preserved. Quoted ask text is data; no shell/eval/filesystem actions.
- **Navigation/footer:** Home | Work | Writing | Playground | About | Contact; accessible hover/click/keyboard dropdowns, mobile accordions, full footer groups/social icons and a reserved footer strip for controls.
- **New content routes:** `/writing`, `/writing/[slug]`, `/uses`, `/certifications`, `/lab/explainer`. Writing and verified credential arrays remain genuinely empty. Unknown hardware/editor and future case studies remain `[DEFERRED]`. About is expanded; Hire Me and real resume entry points are preserved.
- **Content editing:** `src/content/site.ts` owns future Writing/Certifications/Uses, navigation, prompts, profile, capabilities and resume; `projects.ts` owns cases; `knowledge.ts` separately reviews AI facts; `explanations.ts` owns authored diagrams. Publishing a PDF does not automatically ingest new claims.
- **Theme:** real Light/Dark role variables, pre-hydration preference/system bootstrap, accessible Sun/Moon toggle and persisted `maheen.theme`. No High Contrast variant remains in the current interface. Complete static reduced-motion experience is preserved.
- **Backend/deployment:** existing `/api/assistant` and `/api/match`, server-only Groq/configurable adapter, strict validation/origins, atomic Upstash quotas, deadlines/cancellation and privacy gates are retained. No new environment variables or services. Next serves both frontend/backend with `npm run dev` on port 3000. Environment changes affecting public disclosure require a rebuild.

Verification and manual commands are in README. Synthetic provider/browser tests exercise the actual application and real Redis Lua; they are not real Groq inference. Genuine account keys/settings were not supplied, so live-account inference/factuality, Upstash account connectivity and public hosting remain `[DEFERRED]`. Do not call live-model release verification complete until `test:provider` and the real-account browser journeys pass. Advanced cinematic motion and final case studies/content remain intentionally deferred by the owner.


## Master upgrade implementation — 3 October 2026

This record supersedes earlier authored-only Explainer, keyword Matcher fallback, empty Writing, bottom controls and evidence-panel descriptions. Existing Next/server/quota architecture remains authoritative; no planning restart.

- Mira routes conversation, technical, portfolio and mixed intents. Casual/technical messages reach the existing provider without portfolio retrieval; personal facts use the reviewed corpus. Natural synthesis remains accepted and unknown employers/tenure remain unknown.
- Existing `/api/assistant` and `/api/match` are preserved; new `/api/explain` uses the same handler/provider/origin/privacy/token/quota controls with a typed topic and structured explanation/Mermaid response. No new backend application or secret variable.
- Provider authentication/strict JSON parsing remain intact. Matcher validation failures are typed failures, not keyword results. Literal role/evidence spans, protected-trait handling and tenure limits remain; lexical keyword veto was removed.
- Chat/comparison omit public Sources/Why/scope/provider/debug panels. Privacy disclosure is one unobtrusive acceptance and the Privacy page. Matcher renders Role Snapshot, Strong/Partial/Gaps, Best Evidence and practical actions; progress follows actual events.
- Runtime Mermaid is lazy-loaded, strict, themed and bounded; active directives/HTML/links/callbacks are rejected. Malformed SVG/syntax has an accessible text fallback while the explanation remains readable.
- Six substantive articles and twelve short Learning Notes include metadata, primary docs, useful code/diagram blocks, related/previous/next links and search. Central files: `writing.ts`, `ecosystem.ts`, `projects.ts`, `site.ts`, `knowledge.ts`.
- Wukala-GPT case uses existing CV contribution/stack statements only; no demo, screenshots, metrics, old repository or academic label. Unpublished credentials remain an honest empty collection.
- About/Uses distinguish documented Current stack, Learning focus and Exploring tools without proficiency claims. Hire Me presents contribution, project proof, approach and full-time/internship/selected project paths.
- Navbar contains icon theme/pause controls and meaningful dropdown icons. Original fast curtain reveal, terminal-style hero signal, restrained portrait/grid motion and card depth respect pause, reduced motion, offscreen visibility and hidden tabs.
- Public GitHub links now use `https://github.com/22101356-Maheen`. Original resume PDF and avatar are unchanged. All approved planning files remain.
- Live Groq/hosted Upstash verification and deployment are intentionally unverified by user instruction. No temporary secret was stored, committed or archived. Tests use explicit synthetic provider contracts plus real local Redis, not fake production AI.

Run/setup/security/maintenance instructions and manual product journeys are in the current README. External model quality and deployed account limits/privacy/IP handling must be verified before declaring a live release.


## Final stabilization and verification — 3 October 2026

Confirmed pipeline causes in the recovered implementation history: silent provider parse failure, lexical retrieval/content-validation vetoes on natural synthesis, and degraded fallback results being handled too similarly to success. The recovered provider already used a Bearer header; no missing-header failure was reproduced. Its final authentication normalization, robust whole/fenced JSON parsing and safe development diagnostics are preserved. Contract compatibility is verified by TypeScript and tests, not assumed.

Assistant answer/claim equality, source wording reproduction, capitalization and lexical-percentage policing are absent. Trusted source membership, genuine evidence for personal portfolio support, hard credential/tenure/metric guards, qualifiers, protected-trait exclusions and prompt/data separation remain. Matcher retains literal job/evidence spans and conservative tenure rules while accepting semantic support. Role Snapshot/actions cannot invent explicit personal credentials.

Final recovery fixes were limited to stale generated development route types (regenerated, no source types suppressed), the shared central-content loader used by resume/build tests, bounded completed hero typing, and measuring runtime Mermaid bounds in its actual sanitized host to avoid clipping.

Final results: zero TypeScript errors; ESLint clean; 141 tests/5 files passed; production build passed (45 generated pages); AI contract browser, production browser and original-PDF browser suites passed. All six Mira acceptance questions passed through actual UI/API; synthesis used an explicit synthetic upstream, never a claimed real Groq call. Real local Redis Lua/security controls passed. Original avatar and original PDF bytes are retained; all approved planning documents remain.

External Groq/hosted Upstash/account privacy/latency/factuality and actual deployment are unverified by user instruction. No live-verification key was stored, committed or archived. No further refactor follows the clean final checks.

### Exact delivered working-tree file map

Paths below reflect the complete saved project changes against its existing Git baseline, including work retained from the interrupted runs. New/untracked files are included in the ZIP. Historical planning files not listed remain preserved.

**Server/config/security flow**

- `src/server/ai/diagnostics.ts`
- `src/server/ai/intent.ts`
- `src/server/ai/payloads.ts`
- `src/server/ai/provider.ts`
- `src/server/ai/retrieval.ts`
- `src/server/ai/semantic.ts`
- `src/server/ai/service.ts`
- `src/server/ai/validation.ts`
- `src/server/config.ts`
- `src/server/http/handler.ts`

**Feature contracts and interfaces**

- `src/features/ai/Evidence.tsx`
- `src/features/ai/consent.tsx`
- `src/features/ai/contracts.ts`
- `src/features/ai/messages.ts`
- `src/features/ai/transport.ts`
- `src/features/ai/useAiRun.ts`
- `src/features/assistant/AssistantPanel.tsx`
- `src/features/assistant/MiraContext.tsx`
- `src/features/ecosystem/Ecosystem.tsx`
- `src/features/explainer/DiagramView.tsx`
- `src/features/explainer/MermaidDiagram.tsx`
- `src/features/explainer/TechExplainer.tsx`
- `src/features/explainer/diagram-safety.ts`
- `src/features/lab/WorkflowDemo.tsx`
- `src/features/matcher/MatcherPanel.tsx`
- `src/features/projects/CaseStudy.tsx`
- `src/features/terminal/Terminal.tsx`

**Central approved/published content**

- `src/content/ecosystem.ts`
- `src/content/explanations.ts`
- `src/content/knowledge.ts`
- `src/content/projects.ts`
- `src/content/site.ts`
- `src/content/writing.ts`

**Pages/routes/styles/metadata**

- `src/app/about/page.tsx`
- `src/app/api/explain/route.ts`
- `src/app/certifications/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/globals.css`
- `src/app/hire-me/page.tsx`
- `src/app/lab/assistant/page.tsx`
- `src/app/lab/explainer/page.tsx`
- `src/app/lab/how-it-works/page.tsx`
- `src/app/lab/matcher/page.tsx`
- `src/app/lab/page.tsx`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/projects/page.tsx`
- `src/app/sitemap.ts`
- `src/app/uses/page.tsx`
- `src/app/writing/[slug]/page.tsx`
- `src/app/writing/page.tsx`

**Shared components/motion/navigation**

- `src/components/Atmosphere.tsx`
- `src/components/AvatarFrame.tsx`
- `src/components/HeroSignal.tsx`
- `src/components/Navigation.tsx`
- `src/components/Page.tsx`
- `src/components/Shell.tsx`
- `src/components/theme.ts`

**Local CLI/theme helpers**

- `src/lib/terminal.ts`
- `src/lib/theme-bootstrap.ts`

**Generated reviewed corpus/search**

- `src/generated/knowledge.json`
- `src/generated/search-index.json`

**Build and verification scripts**

- `scripts/ai-browser-check.mjs`
- `scripts/content-module.mjs`
- `scripts/generate-search.mjs`
- `scripts/portfolio-browser-check.mjs`
- `scripts/preview-check.mjs`
- `scripts/provider-smoke.mjs`
- `scripts/resume-browser-check.mjs`

**Automated regression coverage**

- `tests/backend.test.ts`
- `tests/mira-stabilization.test.ts`
- `tests/mira.test.ts`
- `tests/product-upgrade.test.ts`

**Approved public-profile corrections**

- `docs/01-discovery/CONTENT_INVENTORY.md`
- `docs/01-discovery/USER_PROFILE.md`

**Generated public search/version**

- `public/content-version.json`
- `public/search-index.json`

**Project dependencies, generated declarations and delivery instructions**

- `IMPLEMENTATION_HANDOFF.md`
- `README.md`
- `package-lock.json`
- `package.json`


## Resumed recovery — 3 October 2026

Continued from the newer saved upgrade after inspecting the prior working tree and original final archive. Removed the server error path that attached source/keyword fallback results and deleted its unused debug/evidence renderer. Added requirement-specific AI explanations to the Matcher schema, policy and checked output, with regression coverage. Removed the empty-retrieval generation gate while preserving unknown-hard-fact guards. Corrected actual tool usage across ten ecosystem categories and hardened the category icon rendering. Simplified remaining visitor-facing operational copy. Synchronized system theme preferences at subscription startup.

Final checks executed in this recovery: 144 tests/5 files, TypeScript, ESLint, production build, AI browser contracts, production browser and original-PDF browser suites all passed. Provider browser tests use a synthetic upstream and actual local Redis; no genuine Groq inference or hosted Upstash verification was performed because account credentials were not supplied. See RECOVERY_VERIFICATION.md for the final scope, checks and setup.

## Latest continuation — 3 October 2026

This entry supersedes earlier notes/status-filter/global-tiny-quota descriptions. The existing completed source was retained and incrementally upgraded. The runtime now has independent signed-session windows (30 Mira / 10 Explainer / 10 Matcher per ten minutes), generous loopback development budgets, tolerant explanation text plus independent Mermaid recovery, bounded same-Groq configuration fallback and true HTTP failure statuses. No keyword fake-success path exists.

The published writing collection now contains exactly six illustrated research-backed articles; notes routes/links/data and the unused static topic catalogue/preview fixture were removed. Uses has a single purpose-based engineering ecosystem without status labels. Hire Me uses the uploaded professional photo. Home, shared cards/results/dropdowns, viewport curtain and whole-page theme transitions received the final motion pass. Pause Motion and reduced motion remain.

Current validation and limits, live-provider boundaries, preserved asset hashes and delivery contents are documented in RECOVERY_VERIFICATION.md and README.md. ARTWORK_PROVENANCE.json records the generated cover prompts and optimization. No provider credential or deployment is claimed.
