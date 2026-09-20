# Beta launch checklist

`GENERAL_LAUNCH_ENABLED` stays `false` until every P0 gate below is approved.

| Gate | Approver role | Named person | Evidence | P0 |
| --- | --- | --- | --- | --- |
| Service boundary copy EN/BN | Counsel + native Bangla | unassigned | `content/disclosures.*.json` | yes |
| Fee disclosure + live amount | Finance + counsel | unassigned | `content/fee-disclosure.*.json` | yes |
| Legal review checklist | Legal coordinator | unassigned | `docs/legal-review-checklist.md` | yes |
| Security review | Privacy lead | unassigned | `docs/pre-launch-security-review.md` | yes |
| Accessibility QA | Product Owner | unassigned | `docs/accessibility-qa.md` | yes |
| Directory ops ready | Directory ops | unassigned | `docs/directory-operations.md` | yes |
| Enquiry playbook trained | Operations lead | unassigned | `docs/enquiry-operations-playbook.md` | yes |
| Ranking tests | Engineering | unassigned | `src/lib/rank-providers.test.ts` | yes |
| Content policy tests | Engineering | unassigned | `npm run test:content-policy` | yes |

No row is approved by default.
