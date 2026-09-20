# Enquiry operations playbook

**Status:** Staff procedure — non-clinical  
**Owner:** Operations lead — _unassigned_  
**Last reviewed:** 2026-09-20

Staff route consented information requests. They never diagnose, triage, or interpret hospital replies as clinical advice.

## Statuses and SLA

| Status | Meaning | SLA (target) |
| --- | --- | --- |
| received | Logged with consent | Acknowledge in 1 business day |
| being-routed | Owner assigned, routing | 2 business days |
| provider-contacted | Official provider contact used | Log contact the same day |
| provider-response-received | Provider replied; share non-clinical status | 1 business day |
| closed | Done, with reason | — |

`being-routed` may close if the user withdraws or cannot be reached. See [case statuses](./case-statuses.md).

## Consent check

Do not contact a provider until a consent event exists for the request (`consentVersion` + locale). If consent is missing, stop and do not invent consent.

## Owner

One staff owner per open case. Assignment is audited. Ordinary staff cannot open another owner’s case.

## Templates

Use `content/staff-templates.en.json` and `content/staff-templates.bn.json` only. The admin UI flags prohibited phrases via `src/lib/content-policy.ts`.

## Provider contact logging

Log date, channel, and the official contact used. Do not log clinical advice. Payment metadata must not affect routing order.

## Fee acknowledgement

Before first provider contact, confirm the user saw the fee disclosure. If they dispute the navigation fee, follow refund language in `content/fee-disclosure.*.json`.

## Complaints

Log as `complaint_opened` (analytics, no free-text diagnosis). This is not a hospital clinical complaints process.

## Closure

Requires a reason. Tell the user they may contact the hospital directly.

## Never-say

| Never say | Say instead |
| --- | --- |
| You may have [condition] | MediQ does not diagnose. Browse listed categories or contact the hospital. |
| This is the best hospital | Sponsored is labeled; organic order is documented. |
| We recommend this treatment | We can route your information request. |
| Guaranteed outcome | Confirm details with the provider. |
| Send your medical records | Do not send medical records to MediQ. |
| Go to A&E after we triage you | If this is an emergency, contact local emergency services (999). |

## Related

- [Service boundary](./service-boundary.md)
- [Case statuses](./case-statuses.md)
