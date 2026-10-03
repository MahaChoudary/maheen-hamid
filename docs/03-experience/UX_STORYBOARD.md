# UX Storyboard

Phase 3 - Experience | Version 1.0 | 2026-09-30
Status: Complete planning specification. Companion: PORTFOLIO_WIREFRAMES.pdf (eight pages, each with desktop and mobile diagrams).

## How to read the wireframes

Wireframes show content order, hierarchy and interaction areas, not final colours, illustrations or pixel-perfect dimensions. Each diagram is a whole-page schematic: its vertical extent represents scrolling, not a promise that all sections fit above the fold. Mobile cards are a simplified stack, not shrunken desktop panels. PDF labels are English to match public site copy; this explanatory note applies to every page.

Eight wireframe pairs correspond exactly to Home, About, Projects, Project case study, Systems Lab, AI Lab, Contact and Privacy. Project titles, metrics and media are represented by descriptive slots rather than invented content. No diagram is a website implementation.

## Global experience

On arrival, the visitor sees usable text and navigation immediately. The avatar image may load progressively without delaying the headline or pushing content out of place. A single Blueprint scene gives identity; the rest of the site prioritizes reading and inspection. Main content comes before optional assistant details in the reading order.

Interactive controls have explicit labels. Every hover cue has a focus/tap equivalent. Text in the avatar illustration is decorative and never the only place a menu, credential or instruction appears. A standard pointer and native scroll remain in use. Navigation is available without completing an animation.

Shared content shell: skip-to-main link, header, page title, main content and footer. The avatar is prominent on Home, smaller on About and the AI Lab introduction, and absent from dense evidence sections unless it adds context. There is no duplicate floating avatar covering content on mobile.

## 1. Home — introduce the engineer, then reveal the system

**Opening view:** name, exact approved headline, concise owner-based story, Sialkot/location, confirmed opportunity preference, large canonical avatar crop and Explore systems. View CV appears when the supplied file is ready. Otherwise offer Contact without a dead CV button. Do not add live product counts or invented achievement badges.

**Beat 1 — identity:** generous quiet space separates readable text from the avatar. Short supporting copy explains connecting AI reasoning, RAG and agents with usable full-stack products. The opening composition must still work as a static image plus text.

**Beat 2 — the blueprint opens:** as the next section enters view, a diagram introduces Interface, API, AI workflow, Data and Evidence. It is clearly labelled “Illustrative system.” Selecting a node highlights one relationship and opens a concise explanation. The layout stays stable; no sprawling map or forced camera journey.

**Beat 3 — choose depth:** a clear link opens Systems Lab. A selected-work section appears only when verified case studies are publishable. If none are ready, omit that section; keep the system example labelled educational rather than evidence of a specific project.

**Beat 4 — next action:** a short personal statement and Contact link offer a natural finish. Footer exposes professional profiles. Do not place a general-purpose explainer input above the role and contact context.

Desktop: editorial composition with avatar and identity; diagram spans a dedicated section. Mobile: headline/actions first, contained avatar crop next, then a vertical diagram summary with tap-to-inspect controls. Motion-free: complete diagram shown immediately.

## 2. About — motivation with clear factual boundaries

Start with the supplied first-person story and a modest avatar crop. Then show BS Computer Science, University of Sialkot, Department of Computer Science; no unprovided education dates. Follow with working principles expressed as intentions: define the problem, connect the system, evaluate the result, explain tradeoffs. Do not turn these principles into fabricated client history.

End with availability and links to CV when ready, Work and Contact. Desktop uses a main narrative with a facts sidebar. Mobile moves facts after the introduction and keeps a straightforward reading order. No invented chronological timeline, testimonials or years-of-experience counter.

## 3. Projects — an honest, expandable evidence index

Opening: page title, one line describing engineering case studies and clear status labels on actual entries. Each published entry shows title, problem, Maheen's reviewed role summary when supplied, selected technology/context tags, a real image if available, and Open case study.

The diagram includes two mutually exclusive editorial states: an empty-state panel and the future populated collection. They must never render as two simultaneous contradictory site states. The empty state has a short message plus Systems Lab and Contact links; no skeletons pretending content is loading indefinitely.

No filters for zero or one case study. When the collection warrants filtering, use visible category buttons and an optional search field with a clear reset and results count. No-results state preserves input and offers reset. Real status is written in words, never communicated by colour alone.

Desktop: rows with concise evidence preview, not a wall of glass cards. Mobile: one entry per row; image is optional and text remains sufficient. Keyboard users reach title links and filters in reading order. New projects can be added without changing navigation.

## 4. Project case study — summary, decisions, evidence

Opening: breadcrumbs, title, problem summary, actual status, Maheen's supplied contribution and available evidence links. A short “At a glance” block answers what it does, for whom and which constraint mattered. No real case is populated during this phase.

The main body has readable sections: Problem and constraints; Contribution and collaboration; Product walkthrough; Architecture and decisions; Verification/outcomes; Limitations and lessons. Metrics require a supplied measurement context. If there are no metrics, explain qualitative outcomes only when supplied; do not invent quantitative proof.

Product view shows the usable experience; Architecture view shows the related component diagram and explanation. These are switchable views of supporting media, not tabs hiding the entire article or its key facts. Evidence references remain reachable as normal links. Any table or diagram has an adjacent text explanation.

Desktop: main article with compact in-page section navigation; architecture can use a two-column diagram/explanation region. Mobile: section navigation collapses into a labelled contents disclosure; diagram becomes vertical steps or an optional zoomable image with a complete text alternative. The main page must not horizontally overflow.

End with verified limitations, back to Work and Contact. Hide missing repository/demo actions. Wukala-GPT gets no academic label, no automatic flagship emphasis and no old repository link.

## 5. Systems Lab — inspect relationships without an AI dependency

Opening: “Explore how the parts connect” plus an explicit explanation that examples are illustrative unless linked to a real source. Choose an area: Linux, Git, Docker, RAG, Agents, or API/System design. The initial state presents a small overview and lets the visitor choose; do not auto-run every demo.

| Area | Visitor action | Visible teaching result | Truth boundary |
| --- | --- | --- | --- |
| Linux | Select an example setup command | Command, purpose and labelled sample output | A simulation, not a remote shell; commands tied to real setup only after review |
| Git | Select a commit/branch in an illustrative sequence | Explain why a change was made and how branches relate | No invented contribution history or real commit IDs |
| Docker | Select API, AI service or data component | Show dependencies, data boundary and role | Generic topology until backed by a specific project |
| RAG | Step through a fixed example question | Query, retrieval, optional reranking, context, answer and evidence | Reranking is a possible stage, not claimed for every project |
| Agents | Select router, specialist or review stage | Show responsibility, inputs, output summary and handoff | No model-private reasoning or unsupported live execution claim |
| API/System design | Switch product and architecture views | Explain request path, auth boundary and failure state | Illustrative unless connected to published evidence |

Desktop: area selector, diagram, selected-node explanation. Mobile: area selector becomes a labelled dropdown or wrapping list; explanation follows the selected item, with next/previous controls for sequences. Keep full text accessible without dragging a diagram. End with an optional link to AI Lab and real case studies when supplied.

## 6. AI Lab — three purposeful tools

Opening: short orientation, small avatar and three clearly labelled modes. Default to Ask about Maheen. The modes are sections/views within this page, not three additional routes. The URL may preserve a mode using a query parameter; exact routing is later implementation work.

### Ask about Maheen

Entry: example questions about skills, background and availability; input, Send and a short data-use notice linked to Privacy. No name/email gate. After submission: honest progress label, answer, source links, and limitations if the approved content cannot answer. Missing project metrics produce “That information is not available in the published portfolio,” not a guess. Keep previous question visible; provide cancel when supported and a deliberate retry after errors. UI never fabricates stage progress.

### Compare a role

Entry: paste job description, Explain comparison action, clear handling notice. Compare only against Maheen's approved CV/profile content; the visitor does not need to upload their own CV. Until Maheen's CV file is ingested, either label the comparison “Published profile only” or disable CV-based comparison with a clear explanation. Do not pretend to have read the CV.

Result: requirements grouped into Supported by evidence, Partial/related evidence, Not evidenced, and Unclear requirement. Each supported item links to its actual source. “Not evidenced” is not “Maheen lacks this skill.” Avoid a hiring verdict or opaque percentage. Submitted job text is untrusted data and cannot override system instructions or authorize disclosure of private content. Detailed provider/security controls belong to Phase 4.

### Workflow trace

Two visibly distinct options: “Illustrative walkthrough” (available without AI) and “This response” (only after a real supported run). Show observable stages, source references, tool status and final output summary. Timing is shown only if actually measured. Do not label synthetic delays as inference, live telemetry or private reasoning. Failed/cancelled stages remain marked truthfully rather than all turning green.

Desktop: input/answer with optional source-and-trace panel. Mobile: input, result, sources and trace in a single stack; expandable source details do not hide the core answer. Keyboard focus is not repeatedly moved while text streams. Loading/result announcements must be concise, not every token. No autoplay speech.

## 7. Contact — one clear invitation

Opening: open to AI Engineer jobs, internships and selected freelance opportunities; remote and international preferred. Relocation is not promised. Primary action: email maheen.hamid30@gmail.com. Include selectable text and a copy action with success feedback; a failed clipboard action leaves text selectable.

Secondary options: LinkedIn, GitHub and public phone +92 331 1432480. Show Sialkot, Pakistan. CV link appears after the file is ready. No contact form is required for this version, so do not create an unneeded submission flow or promise delivery through a backend service. Clicking Email opens the visitor's mail client; it does not send a message automatically.

Desktop: availability statement and contact details in two calm columns. Mobile: availability, email action, details and profiles in a stack. No sticky avatar over links, ambiguous icons or invented response-time guarantee.

## 8. Privacy — explain actual handling before submission

This is a planned disclosure structure, not final legal wording. Cover information entered into AI tools, approved public portfolio sources, external processing providers, retention/deletion, storage on the device, contact-link behaviour and a contact address for questions. Clearly distinguish email-client links from an on-site form.

Phase 4 must decide providers and retention and verify them against the implemented system before publishing this page. Never publish placeholder statements as established privacy facts. AI input surfaces must display the accurate short notice before sending data. Avoid storing job text beyond what is needed; exact mechanism remains Phase 4 work.

Desktop: compact contents list plus readable single article. Mobile: linear headings and optional contents disclosure. This page needs no avatar motion or AI feature.

## Cross-page state and accessibility requirements

- Menu: keyboard open/close, focus containment, Escape, focus return; no hover-only destinations.
- Navigation: new page title and focus target are updated appropriately; back navigation restores sensible context without replaying an intro.
- Errors: explain what failed and one useful next action; never replace all main content with a technical stack trace.
- Media: reserve dimensions; meaningful alternative text; no flashing or autoplay audio.
- Diagrams: text equivalent, named controls, no colour-only status; magnification must not trap scrolling.
- AI: explicit pending/success/empty/error/cancelled states; sources remain links; static portfolio access remains independent.
- Empty project state: an intentional content state, not a loading or error state.

## Decisions and practical implications

| Choice | Reason / tradeoff | Performance | Mobile / accessibility |
| --- | --- | --- | --- |
| One shared Blueprint grammar | Coherence across pages; requires consistent labels | Reuse small assets; no continuous world rendering | Same concepts become labelled lists |
| Contextual avatar, not everywhere | Strong identity without covering evidence | Fewer large images and animation instances | Compact crop; no floating obstruction |
| AI sources beside answers | Makes claims inspectable; adds some interface density | Sources as text links; fetch on demand | Sources stack below result; clear headings |
| Hide unavailable public modules | Avoids false proof; less content initially | No placeholder media overhead | Fewer dead controls |

## TODO

- [x] Storyboard all eight final templates and key empty/error states.
- [x] Provide one desktop/mobile wireframe pair per template.
- [x] Specify evidence, privacy and project deferral boundaries.
- [ ] Phase 4: visual tokens, exact component contracts, provider and privacy decisions.
- [ ] Phase 5: implementation roadmap and final acceptance criteria.

Phase 3 is complete as planning. No website code has been created.
