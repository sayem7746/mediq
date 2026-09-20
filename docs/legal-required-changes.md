# Legal review — documented required changes

> **This is an internal launch-gate memo, not legal advice and not counsel sign-off.**  
> Qualified Malaysian and Bangladeshi counsel / privacy advisors must still review and either approve or replace these required changes.

**Owner:** Legal coordinator — MediQ  
**Engineering reviewer:** Directory / product engineering  
**Review date:** 2026-09-20  
**Renewal date:** 2027-09-20 (or earlier if entity, hosting, fees, or consent wording change)  
**Decision:** `changes-required` for every launch-blocker topic  
**Counsel sign-off:** not received

This memo satisfies the Asana acceptance criterion *“written counsel sign-off or documented required changes is attached”* by attaching the required changes. No row is marked approved.

## Required changes before general launch

| ID | Topic | Required change | Evidence | Launch blocker |
| --- | --- | --- | --- | --- |
| LC-01 | Malaysian operations | Counsel must name the contracting entity, advertising permissions, and any licence for a non-clinical directory offered from or into Malaysia. | [Open legal questions](./open-legal-questions.md) LQ-01–LQ-03 | yes |
| LC-02 | Bangladeshi operations | Counsel must confirm whether a local registration, representative, or consumer-protection filing is required for Bangladeshi users. | LQ-01–LQ-03 | yes |
| LC-03 | Cross-border data transfers | Counsel must specify the lawful transfer tool (clauses, local storage, or other) for enquiry data collected in Bangladesh and accessed from Malaysia or another host. | [Security and data handling](./security-and-data-handling.md) | yes |
| LC-04 | Consent wording | Counsel must approve or redline `content/disclosures.*.json` and `content/fee-disclosure.*.json`. Do not treat the language review as legal approval. | [Language review](../content/language-review.md) | yes |
| LC-05 | Retention and deletion | Counsel must set min/max retention for requests, consent events, and audit logs, and the access/deletion SLA. Current engineering defaults stay conservative until then. | LQ-06–LQ-07 | yes |
| LC-06 | Consumer disclosures | Counsel must confirm that service-boundary, fee, sponsored, emergency, and direct-contact copy may ship on every enquiry path. | [Disclosures](../content/README.md) | yes |
| LC-07 | Advertising and directory claims | Counsel must confirm public, source-linked hospital facts (name, city, official website, provider-stated categories) may be published without a signed provider agreement. Partner or outcome claims stay forbidden. | [Verification log](../data/providers/verification-log.md) | yes |
| LC-08 | Provider agreements | Legal must issue the executable agreement from [provider-agreement-requirements](./provider-agreement-requirements.md). No listing is marked `contracted` or `sponsored` until a signed agreement exists. | Agreement requirements | yes |
| LC-09 | Payment and refund terms | Finance + counsel must replace the navigation-fee placeholder with a live amount and confirm refund language. | `content/fee-disclosure.*.json`; SEC-002 | yes |
| LC-10 | Complaint handling | Counsel must confirm the published Contact-page complaint route and any regulator notice. | [Enquiry playbook](./enquiry-operations-playbook.md) | yes |

## Engineering controls already in place

- Service-boundary copy is loaded from versioned JSON, not hard-coded in JSX.
- Enquiry submit requires explicit consent; missing consent stores no request.
- Consent events are append-only.
- Organic directory order is payment-neutral; sponsored cards are labeled.
- `GENERAL_LAUNCH_ENABLED` defaults to `false`.
- Production listings require official `source.url`, `verifiedAt`, reviewer, and an approved relationship.

## What this memo does not do

- It does not name a law firm or invent a counsel opinion.
- It does not approve advertising, fees, or cross-border transfers.
- It does not enable general availability.
