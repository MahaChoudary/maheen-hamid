# Design System

Phase 4 · Version 1.1 · 30 September 2026 · Owner-requested corrections applied; Phase 5 handoff follows

This is a design specification, not implemented UI. Phase 1 remains the content source of truth. Phase 3 is approved; the owner's latest brand, navigation, Lab, search and terminal requirements override older navigation and terminal exclusions in the Phase 3 documents and wireframes. No earlier files are changed.

## 1. Fixed identity and interface direction

- Public wordmark: **MAHEEN HAMID**. Accessible name: “Maheen Hamid — Home.”
- Headline: **AI Engineer | Full-Stack AI Systems**.
- Navigation, in order: **Home | About | Projects | Lab | Let’s Talk**.
- “The Living Blueprint” is an internal creative concept only. Do not put it in the wordmark, document title, metadata, loading screen or assistant identity.
- All public copy is English. Lab contains Systems, Ask about Maheen, Resume–Job Matcher, How My AI Thinks, and Portfolio Terminal.
- Visual direction: dark architectural surfaces, clear geometric typography, cyan selection, restrained violet depth and the supplied avatar. Native scrolling and pointer; no starfield, orbital portrait, borrowed serif composition or imitation of the reference's search/terminal chrome.

## 2. Colour tokens

The supplied avatar was inspected: midnight surroundings, graphite clothing, cyan monitor edges and violet/magenta lighting. The six core hues below translate that artwork and the brief into UI roles; they are designed tokens, not claims of pixel-perfect colour extraction. Warm skin tones remain in the artwork rather than becoming interface accents.

| Token | HEX | Exact role |
| --- | --- | --- |
| canvas | `#050817` | Page background; dark text on bright action fills |
| surface | `#0C1328` | Cards, navigation, terminal and dialogs |
| surface-raised | `#141F38` | Selected rows, nested panels, hover surfaces |
| border-subtle | `#2B3953` | Decorative separators only; never the sole control boundary |
| border-control | `#71839F` | Input/control boundary and neutral diagram connector |
| text-primary | `#F4F7FB` | Body, headings and button labels on dark surfaces |
| text-secondary | `#B6C3D4` | Supporting copy, placeholders and inactive navigation |
| accent-cyan | `#20D7FF` | Primary action fill, focus, active node and links |
| accent-blue | `#2788FF` | Secondary data connection and contextual information |
| accent-violet | `#8B38FF` | Decorative avatar edge and depth accent; not normal text |
| accent-magenta | `#D040FF` | Sparse decorative intersection; never error or availability |
| text-violet | `#C8B5FF` | Optional Lab category label on dark surfaces |
| success | `#57D9B0` | Completed operation with check icon and text |
| warning | `#FFCE73` | Quota or incomplete evidence with label |
| error | `#FF8E9C` | Validation/request failure with icon and recovery text |

Use flat surfaces behind all reading. Cyan is the main interaction accent; violet/magenta must not compete with the primary CTA. Gradients are confined to decorative artwork framing: cyan → blue → violet; no gradient text or gradient form fields. Dialog scrim: canvas at 80% opacity, with a fully opaque surface beneath text. Essential states must remain legible without the scrim or glow.

### Approved high-contrast variant

`theme` toggles only **Default** and **High contrast**, across the whole interface. High contrast overrides: canvas `#000000`, surface `#050817`, surface-raised `#0C1328`, text-primary `#FFFFFF`, text-secondary `#F4F7FB`, border-subtle and border-control `#B6C3D4`. Other accent/status tokens stay unchanged; meaningful edges are 2 px. Remove decorative gradients/glows behind controls; violet remains decorative. Keep visible labels and focus rings. The preference is memory-only for the current visit; expose an equivalent labelled appearance control outside the CLI. Forced-colours mode uses system colours. No additional themes.

### Contrast contract

Calculated from the WCAG relative-luminance formula for the specified solid colours, rounded to two decimals. These are token checks, not an audit of a built site.

| Foreground / background | Ratio | Permitted use |
| --- | --- | --- |
| text-primary / canvas | 18.55:1 | All text |
| text-secondary / surface-raised | 9.16:1 | Small supporting copy and placeholders |
| accent-cyan / surface-raised | 9.53:1 | Links, focus and diagram selections |
| canvas / accent-cyan | 11.60:1 | Primary button text |
| accent-blue / surface-raised | 4.72:1 | Normal text permitted; cyan remains preferred for links |
| accent-violet / surface-raised | 3.20:1 | Decoration; no normal-size violet text |
| text-violet / surface-raised | 8.97:1 | Lab labels |
| border-control / surface-raised | 4.25:1 | Control edges and meaningful connectors |
| success / surface-raised | 9.32:1 | Status text |
| warning / surface-raised | 11.17:1 | Status text |
| error / surface-raised | 7.48:1 | Status text |

All normal text must reach 4.5:1, large text 3:1, and essential component boundaries/focus indicators 3:1 against adjacent colours. Do not apply parent opacity to active controls or supporting copy. Disabled controls retain readable labels; distinguish them with an unavailable label and interaction state, not opacity alone. Text-primary on cyan is prohibited; use canvas.

## 3. Typography

**Recommendation:** Space Grotesk 500/600 for headings and wordmark; Inter 400/500/600 for body and UI; JetBrains Mono 400/500 for terminal, code and short technical labels. Self-host Latin WOFF2 subsets through Next font handling; no runtime font CDN calls. Cap total compressed font transfer at 160 KB. System sans and monospace are the immediate fallback; remove the mono webfont first if over budget.

Reason: geometric headings support the avatar's engineering setting while long text remains familiar. Tradeoff: three families add weight. Fallback: Inter for both headings and body, system monospace. Avoid the reference's editorial serif hierarchy.

| Role | Mobile size / line height | Desktop size / line height | Weight |
| --- | --- | --- | --- |
| Wordmark | 16 / 22 px | 18 / 24 px | 600; tracking 0.06em |
| Hero H1 | 36 / 42 px | 64 / 70 px | 600; tracking -0.025em |
| Page H1 | 32 / 39 px | 48 / 56 px | 600 |
| H2 | 28 / 35 px | 36 / 44 px | 600 |
| H3 | 22 / 29 px | 24 / 32 px | 500 |
| Body | 16 / 26 px | 18 / 29 px | 400 |
| UI / buttons | 16 / 24 px | 16 / 24 px | 500 |
| Supporting label | 14 / 21 px | 14 / 21 px | 400/500 |
| Terminal / code | 14 / 22 px | 14 / 22 px | 400 |

Fluidly interpolate between endpoints; never scale text down to fit. Body measure: 65ch maximum. H1 measure: 16–20ch; do not force awkward line breaks on mobile. Heading levels follow document structure. All-caps limited to wordmark and short labels, never paragraphs.

## 4. Space, layout and responsive rules

Spacing scale: **4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px**. Default card padding 24 px desktop / 16 px mobile; related fields 16 px; section gap 96 px desktop / 64 px mobile. Control radius 8 px; cards 12 px; dialogs 16 px. Pills only for compact status badges. Standard border 1 px; selection/focus 2 px. No large ambient shadows; elevated overlay may use canvas shadow at 45% opacity, 0/16/48 px.

| Range | Layout and behaviour |
| --- | --- |
| Base: 320–479 px | Single column, 16 px gutters, stacked actions; full-height search/terminal sheet |
| sm: 480–767 px | Single column, 24 px gutters; optional two action buttons when both fit |
| md: 768–1023 px | Two content columns only when useful; 32 px gutters; mobile menu retained |
| lg: 1024–1279 px | Full navigation; 12-column grid with 24 px gaps; split hero |
| xl: 1280 px and above | Content max width 1200 px, centered; hero copy/art roughly 5/7 columns |

Desktop header height 80 px; mobile 64 px. Header remains sticky with an opaque background. Anchor offsets include header plus 16 px. At high zoom, use the narrow layout automatically. No page-level horizontal scroll at 320 CSS px; diagrams become vertical labelled steps. Code blocks alone may horizontally scroll with an accessible label. Respect safe-area insets and the on-screen keyboard; overlays use dynamic viewport height and internal scrolling.

## 5. Components and states

### Navigation and Let’s Talk

Desktop header: wordmark, five approved navigation destinations, labelled Search button, labelled Terminal button. Let’s Talk is the nav's primary cyan-filled link to `/contact`; do not duplicate a second contact CTA alongside it. Home and the wordmark both legitimately link home. Current page uses underline plus `aria-current`; all Lab subpages highlight Lab.

Below 1024 px: wordmark, Search icon button with accessible name, Menu button. Menu contains the five destinations and an explicit “Open portfolio terminal” action. Full wordmark may wrap into two words on two lines at very narrow widths; do not truncate the public name. Let’s Talk remains prominent within the menu. Opening a modal menu traps focus and makes background inert; close/Escape returns focus to its opener. Successful route navigation focuses the destination main heading.

### Buttons and links

Minimum interactive target 44 × 44 px; main buttons 48 px high with 20 px horizontal padding. Primary: cyan fill and canvas label. Hover: keep the same accessible colours and add a 2 px canvas inset edge; pressed: same colours, 1 px downward transform. Secondary: surface, primary text and border-control edge; hover surface-raised. Text links are cyan with underline in prose. Icon-only controls require names and tooltips available on keyboard focus as well as hover.

Focus: 2 px cyan outline, 3 px offset. Cyan-filled controls use an inner canvas separation and an outer cyan ring against the surrounding dark surface. Do not clip rings inside overflow containers. Loading: retain label width, show “Working…” and disable repeat submission; never remove the accessible name. Destructive/clear actions use plain labelled secondary controls, not a primary error-coloured CTA.

### Cards

Project card: category, title, concise approved summary, evidence availability and a real link. No fabricated metrics or placeholder publication dates. One clear linked title; do not nest buttons inside an all-card link. Hover/focus changes border-subtle to cyan with no tilt. Lab cards add a text badge: **Interactive explanation**, **AI-powered** (live integration only), **Demo — static data** (mock AI interfaces), or **Portfolio terminal**. These describe actual behaviour, not claimed project experience. Draft project records never become public skeleton cards. Skeletons appear only during real loading and stop when loading stops.

### Global search

Original UI: a compact **“Find in Maheen’s portfolio”** panel with a left-aligned search field and simple result rows. No copied command palette branding, source-site icon arrangement or terminal visual merger. Search and terminal are separate tools.

Desktop dialog width max 720 px, maximum height 80dvh; mobile sheet fills usable screen. Open via header or Cmd/Ctrl+K; visible controls remain sufficient. Field label is persistent. Search queries only published portfolio content and page destinations. No model request or third-party search service.

| State | Visible treatment and interaction |
| --- | --- |
| Closed | Search button; shortcut hint on desktop |
| Empty | Five primary page shortcuts and an explanation of scope |
| Loading index | “Loading portfolio search…”; close remains available |
| Querying | Keep previous results briefly; never simulate AI typing |
| Results | Title, page type, matched excerpt; selected row has cyan edge and surface-raised fill |
| No results | “No matching portfolio content.” Offer clear query and page links |
| Index failed/offline | “Search index unavailable.” Show static page directory and Retry |

Combobox/listbox keyboard pattern: arrows change active result; Enter follows it; Escape closes; Tab reaches other controls. Announce result count politely after update. Highlight terms with bold/underline, not colour alone. Results open normal internal links and preserve browser history. Query is not saved to URL, storage or analytics.

### Portfolio terminal

Title: **Portfolio terminal**. Helper: **“Predefined portfolio commands; ask uses the assistant only when enabled.”** Prompt label: `maheen >`; no fake root hostname, connection log or boot sequence. Desktop panel max 800 px wide; mobile full-height sheet; also available at `/lab/terminal`. Use surface background, primary output, cyan commands and labelled error messages. No blinking cursor animation; the native input caret suffices.

| State | Treatment |
| --- | --- |
| Ready | `help` suggestion plus clickable command chips |
| Editing | Labelled input, completion suggestions, remaining limit near limit |
| Completed | Immediate result and real navigation links; newest output announced once |
| Unknown/invalid | “Command not available. Type help.” Include valid syntax when applicable |
| No content | Explain missing CV asset/published projects without a fake result |
| Navigation offered | Show destination link; visitor activates it deliberately |
| Cleared | Remove transcript and volatile history; “Terminal cleared” status |
| Theme changed | Announce Default or High contrast; preserve focus |
| Ask pending / result | Shared Assistant pending, cancel, evidence and error states; first-use disclosure before a live submission |
| Ask unavailable | “AI assistant is currently unavailable.” Link to `/lab/assistant`; no fabricated reply |

Output wraps, with its own bounded scroll area. Do not auto-scroll if the visitor is reading older output; offer “Latest output.” History and completion are keyboard conveniences, not requirements. Clipboard operations show success only after completion and fall back to selectable text. Complete allowlist: `help`, `about`, `whoami`, `skills`, `projects`, `lab`, `experience`, `education`, `contact`, `resume`, `cv`, `clear`, `theme`, `open [destination]`, `search [query]`, `ask [question]`. `resume` and `cv` are aliases; unavailable content is labelled `[DEFERRED]`. Precise command grammar and safety rules are defined in TECH_ARCHITECTURE.md.

## 6. Lab language and avatar

Lab uses the same page shell, typography and surfaces as the portfolio. Diagrams use rectangular 8 px-radius nodes, 2 px meaningful connectors and short input/output labels. Cyan identifies selection; blue connections; violet labels identify AI-related concepts without implying active inference. Every diagram has an adjacent plain-language description. Use a linear ordered list on narrow screens.

Real AI runs show an **Actual request** badge and only measured execution events. Educational diagrams show **Illustrative walkthrough** before interaction. No green “live” lamp on static examples. “How My AI Thinks” gets subtitle **“Observable workflow, not private model reasoning.”**

Avatar: supplied raster is the base artwork. Home uses a rectangular 4:5 visual frame; About can use a face/upper-body crop. Preserve face and natural proportions. The raster includes decorative menu text; crop the left edge so it cannot be mistaken for the site's actual navigation. Do not recreate those embedded labels as active links or place interactive content on top of them. Mobile image follows headline/actions and is at most 360 px tall. Text stays outside the art. Use descriptive alt text once (“Illustrated portrait of Maheen Hamid in an AI workspace”); repeated thumbnails beside her name are decorative with empty alt.

No cutout, eye/mouth rig or layered source exists yet. Do not warp the flattened face, synthesize speaking states or assume a transparent background. The initial frontend keeps the raster intact while its frame may use subtle depth and cursor-responsive lighting. On fine pointers only, cap frame tilt at 2 degrees and depth translation at 4 px; reset on pointer exit and never move facial features independently. Touch/keyboard receive the same information with static lighting. Properly prepared and approved layered assets may later animate clothing/environment layers subtly; face warping and fake speaking remain prohibited. Layered assets and final optimized derivatives: [DEFERRED].

## 7. Exact motion tokens

| Token | Duration | Treatment |
| --- | --- | --- |
| feedback | 120 ms | Border/colour feedback |
| select | 160 ms | Selected-state transition |
| panel | 200 ms | Dialog opacity, at most 8 px travel |
| view | 220 ms | Lab view crossfade |
| enter | 240 ms | Optional opacity + at most 12 px; essential copy already visible |
| relationship | 500 ms | One connector reveal, then rest |
| route | 180 ms | Premium opacity/shallow transition; native navigation remains immediate |
| ambient | 8,000 ms per cycle | At most one low-amplitude environmental loop in the visible section; pause offscreen/hidden-tab |
| frame-response | 160 ms | Fine-pointer lighting/depth response within the bounds above |

Default easing: cubic-bezier(0.2, 0, 0, 1); exit easing: cubic-bezier(0.4, 0, 1, 1). Preserve a memorable high-end experience through native-scroll section reveals, controlled background lighting, animated system/data-flow sequences and premium page/Lab transitions. Data-flow playback is user-triggered, bounded to one sequence, and has Pause/Reset; its events are labelled illustrative unless they reflect real execution. Small ambient loops need a visible Pause motion control, stop offscreen and when the tab is hidden, and never resemble a live-service status. One major explanatory sequence at a time; avoid competing ambient movement during it. No scroll hijacking, excessive motion, flashing, fake speaking or token-by-token typewriter effect. Real status text updates immediately. These corrections supersede narrower motion prohibitions in the earlier Phase 3 motion file.

Reduced motion: disable ambient loops, cursor-responsive lighting, depth, spatial/page transitions, connector travel and entrance effects; instantly expose final state and the complete static experience. Focus, status text, selected edges and full content remain. Honour OS preference on initial render and preference changes. No autoplay audio or flashing content.

## 8. Final decision register

| Recommendation | Reason | Tradeoff | Fallback |
| --- | --- | --- | --- |
| Default dark plus high-contrast variant | Fits avatar while supporting stronger contrast | Two token sets to verify | System forced colours; no extra themes |
| Cyan primary, violet decorative | Clear action hierarchy grounded in artwork | Less neon variety | Flat monochrome borders with labels |
| Separate search and terminal | Clear mental models and keyboard behaviour | Two utilities | Static directory and ordinary page links |
| Intact avatar with responsive frame depth/light | Memorable presentation using the supplied asset honestly | Pointer effect is decorative; layered character motion awaits assets | Complete static frame/image/name |
| Flat 2D Lab diagrams | Readable systems explanation with low overhead | Less spectacle | Ordered text steps |

## 9. Approval and deferred inputs

Apply these corrections during frontend-first implementation: complete responsive pages, storytelling, motion, search, CLI and all mocked Lab states; review the working frontend in the browser before backend/AI integration. Provider setup must not block that milestone. [DEFERRED]: supplied CV file, future project evidence, final image derivatives, and rendered-device accessibility/performance verification after implementation. Public contacts, location, headline, CV existence and opportunity preferences are confirmed. Phase 5 handoff is delivered separately; no website code is included.
