# Provider agreement requirements

**Status:** Requirements for counsel — **not a legal contract**  
**Owner:** Legal coordinator — MediQ  
**Last reviewed:** 2026-09-20

Counsel must turn this checklist into a jurisdiction-appropriate agreement. Product and engineering must not publish a paid or partner listing without **written provider authorization**.

## Checklist counsel should cover

| Requirement | Why it matters | Engineering implication |
| --- | --- | --- |
| Written provider authorization | Only the hospital/medical centre (or its authorised agent) can approve a listing | `relationship` cannot become `partner` or `sponsored` without an approval record |
| Field accuracy | Listings may only repeat provider-stated facts | Every material field needs `sourceUrl` + verification date |
| Source URLs | Public claims must be checkable | Publish guard rejects missing official source |
| International-patient contact | Separate from general hospital switchboard when the provider publishes one | Optional typed field; never invent |
| Paid-placement label | Users must see Sponsored when a contracted placement is shown | Sponsored component is mandatory when `sponsored === true` |
| Data-processing responsibilities | Enquiry data may be shared with the selected provider | Provider is not a joint clinician with MediQ |
| No clinical delegation | MediQ does not diagnose, triage, or book clinical care on the provider’s behalf | Staff templates cannot give clinical advice |
| Audit trail | Corrections and relationship changes must be reconstructable | Immutable `provider_change_events` / revisions |
| Correction SLA | Stale or wrong fields must be fixable on a published clock | `nextReviewAt` + correction workflow |
| Termination | Listing and data use must stop when the contract ends | States: suspended / terminated hide public listing |
| Renewal | Verification and contract dates must not silently expire | Daily job flags stale listings |

## Onboarding states

```text
invited
  → documents pending
    → verified
      → contracted
        → published
          → suspended
          → terminated
```

| State | Public directory | Paid/sponsored allowed | Notes |
| --- | --- | --- | --- |
| invited | no | no | Internal record only |
| documents pending | no | no | Awaiting authorization pack |
| verified | no | no | Source-checked; not yet contracted unless relationship is `none` and business opts to publish an unpaid listing |
| contracted | no until publish | yes, after approval | Written agreement on file |
| published | yes | only if relationship permits and label shown | Requires source, reviewer, `verifiedAt`, `nextReviewAt` |
| suspended | no | no | Temporary hide; history retained |
| terminated | no | no | Contract ended; do not resurrect without new authorization |

An unpaid, source-verified listing may be published only when `relationship === "none"` and `sponsored === false`.

## Related documents

- [Revenue disclosure](./revenue-disclosure.md)
- [Hospital data model](./hospital-data-model.md)
- [Directory operations](./directory-operations.md)
