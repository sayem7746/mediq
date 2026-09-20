# Directory ranking policy

**Status:** Product policy (P0)  
**Owner:** Product Owner — MediQ  
**Last reviewed:** 2026-09-20

Organic results are a **deterministic, non-clinical sort**. No clinical quality score, outcome score, star rating, or payment value is used. Implementation: `src/lib/rank-providers.ts`.

## Organic filters

Users may filter by:

| Filter | Meaning |
| --- | --- |
| `q` | Provider **name** only (plus exact taxonomy synonym match when used as a category search) |
| `specialty` | Provider-stated offering ID from `data/specialty-taxonomy.json` |
| `city` | Branch city allowlist |
| `language` | Languages the provider states it can serve |
| `verification` | `verified` (default for the verified toggle) or all published |
| `internationalPatientService` | Provider states an international-patient contact |

Search must **never** accept symptoms as diagnostic input. Empty or invalid filters return a safe empty state, not medical advice.

## Deterministic organic tie-breakers

Apply **in this order**. Each step is a boolean or locale-aware comparison, not a hidden weight.

1. **Selected specialty match** — listings that include the selected offering ID before those that do not (if a specialty is selected).
2. **Verified status** — `verification.status === "verified"` and not stale (`nextReviewAt` in the future) before unverified or stale.
3. **Selected city match** — if the user selected a city.
4. **Selected language match** — if the user selected a language.
5. **Alphabetical provider display name** — locale-aware (`en` or `bn`).

If a filter is not selected, that tie-breaker is skipped.

**Forbidden inputs:** revenue, commission, contract value, outcome data, clinical quality scores, wait time, user medical history, or any “personalisation” from symptoms.

## Sponsored placement

Sponsored results are a **separate list** above or beside organic results, never interleaved without a label.

Rules:

- Render only when `relationship` is `partner` or `contracted` **and** `sponsored === true`.
- Always show the `Sponsored` label (`content/disclosures.*.json` → `sponsoredLabel`) and a link to `/fees`.
- Sponsored membership must not change organic order. Tests must prove identical organic order when payment flags flip.

## “How results are ordered”

Every results page must link to this policy (public page: `/how-it-works` and `/trust`) with visible text such as “How results are ordered”.

## Related documents

- [Ranking test matrix](./ranking-test-matrix.md)
- [Service boundary](./service-boundary.md)
- [Revenue disclosure](./revenue-disclosure.md)
