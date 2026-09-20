# MediQ

MediQ is an **information and navigation only** service for Bangladeshi patients who need to find **listed Malaysian hospitals and medical centres**. It does not diagnose, recommend treatment, rank clinical quality, promise outcomes, or handle emergencies.

Search is limited to provider names and directory taxonomy synonyms. Sponsored results are a separate labeled list. Organic order is specialty match, verified and not stale, city match, language match, then locale-aware A–Z name. Payment never changes organic order.

## Prerequisites

- Node.js 20 or newer
- npm

## Setup

```bash
cp .env.example .env.local
# replace SESSION_SECRET (32+ chars) and staff bootstrap values
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Locale prefixes are `/en` and `/bn`.

Never commit secrets. `.env*` is gitignored except `.env.example`.

Test-only hospitals load when `TEST_FIXTURES=1` or `NODE_ENV=test`. Do not treat those fixtures as production listings. Official-source launch listings live in `data/providers/launch-set.json`.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next.js development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest |
| `npm run test:e2e` | Playwright (desktop Chromium and 320px Android-sized) |
| `npm run test:content-policy` | Locale key parity + prohibited copy |
| `npm run format` | Prettier |
| `npm run validate:providers` | Validate `data/providers/*.json` |
| `npm run jobs:stale` | Flag published listings past `nextReviewAt` |
| `npm run jobs:retention` | Retention job (dry-run unless `--live`) |
| `npm run audit:prod` | Production dependency audit |

## Docs

- [Service boundary](docs/service-boundary.md)
- [Revenue disclosure](docs/revenue-disclosure.md)
- [Legal review checklist](docs/legal-review-checklist.md)
- [Legal required changes](docs/legal-required-changes.md)
- [Open legal questions](docs/open-legal-questions.md)
- [Provider agreement requirements](docs/provider-agreement-requirements.md)
- [Directory ranking policy](docs/directory-ranking-policy.md)
- [Ranking test matrix](docs/ranking-test-matrix.md)
- [Hospital data model](docs/hospital-data-model.md)
- [Directory operations](docs/directory-operations.md)
- [Enquiry operations playbook](docs/enquiry-operations-playbook.md)
- [Case statuses](docs/case-statuses.md)
- [Security and data handling](docs/security-and-data-handling.md)
- [Content review checklist](docs/content-review-checklist.md)
- [Accessibility QA](docs/accessibility-qa.md)
- [Pre-launch security review](docs/pre-launch-security-review.md)
- [Analytics event schema](docs/analytics-event-schema.md)
- [Beta launch checklist](docs/beta-launch-checklist.md)
- [Beta issue log](docs/beta-issue-log.md)
- [Limited beta dry run](docs/limited-beta-dry-run.md)
- [Launch directory verification log](data/providers/verification-log.md)

Approved legal strings live in [`content/`](content/README.md). UI must import them; do not duplicate legal copy in JSX.

## Design

Public UI tokens follow the **Stitch MediQ Navigator** project: primary teal `#0F766E`, ink `#0F172A`, surface `#F8FAF9`, amber warnings, Plus Jakarta Sans headlines, Manrope body, 44px tap targets, visible focus, 16px body, mobile-first.

`GENERAL_LAUNCH_ENABLED` stays `false` until beta launch gates are approved.
