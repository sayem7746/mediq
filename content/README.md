# Approved legal and disclosure strings

This folder holds **versioned** English and Bangla copy that appears on enquiry, listing, and trust surfaces.

## Rules

1. Legal strings require **counsel** and **native-Bangla** approval before production launch.
2. Do not machine-translate these files into the live product without that review.
3. `disclosures.en.json` and `disclosures.bn.json` must contain the **same keys**.
4. `fee-disclosure.en.json` and `fee-disclosure.bn.json` must contain the **same keys**.
5. Application UI must import these files (or a typed loader). Do not hard-code legal sentences in JSX.
6. Bump `consentVersion` / `version` when meaning changes; store the version with each consent event.

## Required disclosure keys

`serviceBoundary`, `providerDataLimitation`, `consentCheckbox`, `consentVersion`, `privacyNotice`, `feeDisclosure`, `sponsoredLabel`, `emergencyNotice`, `directProviderContact`, `complaintRoute`.

## Review status

| File | Counsel | Native Bangla | Status |
| --- | --- | --- | --- |
| `disclosures.en.json` | pending | n/a | draft |
| `disclosures.bn.json` | pending | pending | draft |
| `fee-disclosure.en.json` | pending | n/a | draft |
| `fee-disclosure.bn.json` | pending | pending | draft |

Unit tests compare locale key sets and fail if a key is missing.
