# Acceptance Checklist

Phase 5 · 30 September 2026 · Unchecked items require implementation evidence.

## Complete frontend and approval gate

- [ ] All handoff routes/templates and 404 work; navigation is Home | About | Projects | Lab | Let’s Talk. Public brand is MAHEEN HAMID.
- [ ] Desktop/mobile layouts work at 320, 390, 768 and 1280 px; no page overflow, clipped controls or keyboard-obscured forms.
- [ ] Avatar, colour tokens, typography, spacing, cards and transitions are visually consistent; Default/High contrast both work.
- [ ] Keyboard, visible focus, dialog focus return, labels, contrast and zoom work; reduced motion preserves the complete static experience. Loops pause offscreen/hidden-tab and manually.
- [ ] Local search finds published body text/aliases, opens correct links, supports keyboard/shortcut and handles empty/no-result/index-error states; excludes mocks/drafts.
- [ ] CLI implements help, about, whoami, skills, projects, lab, experience, education, contact, resume, cv, clear, theme, open, search and ask; aliases and argument limits work.
- [ ] CLI cannot execute shell/code or open arbitrary destinations; input is escaped. Theme has only two approved variants; disabled ask shows unavailable plus Assistant link.
- [ ] Systems interactions work; mocked Assistant, Matcher and workflow interfaces expose all states and are clearly labelled. No mock event claims real AI execution; no external text submission occurs.
- [ ] Confirmed facts remain accurate; missing content is `[DEFERRED]`. No fabricated projects/experience/metrics/credentials, broken CV download, Wukala academic label or old repository link.
- [ ] Production frontend build passes; image/font/JS budgets are checked against Phase 4. Core content is immediately usable; effects do not obstruct scrolling or input.
- [ ] Complete frontend is reviewed in the browser, refinements are applied, and explicit frontend approval is recorded **before backend/AI implementation**.

## After frontend approval

- [ ] API contracts, validation, secret isolation, origin handling, atomic quota races, timeout/cancel and provider/Redis failures pass verification.
- [ ] Groq/model, Upstash, hosting eligibility and limits are reverified; privacy disclosures match actual settings and submitted-text handling. No unauthorized paid services.
- [ ] Live Assistant and CLI ask share grounding, disclosure and quotas; citations resolve to approved sources; injection, unknowns and unsupported-claim evaluations pass.
- [ ] Matcher distinguishes evidence from missing information; real traces show actual events only. Mock fixtures remain excluded from public evidence and live results.
- [ ] Final build, metadata/sitemap, links, mobile/accessibility, deployment configuration and rollback are checked; deployed smoke tests pass and AI failure leaves local tools usable.
