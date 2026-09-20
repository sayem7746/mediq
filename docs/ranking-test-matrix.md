# Ranking test matrix

Organic order must stay stable when sponsorship or payment metadata changes. Expected displays below assume published listings only.

| # | Scenario | Filters | Organic expectation | Sponsored expectation |
| --- | --- | --- | --- | --- |
| 1 | Same specialty, mixed verification | specialty = cardiology | Verified cardiology listings first, then unverified; each group A–Z by name | Sponsored cardiology cards in the Sponsored list only, each with label |
| 2 | City + language | city = Kuala Lumpur, language = Bangla | KL + Bangla matches first, then remaining; A–Z inside groups | Sponsored KL cards labeled; unpaid sponsored=false never appears there |
| 3 | Name search | q = “Sunway” | Name matches only; no clinical inference | Sponsored name matches still labeled and separate |
| 4 | Flip sponsored flag | same filters as #1, then set hospital B sponsored | Organic order **identical** to #1 | Hospital B appears in Sponsored list after the flip |
| 5 | Flip payment metadata only | same filters, change contract value / fee on hospital C | Organic order **identical** | No new sponsored card unless `sponsored === true` |
| 6 | No results | specialty = dental, city = unknown allowlist miss | Empty state: browse categories; no medical advice | Empty sponsored list, no placeholder “recommended” hospital |
| 7 | Stale verified listing | verification default on, `nextReviewAt` in the past | Stale record excluded from default verified set; still A–Z among included | Sponsored stale listings still labeled if shown in a non-default view |
| 8 | Alphabetical collision | two verified KL cardiology listings | Locale-aware A–Z by display name only | Separate sponsored rail |

Automated coverage: `src/lib/rank-providers.test.ts`.
