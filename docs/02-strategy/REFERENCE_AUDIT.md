# Reference Audit

Phase 2 - Strategy | Version 1.0 | Review date: 2026-09-30
Status: Ready for strategy review, with explicit testing limitations below.

## Authority and method

The three files in `docs/01-discovery/` are the approved Phase 1 source of truth. Maheen approved them in the conversation before authorizing this phase. Their original review-status text is historical; they are preserved unchanged. This audit does not reopen discovery or project selection.

Reference: https://ksatriabintangsamudra.com/

Method: direct interaction in the cloud Chrome browser; accessibility trees, rendered screenshots, page navigation, keyboard actions, project filtering, search/terminal/chat entry, one public explainer request, and read-only inspection of the page's rendered CSS and script references. No contact message was sent, no lead form filled, and no external product account entered.

Evidence labels:

- **Observed:** directly rendered, interacted with, or present in inspected page DOM/CSS. CSS declarations are distinguished from executed behaviour.
- **Inference:** a reasoned interpretation of observations, not a verified implementation fact.
- **Unknown:** not established through this audit.
- **Self-reported:** a statement on the reference site, not independently verified.

Coverage is broad across the full home journey and top-level page families, with sampled detail templates. It is not an exhaustive QA pass over every article, project, external app, device, or possible state. Actual mobile rendering could not be exercised: the available browser API exposed no viewport/device emulation control, and a browser-zoom attempt did not change the reported viewport. Mobile findings below are CSS evidence and resulting inferences, not device-test results. Hover evidence combines a pointer-on-card screenshot and inspected hover/focus rules; there was no dedicated pointer-movement API for systematic hover testing.

## 1. Confirmed observations

### Page and journey coverage

The following same-domain routes were opened in the browser. All page descriptions refer to displayed content, not an endorsement of the author's claims.

| Route | Observed purpose and presentation | Inspection depth |
| --- | --- | --- |
| `/` | Large hero; tools/games/ventures playground; notebook; selected projects; personal introduction; current activity; toolkit; travel globe; contact and grouped footer | Full home content inventory; screenshots at hero, playground and contact; anchor and scroll interactions |
| `/projects/` | Searchable project directory with All, AI & Automation, Web, Mobile and Security categories | Directory read and Security filter tested; three security results remained |
| `/projects/vensix/` | Project summary, status, metrics, multi-device screenshots, challenge, approach, results, stack and related projects | Full case-study text and visual inspection; scrolling and back-to-directory navigation |
| `/projects/coaltrack/` | Same case-study family; domain problem, design decisions, limitations, release stage and related work | Content/template inspection |
| `/demos/` | Product demo access instructions, status distinctions, sample-data explanations, tools and links to case studies | Page content read; external apps not exercised |
| `/services/` | Service offers, intended clients, process and contact actions | Content/template inspection |
| `/hire-me/` | Availability, engagement formats, technical areas, proof links and FAQs | Content/template inspection |
| `/resume/` | Professional summary, skills, experience, projects, education and credentials | Content inspection; no verification of career claims |
| `/about/` | Narrative, facts, expertise, selected work, working principles and contact paths | Content/template inspection |
| `/blog/` | Article directory with topics, dates, reading times and summaries | Directory/landmark inspection |
| `/blog/auditing-ai-written-code/` | Article cover, short takeaway block, narrative, technical details and FAQs | Sample article template inspected |
| `/learning-paths/` | Ordered tracks linking articles, glossary entries and projects | Directory/template inspection |
| `/glossary/` | Search field and grouped definitions | Structure inspected; search interaction not tested |
| `/cheatsheets/` | Links to Git, HTTP and Docker references | Directory inspected; detail pages not exercised |
| `/comparisons/` | Technology comparison directory | Directory inspected; detail pages not exercised |
| `/games/` | Browser-game directory | Directory inspected |
| `/games/termle/` | Guess grid, instructions control, on-screen keyboard and status region | Game template inspected; complete game not played |
| `/certifications/` | Credential categories, certificate links and explanatory qualifiers | Content/template inspection; credential issuers not verified |
| `/uses/` | Hardware, software and service inventory | Content/template inspection |
| `/privacy/` | Disclosures for contact, chat, explainer, browser storage and abuse controls | Full displayed disclosure read; backend practices unverified |

The footer also exposes RSS, external profiles and external tool subdomains. These were mapped as exits, not treated as additional portfolio pages to audit exhaustively. Service-detail pages, remaining project/article pages, external applications and certificate files remain unsampled.

### Navigation and information hierarchy

- A desktop header groups Work, Writing, Playground and About, alongside search, a contact CTA, terminal and theme controls. The footer repeats these groups and adds Meta links.
- Work expanded with keyboard Enter and exposed project/demo/services/hiring/resume destinations; Escape collapsed it. A visible cyan focus outline appeared on the focused trigger.
- Search opened an overlay containing a query combobox, result list, close control and keyboard hints. Empty-query results included major pages. Search relevance and a complete keyboard focus cycle were not tested.
- Home anchor actions changed the URL to `#playground` and `#contact` and visibly moved into the corresponding sections. Ordinary scrolling and Page Down were also exercised.
- The header remained available in early scroll views and was absent in some deeper views; a thin progress line appeared at the top. Its complete show/hide thresholds were not measured.
- The displayed home sequence was playground, notebook, selected work, about, toolkit, travel, contact after the hero. Printed section numbers did not follow this visual order. This is an observed hierarchy quirk, not evidence of broken navigation.
- Case studies offered breadcrumbs, an external product action, related cases and a return to the directory. The return link successfully opened the directory.

### Visual identity and typography

- Desktop appearance: near-black hero, dark navy/purple panels, teal/cyan-green accents, white primary type and muted secondary text. Large rounded cards and pill-shaped CTAs recur.
- Hero: large serif headline with an italic accent word, a rotating/typewriter role line with terminal-style prompt, technology explainer input, small proof claims, and a circular portrait with an animated-looking orbital accent.
- Computed styles identified `Fraunces, Georgia, serif` on the hero heading, `Montserrat, sans-serif` on body copy, and a system monospace stack on technical labels. Font-family declarations do not establish which font file rendered on every device.
- A star-like background and a glowing stylized arrow cursor were visible. Across observations the role text and portrait-ring light changed position/state.
- The Vensix case-study hero used a broad blue-to-purple gradient panel; its metrics were a separate horizontal strip, followed by device-framed screenshots and prose sections.

### Interaction and motion

| Interaction | Observed result | What remains unverified |
| --- | --- | --- |
| Work menu | Expanded with Enter; collapsed with Escape; focus outline visible | Complete keyboard traversal and touch behaviour |
| Project category | Security became pressed; results reduced to three matching entries | Every category/search combination and result announcements |
| Playground card | Pointer-on-card view showed cyan outline/glow | Initial activation did not yield a confirmed modal; do not claim preview flow was fully tested |
| Card styling | CSS declares 4px lift and image scale 1.06 for showcase hover/focus; project cards declare 5px lift and image scale 1.05 | Full timing, pointer enter/leave consistency and all cards |
| Global terminal | A terminal-style overlay with input and a help prompt was visually observed; Escape was used to dismiss | Command execution, output correctness, focus containment |
| Assistant | Entry panel requested name plus email/phone before chatting | Answer quality and grounding, because no lead details were submitted |
| Hero explainer | Clicking the site's webhooks topic showed a disabled loading state, then a dialog with explanation, rendered flow diagram and AI-generated disclaimer | Accuracy across other topics, uncached latency, backend reliability |
| Metrics | Vensix values were initially partial/zero and later settled at the displayed final values | Animation library; underlying metric truth |
| Page changes | Internal destinations rendered successfully; some snapshots captured intermediate states | Exact transition choreography, duration and whether every route uses the same transition |

The tools sometimes returned an intermediate UI state before the visual transition settled. Consequently, a single unchanged snapshot is not classified as a broken control. No continuous video was captured; precise frame timing or FPS claims would be unsupported.

### Project presentation and credibility

The directory connects a screenshot, category, concise product explanation, technology tags and an impact/status signal to a case study. Case studies add design reasoning, screenshots at several device sizes and explicit limitations. For example, the Vensix page says commercial sign-ups are not yet open; CoalTrack describes testing-stage distribution and a discarded feature that failed evaluation.

These are useful credibility patterns. Numbers and claims belong to the reference author and were not independently validated. A phone image inside a case study is a screenshot of that product, not evidence that the portfolio itself was tested on a phone.

### Mobile behaviour: confirmed CSS, not executed device results

Read-only CSS inspection found:

- At widths up to 900px / 56.25em, the hero switches to a centred column-reverse layout; the portrait shrinks, and navigation becomes an off-canvas drawer with scrim and hamburger.
- At small breakpoints, playground grids become one column; some cards beyond the first three are hidden and a more-link is styled. The home project grid also has a capped small-screen rule hiding entries beyond the fourth.
- About content collapses from a bento arrangement into a single column; skills stack; the footer becomes two columns.
- Chat and terminal have full-screen small-width rules; playground modals have bottom-sheet styling with safe-area padding.

**Inference:** the author intends mobile to be a shorter, stacked experience rather than a scaled desktop canvas. **Unknown:** actual touch targets, overflow, drawer focus handling, mobile browser chrome, safe-area correctness, performance, and whether hidden entries remain reliably reachable in practice. No claim of mobile QA completion is made.

### Accessibility: observed strengths and concrete concerns

Observed strengths: skip link; named navigation; heading structure; image descriptions; labelled contact fields; button expanded/pressed states; visible keyboard focus; an explainer loading status; an explanation dialog with named close control.

Inspected CSS contains reduced-motion rules for global durations, scroll behaviour, reveal effects, portrait ring, headline entrance, role caret, ticker and several hover effects. This is evidence of accommodation intent, not proof that all JavaScript animation stops. A potential issue worth testing: some focus-visible transforms share hover rules while sampled reduced-motion overrides target hover specifically.

Observed concern: several writing/supporting pages expose nested main landmarks, including the blog template. That can make landmark navigation confusing. Secondary text looked dim in some screenshots; contrast ratios were not measured, so this is a visual risk rather than a confirmed numerical failure. The terminal was visible in a screenshot without corresponding useful contents in the sampled accessibility tree; screen-reader usability needs dedicated testing.

Not completed: screen-reader session, full keyboard-only traversal, focus-trap/return validation, automated accessibility scan, contrast measurement, zoom reflow test, reduced-motion emulation or touch testing. No WCAG conformance claim is made.

### Performance perception

The pages became readable and navigable in this desktop session, and the explainer exposed a visible loading state before an answer. A long home page, numerous screenshot cards, ambient animation, custom cursor and interactive globe introduce potential cost. Those costs were not benchmarked.

Browser-tool wall time is not page load time. No Lighthouse score, Core Web Vitals, transfer size, bundle weight, frame-rate, CPU, throttled-network or low-end-device measurement was obtained. The initial navigation taking longer than subsequent calls does not prove a site-performance defect. No blocking loader was captured; its absence in captured views does not prove one never exists.

## 2. Reasonable inferences

1. **Interactive utility serves as proof.** The early explainer and playground let visitors experience a useful output before reading a career narrative. This likely supports engagement, but no conversion data is available.
2. **Multiple browsing depths are intentional.** Summary cards, case studies, demos, resume and articles serve visitors with different time budgets.
3. **The site is also a content/product hub.** Its writing taxonomy and games are broader than the minimum needed for recruiter decisions; copying that breadth would add unnecessary work to Maheen's scope.
4. **Personal geography is a brand device.** Equator references, star imagery and travel content make the author's site specific to him. Maheen needs her own organising idea, not a replacement globe and location badge.
5. **Status qualifications strengthen trust.** Pre-launch/test-stage wording is more informative than uniformly labelling all work live. This principle transfers without borrowing any claims.
6. **Progressive enhancement appears plausible.** Substantial text exists in the DOM and CSS defines fallbacks, but JavaScript-disabled operation was not tested.

## 3. Technologies: evidence and unknowns

| Item | Evidence class | Safe conclusion |
| --- | --- | --- |
| Astro | Public script URLs include `/_astro/` and `.astro_astro_type_script`; resume also attributes this site to Astro | Strong public signal for Astro-generated output; version and complete build configuration unknown |
| Cloudflare Workers / Workers AI | Resume, Uses and Privacy pages describe their use | Author-reported hosting/inference architecture; deployment and request path not independently verified |
| Cloudflare insights beacon | A script URL from `static.cloudflareinsights.com` is present | Script inclusion confirmed; exact analytics configuration and processing unknown |
| Mermaid | Resume describes diagram sanitisation; explainer produced a rendered flow diagram | Mermaid is author-reported; sanitisation effectiveness not audited |
| CSS responsiveness and motion | Rules read from the live page's accessible stylesheets | Particular declarations confirmed, including reduced-motion and hover rules |
| GSAP, Motion/Framer Motion, Lenis, Three.js, Rive, Live2D | No decisive runtime evidence collected for the portfolio | Unknown; appearance cannot identify the library |
| React / Next.js | Mentioned in showcased products and skill lists | Does not establish that the portfolio uses those frameworks |
| AI model, retrieval, vector database, agent framework | No backend or network validation | Unknown; assistant branding does not establish the model or architecture |
| CDN behaviour, caching, secrets, security, contact delivery | Some practices described by the author | Not verified by visual interaction |

## Inspiration-to-differentiation matrix

| Reference principle | Retain the principle | Maheen's explicit differentiation |
| --- | --- | --- |
| Immediate role recognition | Clear headline and role context | Exact approved headline; geometric sans-serif hierarchy, no borrowed slogan or typewriter job rotation |
| Human identity in hero | Make the owner memorable | Canonical illustrated lab avatar integrated with an engineering diagram; no circular photo or orbital ring |
| Try something useful | Let visitors inspect engineering | A bounded portfolio evidence/workflow experience, not a general-purpose explainer plus games catalogue |
| Several reading depths | Quick summary plus optional technical depth | Product/architecture/evidence viewpoints tied to one visual system; final UX specified later |
| Case-study credibility | Problem, decisions, evidence and limitations | Evidence sourced from Maheen's future work only; no inherited metrics or automatic flagship |
| Technical atmosphere | Precise typography and restrained motion | Navy, cyan/blue, controlled violet; meaningful connectors instead of stars, equator motifs or glowing custom cursor |
| Accessible alternatives | Semantic content and motion fallbacks | Native pointer, no compulsory cinematic sequence, explicit non-animated diagrams and readable text |
| Clear conversion paths | CV, GitHub, contact remain easy to find | Recruiter-first availability and evidence; no mandatory contact-data gate to read portfolio answers |
| Broad information architecture | Logical grouping | Keep only pages that justify their role; do not copy the reference's Work/Writing/Playground mega-menu taxonomy |

## TODO and boundary

- [x] Inspect full homepage content and top-level destination families.
- [x] Inspect two case-study templates, one article and one game template.
- [x] Test core navigation, filter, overlay entry and an explainer outcome.
- [x] Separate visual/DOM observations, CSS evidence, inferences and unknown technologies.
- [x] Define explicit differentiation principles.
- [ ] Unresolved audit coverage: actual mobile/touch, hover-only traversal, reduced-motion execution and measured accessibility/performance.
- [ ] Optional future reference follow-up: unsampled detail pages and external product flows, only if needed for a concrete design question.
- [x] Maheen authorized Phase 3 without a separate Phase 2 approval gate; Concept A is provisionally approved.

The remaining tests are disclosed limits, not facts to invent. They do not prevent presenting creative options. Only this audit and CREATIVE_DIRECTION.md belong to Phase 2. Phase 3 is authorized by the subsequent user instruction and delivered separately. Remaining unverified behaviour stays unknown; no further browsing is required.
