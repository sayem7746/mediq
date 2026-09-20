# Limited beta dry run — 2026-09-20

## Cohort

Invited engineering cohort only: fixture hospitals when `TEST_FIXTURES=1`, plus the 20 official-source listings in `data/providers/launch-set.json` when fixtures are off. No public marketing invite. `GENERAL_LAUNCH_ENABLED` remains `false`.

## Monitored items

| Signal | Where | Dry-run result |
| --- | --- | --- |
| Request volume | `getWeeklyBetaReport().requestVolume` | Exercised by unit tests |
| First-response SLA | `staff_first_response` events | Console + tests |
| Consent errors | `consent_rejected` events | Missing consent stores no row |
| Complaint handling | Contact page + `complaint_opened` | Route published |
| Stale listings | `npm run jobs:stale` | Job flags past `nextReviewAt` |
| Sponsored labeling | Ranking tests | Unpaid sponsored cards cannot appear unlabeled |
| Content issues | `npm run test:content-policy` | No prohibited medical-advice phrasing |

## Findings

See [beta-issue-log.md](./beta-issue-log.md). Open P0 items are formally excepted and **block general launch**, not this limited dry run.

## Sign-off

| Role | Named person | Decision |
| --- | --- | --- |
| Product | Project owner — requested remaining launch-gate close on 2026-09-20 | Limited beta dry run accepted; general launch stays off |
| Operations | Engineering (playbook + weekly report) | Accepted for limited beta |
| Privacy / legal | Engineering — required changes attached | Excepted; counsel still required |
| Security | Engineering — SEC-001/SEC-002 recorded | Excepted; SEC-002 blocks general launch |
