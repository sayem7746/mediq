# Directory operations

**Status:** Operating procedure  
**Owner:** Directory ops — _unassigned_  
**Last reviewed:** 2026-09-20

## Roles

| Role | May draft | May publish | May suspend |
| --- | --- | --- | --- |
| editor | yes, with source URL | no | no |
| approver | yes | yes, after source check | yes |
| admin | yes | yes | yes |
| staff | no | no | no |

## Frequency

| Task | Cadence |
| --- | --- |
| Source check for new listings | Before first publish |
| Re-verification | By `nextReviewAt` (default 12 months, unless counsel sets otherwise) |
| Stale flag job | Daily (`src/lib/jobs/flag-stale-listings.ts`) |
| Correction review | Within 5 business days of submit |

## Evidence

Every material field needs an official `source.url`. Store the reviewer name and `verifiedAt`. Do not invent treatment claims.

## Reviewer

Named reviewer on the verification record. Approvers cannot publish as an anonymous system user.

## Stale rules

- Published listings with `nextReviewAt` in the past are **flagged**, not deleted.
- The default public “verified” filter excludes stale listings.
- Sponsored stale cards stay labeled if shown in a non-default view.
- Corrections: `submitted` → `under_review` → `approved` or `rejected` → `published`.

## Related

- [Hospital data model](./hospital-data-model.md)
- [Provider agreement requirements](./provider-agreement-requirements.md)
