# Accessibility QA

## Browsers

- Latest Chrome, Firefox, and Safari on desktop.
- Android Chrome at **320px** width (Playwright project `android-320`).
- iOS Safari spot-check.

## Manual screen-reader checks

| Surface | Check |
| --- | --- |
| Home search | Labels, helper “do not enter symptoms”, submit button name |
| Filters | `fieldset`/`legend`, native select labels, visible focus, keyboard-only apply/reset |
| Profile | Source, verified date, disclaimer before enquiry CTA |
| Request | Consent checkbox name, error text, no file input |
| Language switcher | Path preserved, `aria-current` on active locale |

## Automated

Playwright + `@axe-core/playwright` on directory, profile, and request. Fail on **serious** and **critical**. Keyboard filter and focus-visible coverage lives in `e2e/`.

## Throttled network

`e2e/network-throttle.spec.ts` delays responses with `page.route` to smoke-test that home and directory still render.
