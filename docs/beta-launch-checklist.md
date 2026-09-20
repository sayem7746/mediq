# Beta launch checklist

`GENERAL_LAUNCH_ENABLED` stays `false` until every P0 gate below is **approved** by the named owner. Formal exceptions do not flip general launch on.

**Limited-beta dry run:** 2026-09-20  
**Cohort:** fixture + official-source directory in non-production (`TEST_FIXTURES` / local). No public general-availability invite.

| Gate | Approver role | Named person | Evidence | Decision | P0 |
| --- | --- | --- | --- | --- | --- |
| Legal / privacy review | Legal coordinator | Engineering launch review | [legal-review-checklist.md](./legal-review-checklist.md), [legal-required-changes.md](./legal-required-changes.md) | excepted — changes-required, not counsel-approved | yes |
| Provider-data verification | Directory ops | directory-ops-launch-set | [verification-log.md](../data/providers/verification-log.md), 20 official-source listings | accepted for limited beta | yes |
| Bilingual disclosure approval | Counsel + native Bangla | Language review 2026-09-20 | [language-review.md](../content/language-review.md) | excepted — language reviewed, counsel pending | yes |
| Content-policy tests | Engineering | Engineering | `npm run test:content-policy` | accepted | yes |
| Accessibility QA | Product Owner | Engineering | [accessibility-qa.md](./accessibility-qa.md), Playwright + axe | accepted | yes |
| Security findings | Privacy lead | Engineering | [pre-launch-security-review.md](./pre-launch-security-review.md) | excepted — SEC-001 recorded; SEC-002 fee placeholder blocks general launch | yes |
| Backups / retention job | Engineering | Engineering | `npm run jobs:retention`, `npm run jobs:stale` | accepted | yes |
| Operations staffing / SLA | Operations lead | Engineering | [enquiry-operations-playbook.md](./enquiry-operations-playbook.md) | accepted for limited beta | yes |
| Complaint route | Operations lead | Engineering | Contact page + `complaint_opened` | accepted for limited beta | yes |
| Analytics | Engineering | Engineering | `/admin/operations` weekly report | accepted | yes |
| Sponsored-label test | Engineering | Engineering | `src/lib/rank-providers.test.ts` | accepted | yes |
| Fee disclosure + live amount | Finance + counsel | unassigned | `content/fee-disclosure.*.json` | excepted — placeholder remains; general launch stays off | yes |
| Ranking tests | Engineering | Engineering | `src/lib/rank-providers.test.ts` | accepted | yes |

No row is counsel-approved by default. General launch remains disabled.
