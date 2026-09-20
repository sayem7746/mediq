# Revenue and fee disclosure

**Status:** Product decision (P0)  
**Owner:** Product Owner — MediQ  
**Chosen model:** Disclosed mixed model  
**Last reviewed:** 2026-09-20

## Hard rules

1. **No undisclosed referral kickbacks.** MediQ must not accept a per-patient payment that is hidden from the user.
2. **Compensation cannot change unlabeled organic order.** Payment, commission, or contract value must never reorder the default directory.
3. **Disclose before consent.** Price, payer, scope, refund terms, and any provider compensation that applies to the user’s path must be visible **before** the user submits an enquiry.
4. **Sponsored is a separate component.** Paid placements appear only in a labeled Sponsored slot with a disclosure link. They are never mixed into unlabeled organic results.

Exact user-facing strings live in `content/fee-disclosure.en.json` and `content/fee-disclosure.bn.json`. Amounts below are **placeholders** until finance sets live prices.

## Decision table

| Attribute | Patient-paid navigation fee | Provider-paid contracted service fee | Mixed model (chosen) |
| --- | --- | --- | --- |
| Payer | The person sending the enquiry | The participating hospital or medical centre, under a written contract | Patient pays only if they use the coordination/enquiry service. Provider may pay a contracted listing/admin fee. |
| Price shown before consent | Fixed navigation fee, shown on `/fees` and on the request form (placeholder: BDT amount pending finance) | No patient charge for browsing. Sponsored slots labeled. Contract fee is not a per-patient kickback. | Browse is free. Enquiry/coordination fee shown before submit. Sponsored listings always labeled. |
| Service scope | Staff route a consented enquiry and share non-clinical status updates | Provider pays for accurate listing administration and optional labeled placement | Same as both columns: free directory + optional paid navigation + optional labeled placement |
| Refunds | Full refund if MediQ has not yet contacted a provider; no refund of a provider’s clinical fees (MediQ never collects those) | Not a patient payment; contract termination follows the provider agreement | Patient navigation fee follows the patient-paid refund rule |
| Invoice owner | MediQ (or its designated billing entity) invoices the patient | MediQ invoices the provider under the contract | MediQ invoices the relevant payer; never a hidden third-party |
| Disclosure text | “You will be charged a navigation fee before we route this request. This is not a medical fee.” | “Some listings are Sponsored. The hospital pays MediQ a contracted administration or placement fee. This does not change unlabeled results.” | Combine both disclosures on enquiry and directory surfaces |

## Chosen model — operating notes

| Item | Decision |
| --- | --- |
| Browse / search | Free, no account required |
| Information request | Patient-paid navigation/coordination fee, amount and refund rule shown before the consent checkbox |
| Organic ranking | Neutral, documented in `docs/directory-ranking-policy.md` |
| Provider compensation | Written contracted marketing/administration fee only; never a secret per-patient commission |
| Paid placement | Separate Sponsored component + always-visible “Sponsored” label + link to `/fees` |
| Clinical fees | Never collected or represented by MediQ |

## Launch blockers

- [ ] Finance publishes the live navigation fee and currency.
- [ ] Counsel approves disclosure wording in English and Bangla.
- [ ] Invoices name the legal entity that collects the fee.

## Related documents

- [Service boundary](./service-boundary.md)
- [Provider agreement requirements](./provider-agreement-requirements.md)
- [Fee disclosure strings](../content/fee-disclosure.en.json)
