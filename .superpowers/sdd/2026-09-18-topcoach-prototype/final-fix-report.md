# TopCoach LoL Final Fix Report

**Date:** 2026-09-18

**Baseline:** `65a30ae26bc94419d0e143d2bd1bf3750f859fbf` (`feat: complete navigable TopCoach prototype`)

## Status

All disclosed Critical, Important, Minor, and deferred test-hardening items were implemented in one fix wave. No browser automation dependency was added, and all ten match rows were preserved.

## Corrections

### Supported aggregates

- Changed average KDA from `4.2` to `4.4`, using the required arithmetic mean of each match's `(kills + assists) / deaths`, rounded to one decimal.
- Retained mean farm at `7.4 CS/min` and changed its population coefficient of variation to `8.0%`.
- Changed the farm priority evidence to `7.4 CS/min; CV 8.0%` and its reference to `CV ≤ 6%`.
- Updated dashboard and report expectations to use the supported KDA and farm evidence.
- Added independent test calculations for average KDA, mean CS/min, and population CV directly from `demoMatches`.

### Visual guide contract

- Expanded `visualTokens` to the exact ten approved entries, names, HEX values, and usages.
- Renamed the gold token example from “Progreso” to “Acento.”
- Added a distinct `process` tone to `StatusBadge`, using `--color-action`, while neutral continues to use `--color-muted`.
- Added the reusable `EmptyState` primitive and reused it in both history and the guide.
- Added a live `Tabs` example that uses the existing click and keyboard-capable component.
- Preserved the existing guide headings and examples, labeled field, metrics, panels, `style-guide capture-frame` classes, 16:9 sentence, print rules, and responsive rules.

### Focus contrast

- Changed the primary clipped-button inset focus indicator to `--color-void`.
- Kept the secondary clipped-button inset focus indicator high contrast with `--color-action`.
- Left link buttons on the global outer `:focus-visible` outline.
- Added stylesheet regression assertions for all three cases.

### Zero evidence bars

- Removed the artificial `Math.max(8, ...)` minimum.
- Zero early deaths now renders with inline `height: 0%`.
- Added `evidence-bar--zero`, which shows a dashed baseline without positive fill.
- Preserved the visible evidence text and accessible label.

### Test hardening

- Added focused login behavior coverage for both required fields and the `#/dashboard` destination.
- Added focused recovery behavior coverage for the required email and the `#/login` destination.
- Changed route assertions to exact level-1 heading queries.
- Preserved the primary click-journey test.
- Hardened the visual-guide test for all ten tokens, required headings, capture sentence and classes, distinct neutral/process examples, live tabs, and the empty-state example.

## TDD Evidence

### RED

Command:

```text
npm test -- src/data/demo.test.ts src/pages/DashboardPage.test.tsx src/pages/ProgressFlow.test.tsx src/components/ui.test.tsx src/pages/EvaluationFlow.test.tsx src/pages/PublicFlow.test.tsx src/App.test.tsx
```

Initial result:

```text
Test Files  6 failed | 1 passed (7)
Tests       7 failed | 44 passed (51)
```

Expected regression failures included:

- Aggregate test received `4.2` instead of derived `4.4`.
- Dashboard could not find `4.4`.
- Guide could not find the missing “Superficie elevada” token and later required examples.
- Primary and secondary focus selectors were not independently defined.
- The zero-value evidence bar had `height: 8%` instead of `0%`.

The exact landing-heading hardening initially assumed a space that is not present in the current computed accessible name across the nested styled span. The test was corrected to assert the exact existing level-1 name rather than changing unrelated landing behavior.

### GREEN

The first implementation run left one test-only ambiguity because “Texto secundario” is intentionally both a token name and usage. Narrowing the usage query to its `<small>` element resolved it without a production change.

Final focused command:

```text
npm test -- src/data/demo.test.ts src/pages/DashboardPage.test.tsx src/pages/ProgressFlow.test.tsx src/components/ui.test.tsx src/pages/EvaluationFlow.test.tsx src/pages/PublicFlow.test.tsx src/App.test.tsx
```

Final focused result:

```text
Test Files  7 passed (7)
Tests       51 passed (51)
```

## Full Verification

Full suite command:

```text
npm test
```

Result:

```text
Test Files  8 passed (8)
Tests       54 passed (54)
```

Production build command:

```text
npm run build
```

Result:

```text
tsc -b && vite build
30 modules transformed
dist/index.html                  0.49 kB | gzip 0.30 kB
dist/assets/index-D-6TIdmG.css 21.09 kB | gzip 4.66 kB
dist/assets/index-QrMXDfmL.js 226.83 kB | gzip 69.12 kB
built in 328ms
```

`git diff --check` also completed with no output.

## Files Changed

| File | Change |
| --- | --- |
| `frontend/src/App.test.tsx` | Exact level-1 route heading assertions |
| `frontend/src/components/ui.tsx` | `process` status tone and reusable `EmptyState` |
| `frontend/src/components/ui.test.tsx` | Primary, secondary, and link focus CSS regression assertions |
| `frontend/src/data/demo.ts` | Supported aggregates, farm evidence, and ten approved visual tokens |
| `frontend/src/data/demo.test.ts` | Independent KDA, CS mean, and population CV derivation |
| `frontend/src/pages/DashboardPage.test.tsx` | Correct KDA expectation |
| `frontend/src/pages/EvaluationFlow.test.tsx` | Zero-bar and report aggregate assertions |
| `frontend/src/pages/HistoryPage.tsx` | Reuse of `EmptyState` |
| `frontend/src/pages/ProgressFlow.test.tsx` | Complete visual-guide contract coverage |
| `frontend/src/pages/PublicFlow.test.tsx` | Login and recovery behavior coverage |
| `frontend/src/pages/ReportPage.tsx` | True zero-height evidence bars and zero marker class |
| `frontend/src/pages/StyleGuidePage.tsx` | Complete palette and live status, tabs, and empty-state examples |
| `frontend/src/styles.css` | Focus contrast, process tone, zero baseline, and reusable empty-state styles |
| `.superpowers/sdd/2026-09-18-topcoach-prototype/final-fix-report.md` | This report |

## Self-Review

- Confirmed all ten original match records remain unchanged.
- Confirmed no stale `4.2`, `variación 18%`, `Variación ≤ 12%`, “Progreso” accent label, or `Math.max(8, ...)` remains under `frontend/src`.
- Confirmed the aggregate test derives values independently rather than repeating the corrected constants.
- Confirmed all ten palette entries exactly match the approved design specification.
- Confirmed neutral and process statuses have distinct classes and token colors.
- Confirmed the guide uses the production `Tabs` and `EmptyState` primitives.
- Confirmed the zero bar retains its accessible label and visible textual evidence.
- Confirmed existing print CSS, responsive rules, capture classes, 16:9 sentence, and primary click journey remain present.
- Confirmed no dependency or lockfile changes were introduced.
- Confirmed the worktree contained no unrelated pre-existing changes before this fix wave.

## Residual Browser Verification

No real-browser session was performed. The following remain explicit manual verification items and are not claimed by this report:

- Rendered geometry and unintended horizontal overflow at 320, 768, and 1440 px.
- The full keyboard journey through the running application.
- Visual appearance and contrast of focus indicators in an actual browser.
- Browser console cleanliness during the complete journey.
- Actual 16:9 capture composition of the visual guide.
