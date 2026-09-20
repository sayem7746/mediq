# Legal and privacy review checklist

> **This is an internal launch-gate checklist, not legal advice.**  
> Qualified Malaysian and Bangladeshi counsel / privacy advisors must review patient-data handling, advertising, cross-border operations, agreements, and consent wording. Do not treat a completed row as approval unless counsel has signed.

**Owner:** Privacy / Legal coordinator — MediQ  
**Reviewer:** Engineering launch review (2026-09-20) — counsel still required  
**Review date:** 2026-09-20  
**Renewal date:** 2027-09-20

No item below is marked approved automatically. Every launch-blocker row is `changes-required` with the required-changes memo attached.

## How to complete a row

Record: **owner**, **decision** (`open` | `changes-required` | `approved`), **evidence link**, **reviewer**, **review date**, **renewal date**, **launch-blocker** (`yes` | `no`).

| Topic | Owner | Decision | Evidence link | Reviewer | Review date | Renewal date | Launch blocker |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Malaysian operations (entity, advertising, consumer law) | Legal coordinator | changes-required | [LC-01](./legal-required-changes.md) | Engineering | 2026-09-20 | 2027-09-20 | yes |
| Bangladeshi operations (entity, advertising, consumer law) | Legal coordinator | changes-required | [LC-02](./legal-required-changes.md) | Engineering | 2026-09-20 | 2027-09-20 | yes |
| Cross-border data transfers (BD ↔ MY and any hosting region) | Privacy lead | changes-required | [LC-03](./legal-required-changes.md) | Engineering | 2026-09-20 | 2027-09-20 | yes |
| Consent wording and capture (EN/BN) | Privacy lead | changes-required | [LC-04](./legal-required-changes.md) | Language review + engineering | 2026-09-20 | 2027-09-20 | yes |
| Retention and deletion | Privacy lead | changes-required | [LC-05](./legal-required-changes.md) | Engineering | 2026-09-20 | 2027-09-20 | yes |
| Consumer disclosures (service boundary, fees, sponsored) | Product Owner | changes-required | [LC-06](./legal-required-changes.md) | Engineering | 2026-09-20 | 2027-09-20 | yes |
| Advertising and directory claims | Product Owner | changes-required | [LC-07](./legal-required-changes.md) | Directory ops | 2026-09-20 | 2027-09-20 | yes |
| Provider agreements | Legal coordinator | changes-required | [LC-08](./legal-required-changes.md) | Engineering | 2026-09-20 | 2027-09-20 | yes |
| Payment and refund terms | Finance + Legal | changes-required | [LC-09](./legal-required-changes.md) | Engineering (SEC-002) | 2026-09-20 | 2027-09-20 | yes |
| Complaint handling | Operations lead | changes-required | [LC-10](./legal-required-changes.md) | Engineering | 2026-09-20 | 2027-09-20 | yes |

## Evidence to attach

- [Documented required changes](./legal-required-changes.md) (this review)
- Written counsel memo or redline, when received
- Named counsel firm and jurisdiction, when engaged
- Version IDs of reviewed disclosure JSON (`content/disclosures.*.json` `2026-09-20.1`, `content/fee-disclosure.*.json` `2026-09-20.1`)

## Related documents

- [Open legal questions](./open-legal-questions.md)
- [Security and data handling](./security-and-data-handling.md)
- [Service boundary](./service-boundary.md)
