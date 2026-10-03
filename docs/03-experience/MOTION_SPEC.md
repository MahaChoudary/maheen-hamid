# Motion Specification

Phase 3 - Experience | Version 1.0 | 2026-09-30
Status: Planned interaction behaviour; not implemented or performance-tested.

## Purpose

Motion explains what changed, which parts relate, and where the visitor is going. The Living Blueprint gets one memorable reveal; recruiter content is readable immediately. Approved Phase 1 constraints and Phase 2 differentiation remain binding. A static version must communicate the same information.

All durations and budgets below are design targets for later implementation, not measurements or verified device capabilities. The animation library, avatar rigging method and final rendering technology are Phase 4 decisions.

## Motion vocabulary

| Action | Meaning | Planned range | Preferred visual treatment |
| --- | --- | --- | --- |
| Enter | Content becomes available | 180-320 ms | Fade plus at most 12px translation; never wait for stagger to expose essential text |
| Focus/select | Visitor chooses an item | 100-180 ms | Outline/underline and small opacity change; preserve layout |
| Reveal relationship | Show an explanatory connection | 350-650 ms | Short path reveal or selected connection highlight, then stop |
| Change view | Same subject, different depth | 180-260 ms | Crossfade or shallow layer shift; preserve focus and reading order |
| Open/close panel | Display or dismiss optional detail | 160-240 ms | Short opacity/position transition with clear close control |
| Page navigation | Orient to new content | 120-200 ms optional | Simple fade; navigation and content must not depend on it |
| Status update | Reflect actual event | Immediate; 100-160 ms visual settling | Label plus icon; no fictional staged progress |

No bouncing panels, spinning page transitions, jittering text, custom cursor, random particle field, endlessly pulsing status dots or compulsory scroll-driven camera travel. Avoid large animated blur, filter and shadow surfaces. Use normal browser scroll; do not introduce smooth-scroll tooling without a specific validated need.

## Per-page motion map

| Page/element | Trigger and behaviour | Exit/reset | Mobile | Reduced motion |
| --- | --- | --- | --- | --- |
| Home identity | Content renders immediately; optional brief accent reveal after image is ready | Do not replay on every back navigation | Text first; smaller static crop | Immediate fully readable state |
| Home Blueprint | Once the diagram enters view, reveal one meaningful relationship and stop | Replay only on explicit user action; stop offscreen | One connector/step at a time; no pinned viewport | Show complete labelled diagram |
| Home selected node | Click, tap, Enter or Space highlights connection and updates explanation | Another selection replaces it; no accumulating trails | Explanation follows selection | Immediate outline + text update |
| About | Minimal section appearance; facts stay readable | Once per meaningful entry; no repeated scroll flicker | Optional fade only | No entrance animation |
| Projects | Focus/hover emphasizes border; filters update actual result set | Clear/reset restores entries | Tap opens entry; no hover dependency | Instant results, focus and text status retained |
| Case study | Product/Architecture switch crossfades media; article stays present | Remember view within current visit if useful | Replace with vertical view content | Instant media switch |
| Case-study media | Enlarge only on explicit action, if needed | Close/Escape returns focus to trigger | Fit width; accessible optional detail view | Immediate open/close |
| Systems Lab | User steps highlight the active component and edge | Pause, reset and previous/next controls; reset clears selection | Vertical stepper; no drag requirement | Highlight and explanation update instantly |
| AI Lab answer | Pending status reflects request; output appears without typewriter simulation | Cancel stops updates; retry is explicit | Keep input/result position stable | Same text, no decorative loading movement |
| AI Lab trace | Real stage event updates label; illustration mode is explicitly labelled | Failed/cancelled states stay visible | Stacked events | Immediate event updates |
| Contact | Focus/hover on links; Copy changes label to Copied only after success | Short feedback returns to Copy | Full-size tappable rows | Text feedback only |
| Privacy | No page-specific motion | Not applicable | Linear article | Same article |

## Avatar behaviour

Base delivery is the supplied static artwork. Optional rigging is an enhancement, not an assumed prerequisite. Never animate a flattened image's eyes, mouth or arm independently without suitable asset preparation.

| State | Meaning | Recommended response | Fallback |
| --- | --- | --- | --- |
| Rest | Profile/scene ready | Static pose with existing cyan/violet lighting | Same static image |
| Guide | Visitor opens a system explanation | Small environment highlight near the relevant panel; optional slight pose only if an approved rig exists | Selected panel label |
| Assistant active | Visitor opens Ask about Maheen | Avatar thumbnail plus a clear AI assistant label | Thumbnail or text label |
| Request pending | A real request is underway | Pending text; optional subtle local light change | Static image with pending text |
| Result / unavailable | A result or failure arrived | Neutral pose; UI explains the actual state | Text result/error |

Do not imply emotion analysis, a live person watching, or a live system heartbeat. No cursor-following face/eyes by default. Any future idle loop must be subtle, paused offscreen and when the tab is hidden, disabled by reduced motion, and removable without loss of meaning. Prefer no idle loop in the first implementation.

## Blueprint choreography

1. Initial state: diagram labels and explanation are present. The artwork does not cover interactive content.
2. Reveal: one line highlights a relationship between the interface and a supporting service, within 650 ms. This is the single hero-related signature moment.
3. Rest: all labels are readable and no autonomous line motion continues.
4. Inspect: explicit selection highlights a component and shows its role, input/output and evidence if available.
5. Change depth: Product/Architecture uses a short layer/crossfade transition, not a 3D camera flight.
6. Exit: scrolling away stops animation; selecting another page performs ordinary navigation.

The “fold” is a restrained visual transition between diagram layers, not a literal paper simulation. No semantic content exists only during a frame of that transition. On mobile or reduced motion, use immediate layer replacement with a persistent view label.

## Interaction state contracts

### Navigation menu

Closed -> Open -> Closed. Opening focuses a useful control inside; closing via button, Escape or selected destination restores focus appropriately. Background interaction is unavailable while the modal menu is open. Transition completion must not control whether links work. Do not animate a submenu beyond the viewport or lock scrolling after close.

### Educational walkthrough

Ready -> Selected step -> Next/Previous step -> Complete. Optional automatic playback is off by default and, if added later, requires Play, Pause and Reset. Users can read all steps without playback. Diagrams are illustrative unless linked to a verified project or actual run.

### AI request

Idle -> Validating -> Pending -> Success, Insufficient evidence, Error or Cancelled. Invalid/empty input returns a labelled correction without a request. Prevent duplicate sends while pending; retain the user's input. A cancelled or stale response must not replace the result of a newer request. Timeout/error exposes Retry and existing portfolio links. A service outage never blocks About, Work or Contact.

Progress labels reflect observable events. If the backend only exposes pending and complete, show those two states; do not fabricate retrieval, review and synthesis milestones. “This response” trace appears only when event data exists. Simulated workflows are labelled “Illustrative walkthrough” before playback.

### Job comparison

Empty -> Text entered -> Comparing -> Result or Error. Results use explicit categories and source links. Missing evidence is not animated as a failed candidate score. Clear removes the visible job text/result; exact storage deletion semantics must be resolved in Phase 4 before claiming a deletion guarantee.

## Accessibility and input rules

- Native focus outlines or an equally visible replacement remain present during all transitions.
- Respect reduced-motion preference from first render and when it changes. Disable connector travel, parallax, pose loops and spatial transitions; keep content and state labels.
- Any optional ongoing animation needs a visible pause control when relevant; avoid ongoing animation entirely where possible.
- Keyboard, touch and pointer reach the same information. Do not attach exclusive information to hover, motion, drag or audio.
- Status uses text and icon/shape as well as colour. Explain diagrams in plain language.
- Do not announce every streamed token to assistive technology. Announce concise state changes and provide the completed answer in a readable region.
- After route navigation, place focus at a sensible main/title target; back navigation should preserve context where supported. Detail dialogs return focus to their trigger.
- No flashing content or autoplay sound. Voice remains optional and outside the core navigation/reading path.
- The mobile on-screen keyboard must not obscure Send, errors or the result start; its presence should not trigger decorative layout animations.

## Performance and degradation rules

| Risk | Planned control | If the control is insufficient |
| --- | --- | --- |
| Large hero art | Responsive optimized asset, reserved dimensions, readable text independent of decode | Smaller/static image; preserve identity crop |
| Too many animations | At most one major explanatory animation active; pause offscreen/hidden-tab work | Disable decorative motion globally while retaining controls |
| Expensive layout | Prefer transform/opacity and bounded paths; do not animate document geometry continuously | Instant layout change with visible state label |
| Heavy optional rig/3D | Load only when justified and after core content; no requirement for the concept | Static avatar and 2D diagram |
| Many media assets | Load below-fold images on demand; do not preload every case-study screenshot | Show readable summaries first |
| Slow or unavailable AI | Requests only on explicit action; accurate pending/error state; no infinite fake progress | Static public source links and illustrative walkthrough |

Later acceptance targets: stable layout, responsive interaction under normal device conditions, no persistent offscreen animation work, no essential information gated on animation. Specific Core Web Vitals and bundle budgets belong to Phase 5 after architecture decisions; none are reported as achieved now.

## Acceptance scenarios for later implementation

1. Disable motion: all eight page templates remain understandable with every action reachable.
2. Navigate with keyboard: menu, diagram selectors, media switch, AI modes and copy action remain usable; focus never disappears.
3. Use narrow/touch layout: no hover requirement, main horizontal overflow or sticky overlay covering controls.
4. Leave an animated section: motion stops; returning does not replay an unavoidable intro.
5. Simulate AI failure: error is clear, text is retained, retry is deliberate and normal portfolio links still work.
6. Cancel then submit a different question: the old response cannot overwrite the new result.
7. Start with no published projects or CV asset: no broken download, fake case card, invented metric or empty public detail route appears.
8. Open a real trace without stage telemetry: UI does not invent intermediate events.

These are planning checks to implement later, not tests already executed.

## TODO

- [x] Define purposeful motion, durations, triggers, exit/reset behaviour and fallback states.
- [x] Cover all final pages, avatar states and AI interaction states.
- [x] Document keyboard, touch, reduced-motion and performance requirements.
- [ ] Phase 4: select actual motion/rigging technology and provider interfaces.
- [ ] Phase 5: translate these scenarios into release acceptance criteria.

No implementation code or animation assets are generated in this phase.
