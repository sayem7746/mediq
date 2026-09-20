# Bilingual disclosure language review

**Review date:** 2026-09-20  
**Consent / fee version reviewed:** `2026-09-20.1`  
**English reviewer:** Product engineering  
**Bangla reviewer:** Product engineering (native-register review of all legal strings)  
**Counsel:** not signed — see [required changes](../docs/legal-required-changes.md) LC-04

This review covers meaning, register, and key parity. It is **not** counsel approval.

## Surfaces checked

| Path | Consent before submit | Disclosures shown |
| --- | --- | --- |
| `/[locale]/request-info` | Required checkbox; server rejects missing consent | Emergency, service boundary, privacy, fee, direct-contact |
| Provider profile → request CTA | Same form, provider preselected | Same |
| Contact / complaint | Not an enquiry submit | Complaint route + service boundary |

There is only one enquiry submit path. It cannot store a navigation request without `consent=true`.

## English notes

- Service-boundary, emergency 999, and “confirm with the provider” language are plain and non-clinical.
- Fee copy still uses a finance placeholder (`patientFeeAmountPlaceholder`). That is intentional until LC-09.
- `sponsoredLabel` stays the English word `Sponsored` in both locales so the on-card label is consistent.

## Bangla notes

- Strings use standard formal Bangla suitable for a public patient-facing notice.
- Clinical verbs (রোগ নির্ণয়, চিকিৎসা, জরুরি সেবা) are used only to **deny** those services.
- “Sponsored” and “Fees” / “Privacy” / “Contact” page names stay in English because those are UI route labels.
- No meaning change was made, so `consentVersion` was not bumped.

## Review status

| File | Counsel | Native Bangla | Status |
| --- | --- | --- | --- |
| `disclosures.en.json` | pending | n/a | language-reviewed draft |
| `disclosures.bn.json` | pending | reviewed 2026-09-20 | language-reviewed draft |
| `fee-disclosure.en.json` | pending | n/a | language-reviewed draft |
| `fee-disclosure.bn.json` | pending | reviewed 2026-09-20 | language-reviewed draft |
