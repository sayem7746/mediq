# Service boundary

**Status:** Product policy (P0)  
**Owner:** Product Owner — MediQ  
**Audience:** Staff, contractors, and software that write or render user-facing copy  
**Last reviewed:** 2026-09-20

MediQ is an **information and navigation only** service. Staff and software may only surface provider-stated services and route a consented enquiry. MediQ does not practise medicine, give clinical advice, or handle emergencies.

## Purpose

Help Bangladeshi patients and their families **find listed Malaysian hospitals and medical centres** by provider-stated specialty or treatment availability, and **send a consented information request**. The service does not diagnose, triage, rank clinical suitability, recommend treatment, or promise outcomes.

## Allowed actions

Staff and software may:

1. Show a hospital or medical-centre listing that the provider (or an approved source) has stated.
2. Filter and search by provider name and selected specialty/treatment **categories**, including English and Bangla labels and approved synonyms.
3. Show location, languages, public contacts, official website, international-patient contact, verification date, source, partner status, and a conspicuous sponsored label.
4. Collect a minimised, consented enquiry and route it to operations or to the selected provider’s published contact.
5. Explain fees, refunds, listing relationships, how results are ordered, and how to contact a provider directly.

## Forbidden actions

Staff and software must not:

1. Diagnose, suggest a diagnosis, or map symptoms to a condition.
2. Perform clinical triage or urgency scoring (except showing a fixed emergency redirect).
3. Rank or imply clinical quality, suitability, or “best for you / best hospital”.
4. Recommend a treatment, procedure, medicine, or care pathway.
5. Promise outcomes, wait times, prices of clinical care, or appointment availability unless independently substantiated **and** approved in writing.
6. Handle or advise on medical emergencies.
7. Change unlabeled organic result order because of payment, commission, or referral value.
8. Invent specialties, outcomes, or partner claims.

## Required user-facing disclaimer

Every public surface that presents listings or an enquiry call-to-action must show this meaning (approved wording lives in `content/disclosures.*.json`):

> MediQ is information and navigation only. It is not medical advice, diagnosis, or emergency care. Listings repeat what providers have stated. Contact a licensed provider or local emergency services for medical decisions.

Legal and native-Bangla reviewers must approve the exact strings before launch. Do not paraphrase legal strings in JSX.

## Urgent-care escalation

MediQ does **not** handle emergencies.

| Situation | Required action |
| --- | --- |
| User describes an emergency, severe symptoms, or asks what to do right now | Do not advise. Show the approved emergency notice. Tell the user to call local emergency services or go to the nearest emergency department. |
| User is in Bangladesh and needs urgent care | Redirect to local emergency services (999 in Bangladesh) or the nearest hospital emergency department. |
| User is in Malaysia and needs urgent care | Redirect to local emergency services (999 in Malaysia) or the nearest hospital emergency department. |
| User asks MediQ to “check” symptoms | Refuse. Offer directory categories and the selected provider’s direct contact only. |

There is no in-product clinical escalation path. The only escalation is **to a licensed provider or emergency services**.

## Content-review checklist

Before publishing or changing user-facing copy, listings, or templates, confirm:

- [ ] Copy is information and navigation only.
- [ ] No diagnosis, symptom-to-diagnosis matching, or triage language.
- [ ] No “best”, “top”, “recommended for you”, or outcome guarantee.
- [ ] Sponsored or paid placement is labeled and separated from organic results.
- [ ] Every material listing field has a source and verification/freshness date.
- [ ] Emergency notice and service-boundary disclaimer are visible on enquiry paths.
- [ ] Bangla and English legal strings match approved keys in `content/`.
- [ ] A named reviewer recorded the change (see `docs/content-review-checklist.md`).

## Allowed copy examples

1. “Browse hospitals that list cardiology services.”
2. “This listing was last verified on 20 March 2026 from the hospital’s official website.”
3. “You can send a request for information. MediQ will not give medical advice.”
4. “Filter by city, language, and whether the provider lists an international-patient contact.”
5. “This result is Sponsored. Payment does not change the unlabeled directory order.”

## Prohibited copy examples

1. “You may have a heart problem — see a cardiologist.”
2. “Best hospital in Kuala Lumpur for your cancer.”
3. “We recommend bypass surgery at this centre.”
4. “Guaranteed successful IVF in two cycles.”
5. “Tell us your symptoms and we will match the right doctor.”

## Related documents

- [Revenue and fee disclosure](./revenue-disclosure.md)
- [Directory ranking policy](./directory-ranking-policy.md)
- [Patient disclosures](../content/README.md)
- [Legal review checklist](./legal-review-checklist.md)
