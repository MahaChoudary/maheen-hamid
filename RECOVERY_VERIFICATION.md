# Final incremental portfolio upgrade

3 October 2026. Continued the existing completed `maheen-ai-portfolio` source, after inspecting the saved archives and current file differences. No new application or template was substituted. The original PDF, avatar, documented Wukala-GPT project, search, terminal, AI settings/consent and original planning files remain. The requested notes collection and unused development preview fixture were removed.

## Completed behavior

- Mira uses retrieval for portfolio facts, and conversational generation for greetings, thanks, social follow-ups and general technical questions. Personal credentials remain bounded by reviewed evidence. Sources/Why-this-answer/provider/debug panels stay removed.
- Signed anonymous sessions have independent rolling windows: Mira 30, Explainer 10, Matcher 10 per ten minutes. Leases are also independent by feature. Broad IP guards and deployment cost ceilings remain. Loopback development budgets are effectively unrestricted; production-budget verification can be enabled locally.
- The Explainer accepts useful bounded text even if optional educational fields or Mermaid are missing. Unsafe/malformed diagrams are repaired or rebuilt from the explanation steps; runtime Mermaid syntax gets its own fallback. Quoted labels such as “Click handler” remain valid; active Mermaid commands remain blocked.
- Groq defaults to documented GPT-OSS 20B, with GPT-OSS 120B as the bounded same-provider fallback for a rejected model. Unsupported strict format can retry JSON mode with the explicit schema. These retries concern rejected configuration requests, not network/429/5xx generation retries. The actual selected model is returned in server result metadata.
- AI generation/parse/validation failures carry proper HTTP error statuses for both JSON and NDJSON clients. No keyword-only comparison or fake-success result is supplied.
- Matcher provides Role Snapshot, Strong Matches, Partial Matches, Gaps, Best Evidence and Improve Before Applying. Literal job requirements and exact approved evidence are checked; professional duration and protected-trait assessments are not inferred. Stop, retry and reset retain clean states.
- Uses presents eight purpose-based engineering groups, including the requested AI, product, database, infrastructure, cloud, editor, coding-assistant and monitoring tools. Status labels and filters are gone; the page makes no proficiency rating.
- Exactly six researched articles replace the old collection. Each has a distinct optimized raster cover, primary references, technical visual, Read Article action, tags/time, article hero and related articles. Notes links/data and the unused static explainer catalogue are removed from runtime source/search.
- Hire Me prominently uses the uploaded professional photo, with improved recruiter flow and evidence/role/CTA sections.
- Home adds a cinematic entrance, terminal sequence, layered gated ambient paths, restrained portrait parallax, a product-building story and article cards. Shared cards, buttons, dropdowns and generated results have consistent motion. The curtain reveals the full viewport; theme changes use View Transitions with a CSS fallback. Pause Motion/reduced motion and accessible static content remain.
- Footer contains: All rights reserved. Made with ❤️ by Maheen Hamid.

## Verification evidence

| Check | Result |
| --- | --- |
| TypeScript | Passed, zero errors. |
| ESLint | Passed, zero errors/warnings. |
| Unit/security/AI contracts | 144 tests across six files passed, including actual Redis Lua and separate budgets. |
| Production build | Passed; 33 generated pages, six article slugs and three AI routes. |
| AI browser | Passed through actual Next APIs/UI plus actual Redis and an explicitly synthetic upstream. |
| Independent HTTP limits | One signed session accepted Mira 30, Explainer 10 and Matcher 10 independently, then each returned 429 with Retry-After. |
| Chat | Greetings/social/technical/mixed/grounded follow-ups, unknown employers, stop, retry and clean failure behavior passed. |
| Arbitrary explanations | API gateways, Kubernetes discovery, transaction isolation, WebSocket backpressure and OAuth PKCE passed the browser/API chain. |
| Matcher | Three different JDs passed actual UI/API generation/validation contracts and result groups. |
| HTTP failures | Upstream failure, provider quota, invalid JSON, empty response, deadline, quota outage and missing key produced real errors. |
| Production browser | All six articles and main routes passed both themes and responsive widths 320/390/768/1280; keyboard/dropdowns/search/CLI/offline states checked. |
| Accessibility/runtime | Axe journeys passed. Contrast during the initial page fade was corrected by retaining full-strength content behind the curtain. |
| Motion | Actual client navigation curtain, theme switch, CSS fallback, pause/resume, reduced motion and OS theme changes checked. |
| Resume | Original PDF rendering/download/mobile/no-JS and entry points checked. |

The original resume SHA-256 is `6d2adef4794ad8ff3e09b8200d642280d53816bb8905b9884804e7bf2e2fd6e9`. The original avatar and PDF are byte-identical to the previous delivered archive. Artwork provenance is recorded in `ARTWORK_PROVENANCE.json`.

## Live-provider boundary

No genuine Groq or hosted Upstash credentials were supplied. `npm run test:provider` therefore reported NOT RUN; the successful synthetic contract suite is not a claim of real Groq inference quality, account permissions, hosted connectivity or privacy settings. The live smoke runner now checks the authenticated active-model list, casual/grounded Mira, four explanation topics and two JDs when configured. Groq production-model and structured-output documentation were checked on 3 October 2026. No deployment was requested.

The ZIP contains the complete source, lockfile, tests, assets and documentation. It excludes actual secrets, dependency directories, build caches, machine-specific test infrastructure and test screenshots. Run `npm ci` then `npm run dev` with Node.js 24. See README and `.env.example` for server-only AI configuration.
