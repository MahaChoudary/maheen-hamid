# Technical Architecture

Phase 4 · Version 1.1 · 30 September 2026 · Owner-requested corrections applied; Phase 5 handoff follows

Planning only: no application, infrastructure, accounts or deployment are created. Phase 1 content remains authoritative. Latest owner instructions supersede the older Phase 3 navigation, separate top-level Labs and terminal exclusion. All limits below are either a prior documentation snapshot or application decisions, never measured production capacity; provider facts require integration-time verification.

## 1. Architecture decision

Use **Next.js App Router + TypeScript**, predominantly statically generated Server Components, with small client islands for search, terminal and Lab controls. Use Tailwind utilities backed by the exact design tokens; use CSS for basic transitions and Motion for coordinated Lab/panel transitions. Git-backed typed content supplies pages, search, terminal and assistant knowledge. After frontend approval, Node route handlers are planned to call **Groq `openai/gpt-oss-20b`**, with Upstash Redis for distributed quotas only. Both provider selections and their limits remain provisional until integration verification. No primary database, CMS, vector service, Python service or authentication is needed at launch.

Reason: most content is static and the approved corpus is small. Tradeoff: updates require a build, and lexical retrieval has less semantic reach than embeddings. Fallback: static pages, local search, local terminal and source excerpts remain useful when every AI dependency is unavailable.

Deployment target is Vercel with GitHub integration. **Do not assume Vercel Hobby eligibility:** the public copy includes selected freelance availability. Its commercial-use classification must be settled before production; do not remove approved content to fit a plan. Free-first fallback is Next static export on Cloudflare Pages plus a small same-origin Worker API adapter. Paid Vercel requires a later explicit spending decision; nothing in this phase authorizes charges.

### Required implementation order

1. **Foundation:** establish Next/TypeScript, tokens, shared shell, public content and mock contracts without backend services.
2. **Complete Frontend:** finish every responsive page, storytelling and polished motion, functional local search, the complete safe CLI, deterministic Systems lessons and mocked Assistant/Matcher/workflow interfaces. Implement every loading, empty, result, error, unavailable and cancellation state.
3. **Frontend Review and Refinement:** inspect the working frontend in the browser on desktop/mobile, keyboard and reduced motion; refine it and obtain explicit frontend approval.
4. **Backend Integration:** only after that approval implement API routes, validation, Redis/quota controls and backend tests.
5. **AI Integration and Deployment:** verify Groq/model/privacy settings, implement retrieval/RAG and evidence checks, connect real events, then validate deployment configuration and release.

Groq, Upstash, hosting eligibility, account settings and provider limits are provisional integration concerns. They must not block frontend development or local browser review. Frontend mocks call no API, model or quota service, contain no secrets, and are visibly labelled **Demo — static data**. Use a replaceable client adapter; do not implement backend handlers simply to support mock states. The first milestone is the complete browser-reviewable frontend at the end of Stage 2, followed by Stage 3 approval. These stages are defined concisely in IMPLEMENTATION_HANDOFF.md.

## 2. Final routes and navigation

| Route | Page / ownership |
| --- | --- |
| `/` | Home; public brand MAHEEN HAMID |
| `/about` | About and owner-approved capability profile |
| `/projects` | Published project collection; honest empty state |
| `/projects/[slug]` | Build-generated approved case studies only |
| `/lab` | Hub with Systems, AI experiences and Portfolio Terminal |
| `/lab/systems` | Deterministic educational walkthroughs |
| `/lab/assistant` | Ask about Maheen plus actual-request trace |
| `/lab/matcher` | Resume–Job Matcher against Maheen's sources |
| `/lab/how-it-works` | Clearly illustrative workflow; link to actual traces in assistant/matcher |
| `/lab/terminal` | Dedicated accessible terminal page |
| `/contact` | Let’s Talk; email, phone and professional links |
| `/privacy` | Actual submitted-text and provider handling |

Navigation is exactly **Home | About | Projects | Lab | Let’s Talk**. Lab subroutes do not add main-menu entries. All Lab siblings have local navigation. Global search and terminal launchers are utilities. No `/systems` or `/ai-lab` public destinations in the new build; if those older routes were ever deployed, redirect to `/lab/systems` and `/lab/assistant`. They are not known to have been deployed. “The Living Blueprint” never becomes a public title.

Unknown paths produce a normal branded 404 with Home, Projects and Lab links. Draft slugs return 404. Static export pre-generates every published slug; no runtime draft lookup.

## 3. Proposed code and component boundaries

The following are future folder responsibilities, not files created in this phase.

| Planned location | Responsibility |
| --- | --- |
| `src/app` | Root layout, route pages, loading/error/not-found boundaries, metadata and route handlers |
| `src/components/ui` | Button, Link, Field, Dialog, Tabs, Status, Card; semantic accessible primitives |
| `src/components/shell` | Wordmark, approved navigation, mobile menu, footer, utility launchers |
| `src/features/search` | Lazy index, pure ranking, combobox results, static directory fallback |
| `src/features/terminal` | Parser, command registry, pure result types, transcript and input |
| `src/features/lab` | Stepper, labelled SVG diagrams, trace list and no-motion variants |
| `src/features/assistant` | Input, evidence cards, request state and transport adapter |
| `src/features/matcher` | Job input and evidence matrix renderer |
| `src/mocks` | Frontend-only static fixtures and deterministic state adapter; excluded from public search/RAG |
| `src/server/ai` | Provider adapter, retrieval, schema validation and response checks; server-only |
| `src/server/security` | Request validation, origin checks, atomic quotas, logging redaction |
| `src/content` | Reviewed public profile, projects, Lab explanations and source registry |
| `src/generated` | Build outputs: search index, retrieval corpus, content manifest |
| `public` | Optimized avatar, approved media and CV asset once supplied |
| `tests` | Unit, content integrity, accessibility, browser journeys and AI fixtures |

Server Components own readable content and source lookup. Client islands own only state and browser APIs; never mark the root layout as a client component. Pages work as ordinary HTML before client hydration. Search/terminal load when opened; Lab model UI loads only on its routes. Use semantic HTML for controls, a tested accessible dialog primitive, and inline SVG for diagrams. No general state-management package: local reducers plus a single shell overlay coordinator are sufficient. Only one global modal is open at once.

## 4. Content and evidence architecture

Recommendation: schema-validated JSON records plus reviewed Markdown articles, with raw HTML and executable MDX disabled. GitHub is the editing and review system. This avoids a public admin surface and ensures one review can update all consumers. Tradeoff: nontechnical editing is less convenient; fallback is editing plain Markdown through GitHub, not adding a CMS prematurely.

| Record | Required fields / validation |
| --- | --- |
| Profile | Name, exact headline, public contacts, availability, story, qualified capability labels, approval version |
| Project | Stable ID, slug, title, publication state, summary, approved article, optional verified evidence/media; unknown fields omitted |
| Source | ID, public route and anchor, title, text, source type, reviewed date, content version, public approval flag |
| Lab lesson | ID, title, learning purpose, steps, relationships, illustrative label, accessible prose alternative |
| CV | Confirmed availability flag; file path/version and extracted approved sections only after asset supplied |

Validate internal anchors, external HTTPS URLs, unique IDs and slugs at build time. Only `published` + approved content enters public pages, sitemap, search, CLI or retrieval. Future project placeholders remain authoring records, excluded from outputs. Wukala-GPT is an ordinary project; reject academic/FYP labels and its prohibited old repository reference. No old URL needs to be rediscovered to enforce the rule: require explicit review of any future Wukala evidence URL.

No raw planning documents in the public corpus: they include internal concepts and tentative decisions. Produce a reviewed public profile source from them. Publication creates a content-version hash; index, source registry and retrieval artifact share it. No remote crawling or runtime GitHub/LinkedIn imports. CV existence is confirmed; file ingestion is deferred, so no broken download and no invented resume content.

## 5. Global search implementation

Use build-generated local full-text records and a small deterministic token/prefix ranker. Index page titles, headings, approved body excerpts, project tags and Lab topics. Weight title 5, heading 3, tags 2, body 1; exact title wins, then exact phrase, token matches and prefix matches; stable ties use title. Normalize Unicode, case and whitespace. Curated aliases such as “resume/CV” and “contact/Let’s Talk” are reviewed content. Do not claim semantic search.

Search is genuinely functional without AI or a backend endpoint. Lazy-load one versioned index, target ≤100 KB gzip; debounce 100 ms, maximum query 120 characters, return up to 10 results with deterministic excerpts and real internal anchors. Full-text matching includes all published text, not just navigation. Load failure exposes the page directory and a manual Retry. A no-JavaScript visitor gets normal page links; interactive search is a progressive enhancement.

Do not index phone/email as independent auto-suggest records; Contact remains searchable. Do not record queries. Keyboard, touch, empty/loading/no-result/error states follow DESIGN_SYSTEM.md. Fallback for a future index above budget: separate page/category indexes, preserving local search before considering a service. Test ranking with real approved content and missing-project fixtures.

## 6. Safe predefined CLI engine

Implement an in-browser finite command registry, not a shell, sandbox VM or AI tool. A parser returns typed actions such as text, source links, navigation suggestions, theme toggle, assistant request and clear. All commands are local except the explicit `ask` bridge to the Portfolio Assistant after AI integration is enabled; no command has arbitrary network access. No `eval`, dynamic code, subprocess, filesystem, package installation, URL fetching, scripting, tool calling or hidden admin command.

| Command | Defined result |
| --- | --- |
| `help` | Complete allowlist and syntax |
| `about` or `whoami` | Approved profile summary |
| `skills` | Owner-approved capability groups with their qualifiers |
| `projects` | Published project titles/links, or honest empty state |
| `lab` | Lab tool directory |
| `experience` | Approved experience only; otherwise `[DEFERRED] Experience details have not been supplied` |
| `education` | Confirmed education; omit unsupplied dates/credentials |
| `contact` | Confirmed public contact details and user-activated links |
| `resume` or `cv` | Exact aliases: real CV link when asset exists; otherwise confirmed availability, `[DEFERRED] CV file`, and email request link |
| `theme` | Toggle only approved Default / High contrast variants; announce selected variant |
| `open [destination]` | Offer a trusted internal link; allowed destinations: home, about, projects, lab, systems, assistant, matcher, workflow, terminal, contact, privacy; map to Section 2 routes, with workflow → `/lab/how-it-works` |
| `search <query>` | Same local search engine, result links in transcript |
| `clear` | Clear transcript and in-memory command history; abort active ask client request |
| `ask [question]` | If AI enabled, use the shared Portfolio Assistant client, disclosure, API validation, evidence rendering and quotas. Otherwise show “AI assistant is currently unavailable” and `/lab/assistant`; never substitute a fake answer |

Accept leading/trailing whitespace and case-insensitive command names. A single plain-text argument tail is allowed for search or ask; ask questions may contain punctuation, always treated as inert text. No shell quote expansion or command chaining is parsed. Maximum total input 1,024 characters; ask argument ≤1,000, search argument ≤120, other commands ≤240. Reject shell operators/substitution in command position and invalid destination/extra arguments with a syntax message; never execute them, even if present in a question. Render all echoed input as text. Unknown commands never reach a server. `contact` does not send a message; `open` does not secretly open a new tab. External contact/profile links require deliberate activation.

Provide help chips, Tab completion for the allowlist, Up/Down history while input is focused, Escape to close a global panel, and ordinary text selection. Keep at most 50 commands / 100 output blocks in memory; announce trimming. No persistent terminal history or stored questions; theme preference is current-visit memory only. The frontend milestone implements ask as an honest unavailable state and assistant-page link; separate Lab demos remain clearly mocked. After integration, only explicit ask submission can call the assistant, and clear/cancel prevents stale output. This is a functional portfolio interface, not a claim that Linux commands execute. Fallback: visible command directory and ordinary links if JavaScript is disabled.

## 7. Backend API contracts

Two POST handlers only; no contact form endpoint, uploads, visitor accounts, retrieval API or general proxy.

| Route | Input | Successful output |
| --- | --- | --- |
| `/api/assistant` | Question ≤1,000 characters; client request ID for UI correlation only |
|  |  | Actual stage events and one validated answer with source IDs, status, content version and usage summary |
| `/api/match` | Job description ≤6,000 characters; explicit submission acknowledgement |
|  |  | Actual stage events and evidence matrix, scope label, source IDs and unassessed requirements |

Both reject unknown JSON keys, wrong content type, empty/invalid input and request bodies above 32 KB before inference. Token budget is an additional check; character limits are not token estimates. Server assigns authoritative run ID. Fetch POST consumes an event stream; stream only stage metadata and the final validated payload, never unchecked model tokens or private reasoning. If streaming is unsupported, buffer the same final payload and show Pending/Complete only.

Set no-store on request responses. Before streaming: 400 invalid, 413 oversized, 415 unsupported type, 429 quota with Retry-After where known, 503 service disabled/unavailable. After stream begins: a typed terminal error event carries a safe message; do not pretend HTTP status can change. Client rejects stale run IDs. Abort on cancel/disconnect and a 25-second overall deadline; cancellation is best effort and may still consume provider quota. No automatic model retries or repair calls. Unexpected output uses safe evidence fallback.

## 8. Security, authentication and quotas

**No visitor authentication.** There is no private visitor data, write access or member benefit to justify it. GitHub/Vercel owner accounts use MFA and least privilege outside the public app. No lead gate. Authentication would not replace rate limiting if later added.

Use server-only secrets, strict input/output schemas, escaped text rendering, HTTPS, same-origin POST checks and a tight CORS policy. Origin checks deter browser cross-site use; they are not bot authentication. Only trust the deployment platform's documented client-IP value after its proxy handling, never arbitrary forwarded headers. Hash the normalized IP with an HMAC secret and UTC date before quota storage. No plaintext IP in application logs or Redis; host infrastructure may independently process IPs.

Start with CSP default-src self, narrowly scoped connect-src for same-origin UI calls, frame-ancestors none, object-src none, base-uri self, plus nosniff and strict-origin-when-cross-origin referrer policy. Final script policy must be tested against Next hydration: use build-time hashes where supported rather than silently breaking the app or claiming an untested strict CSP. Provider secrets are never browser connect targets. Public model output allows plain text and validated source-link components only, no HTML, scripts, arbitrary Markdown images or model-generated external URLs.

Use Upstash atomic operations for per-IP-hash, global, token and concurrency limits. In-memory counters alone are not sufficient across serverless instances. A signed, short-lived anonymous session can improve UX but never bypass IP/global ceilings.

| Application limit (decision, not provider quota) | Value |
| --- | --- |
| Per daily IP hash, all AI endpoints combined | 3 requests / rolling 10 minutes; 10 / UTC day |
| Matcher subset | 2 requests / UTC day |
| Global AI requests | 20 / UTC day |
| Global reserved model tokens | 6,000 / rolling 60 seconds; 100,000 / UTC day |
| Global in-flight inference | 1 request; other callers receive busy/retry, no durable queue |
| Assistant model envelope | Input ≤3,500 tokens; completion including reasoning ≤1,200 |
| Matcher model envelope | Input ≤4,500 tokens; completion including reasoning ≤1,500 |

Count with the selected model's compatible tokenizer and conservative message overhead before sending; verify accounting against provider usage in integration tests. If reliable counting is unavailable, keep live AI disabled rather than treating characters as exact tokens. Request and token reservations are atomic; a run lease expires after 30 seconds. Reconcile downward only with confirmed usage or a request definitely never sent; keep the full reservation if usage is unknown. Cancelled requests may still consume tokens. Do not expose raw remaining global balance publicly. Shared networks may hit limits early; static source access remains available.

Quotas fail closed for AI if Redis fails. Provider 429 opens a cooldown using provider headers; provider failure leaves deterministic tools intact. Do not poll continuously. No automatic paid tier, alternate provider, key rotation or account cycling to bypass limits.

## 9. Avatar, animation and graphics boundaries

Responsive static avatar via Next image handling on Vercel; pre-generated AVIF/WebP plus fallback image for static export. Reserve aspect ratio to prevent layout shift. Load only the above-fold appropriate size eagerly; lazy-load other media. Use subtle avatar-frame depth and cursor-responsive lighting within DESIGN_SYSTEM.md bounds; touch uses static lighting. Layered-avatar animation is allowed only when proper approved assets exist: [DEFERRED]. Face warping and fake speaking remain prohibited.

CSS owns hover/focus and reduced-motion rules. Motion owns premium page/Lab transitions, native-scroll section reveals, bounded frame depth/lighting, controlled environmental animation and user-triggered system/data-flow sequences. Small ambient loops pause offscreen/hidden-tab and through a visible motion control; reduced motion provides the complete static experience. **GSAP is not installed at launch**: no approved choreography requires a second animation engine. If future approved work needs complex timed SVG sequences, isolate GSAP to that lazy Lab module and never let it and Motion animate the same property. **Three.js is optional for one meaningful future Lab experience**, never decorative-only and never required for the initial frontend. Any later use must be click-to-load, explain a system relationship, handle context loss and provide an equivalent 2D experience without a hero dependency. Current Lab diagrams are SVG plus HTML.

Reason: preserves the concept with predictable accessibility and cost. Tradeoff: less visual spectacle. Fallback: all selected states render instantly; no library is necessary to understand a system.

## 10. SEO, performance and resilience

Public pages render title, description, canonical URL, headings and readable content without AI. Generate sitemap/robots from published records, exclude API responses/drafts/previews, and add truthful Person/WebSite structured data using confirmed links only. Social preview uses MAHEEN HAMID and the approved headline; no unsupported job title/seniority, ratings or project claims. Lab responses are ephemeral and never indexed. Project metadata exists only for published cases.

Engineering budgets: core route first-load JS target ≤170 KB gzip including framework; lazy search+terminal additions ≤60 KB combined excluding index; mobile hero ≤220 KB, desktop ≤350 KB; all fonts ≤160 KB. Targets for field 75th percentile when measurable: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1. These are planned targets, not achieved results. Measure a production build on a midrange mobile profile and throttle; remove enhancements before relaxing content readability. No analytics, session replay or third-party embeds at launch. Local browser audits and platform aggregate usage are enough initially.

Offline/static fallback: already loaded HTML remains readable; local search works once its index is loaded. No service worker or offline guarantee. No-JS pages retain normal navigation, contact links and Lab prose. AI forms display a clear JavaScript requirement. At 320 px and 200–400% zoom, diagrams stack and dialogs stay operable; keyboard and screen-reader parity are release requirements.

## 11. Test strategy

Use Vitest for pure logic/schema tests and Playwright for real browser journeys, with axe checks plus manual keyboard/screen-reader review. This describes later testing; none is reported executed.

| Risk | Required evidence before release |
| --- | --- |
| Unapproved facts leak | Build rejects drafts; search/CLI/RAG expose the identical reviewed content version |
| Search appears decorative | Queries find body text, aliases and projects; Enter, Escape, no matches and failed index verified |
| Terminal becomes unsafe | Every allowlisted command; arbitrary URL, shell syntax and HTML input remain inert |
| AI invents qualifications | Golden evaluation set covers absent CV, project gaps, malicious job text and citation mismatch |
| Quota races / outages | Parallel requests respect atomic reservations; Redis failure prevents model call |
| Stale/cancelled response | Cancel and new request cannot overwrite each other; timeouts stop pending UI |
| Mobile/accessibility regressions | 320/390/768/1280 widths; keyboard, touch, zoom, forced colours and reduced motion |
| Broken release | Production build, internal links/anchors, metadata, optimized images and bundle budgets |

CI uses mocks, never live personal prompts or paid model calls. A small deliberate provider smoke test uses synthetic/public text and the real configured quota. Test matcher logic with reviewed synthetic examples; do not assert every model wording is identical.

## 12. Environment and deployment

| Variable | Exposure / decision |
| --- | --- |
| `SITE_URL` | Server/build canonical production origin; public by nature |
| `GROQ_API_KEY` | Secret; server only |
| `GROQ_MODEL` | Server config; default `openai/gpt-oss-20b` |
| `AI_ENABLED` | Server flag; false until evaluation, privacy and quotas pass |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Server credentials; never NEXT_PUBLIC |
| `RATE_LIMIT_HMAC_SECRET` | Server secret for daily pseudonymous identifiers |
| `ALLOWED_ORIGINS` | Exact deployed origins, no wildcard |
| `AI_DAILY_REQUEST_LIMIT` / `AI_DAILY_TOKEN_LIMIT` | Defaults 20 / 100000; clamp to reviewed provider allowances |
| `CONTENT_VERSION` | Generated build identifier, not manually edited |

No client secret variables. Preview deployments default AI off and noindex; isolated preview secrets only if explicitly configured. Missing AI configuration produces a safe disabled state, never a build-time leak. Pin runtime/package versions and commit the lockfile at implementation; patch versions are not fabricated in this planning document. Use a currently supported Next/Node combination verified at setup.

GitHub flow: private development repository if desired, main branch protection, reviewed pull request, type/lint/content/tests/build checks, secret scanning, Vercel preview, then production from approved main. Repository URL and domain are deferred because neither was supplied. No push or deployment is performed now. Keep secrets out of Git and logs. Roll back application and content/index together to the last verified deployment; a provider kill switch can disable AI independently.

Vercel route handlers remain thin wrappers over framework-independent services. If Hobby is not eligible and the free fallback is chosen, export static Next pages to Cloudflare Pages and map `/api/*` to a same-origin Worker implementing the same contracts; exclude Next route handlers from the static-export build. Pre-generate images and all project routes. This requires a separately tested transport adapter, not an assumption that a Next server runs as a static export. If the Worker free CPU allowance is insufficient, keep AI unavailable and retain all local tools until hosting is deliberately changed.

## 13. Free-tier facts and operational failure plan

Prior official-source snapshot: 30 September 2026. Groq, Upstash, hosting eligibility and every provider allowance below are provisional until reverified during integration. They are not frontend prerequisites or cost guarantees.

| Dependency | Verified published allowance / constraint | Application response |
| --- | --- | --- |
| Vercel Hobby | Personal non-commercial use; 100 GB fast transfer, 1 million function invocations, 4 CPU hours included; excess can pause usage | Static-first; check eligibility; free static-host fallback or later approved paid plan |
| Groq selected model | Listed free limits: 30 RPM, 1,000 RPD, 8,000 TPM, 200,000 TPD; exact organization limits may differ | Stricter application budgets; 429 cooldown; no auto-upgrade |
| Upstash Redis Free | 256 MB, 500K commands/month, 10 GB bandwidth; one free database shown | Quota metadata only; no prompt storage; stop AI if unavailable/exhausted |
| Cloudflare fallback | Static-export hosting path documented; Worker runtime separately quota-limited | Validate adapter and CPU budget before enabling AI; static pages remain core |
| Domain | No domain supplied; custom registration not assumed free | Provider subdomain initially |

At 20 AI requests/day there are at most about 620 accepted requests in a 31-day month. Redis operations per request must be measured; rejected abusive traffic also consumes infrastructure. This arithmetic does not guarantee availability under attack. Apply platform request protections before expensive validation where available; never claim Origin or client IDs prevent abuse.

## 14. Sources and approval boundaries

- [Next Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Vercel Hobby terms and allowances](https://vercel.com/docs/plans/hobby)
- [Groq rate limits](https://console.groq.com/docs/rate-limits) and [supported models](https://console.groq.com/docs/models)
- [Upstash Redis pricing](https://upstash.com/pricing/redis)
- [Cloudflare Next deployment paths](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/) and [Worker pricing](https://developers.cloudflare.com/workers/platform/pricing/)

[DEFERRED] Integration/content facts: actual provider account entitlements, deployment eligibility, credentials/domain/repository, supplied CV contents, future project evidence and asset derivatives. These are explicit integration/content prerequisites, not unanswered architecture choices. The design, data contracts and safety boundaries are decided here. Phase 5 handoff follows; the next execution gate is approval of the complete working frontend before backend/AI implementation.



// run this command to upload pdf --> New-Item -ItemType Directory -Force ".\maheen-ai-portfolio\public\documents" | Out-Null; Copy-Item "$env:USERPROFILE\Downloads\maheen-hamid-resume.pdf" ".\maheen-ai-portfolio\public\documents\maheen-hamid-resume.pdf" -Force