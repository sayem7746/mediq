# Hospital data model

**Status:** Engineering contract  
**Owner:** Directory ops  
**Last reviewed:** 2026-09-20

Listings are validated by `src/lib/schemas/provider.ts` before publish or import.

## Hospital

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable internal id |
| `slug` | string | Public URL key |
| `legalName` | string | Registered name |
| `displayName` | string | Directory label |
| `branch` | Branch | City, country, optional name |
| `publicContact` | `{ phone?, email? }` | Non-clinical public contacts |
| `officialWebsite` | URL | Required |
| `offeringIds` | string[] | Must exist in `data/specialty-taxonomy.json` |
| `source` | Source | Official URL + kind |
| `verification` | VerificationRecord | `unverified` or `verified` |
| `nextReviewAt` | ISO datetime | Stale when in the past; still allowed |
| `relationship` | ProviderRelationship | See enum below |
| `sponsored` | boolean | Forbidden when `relationship` is `none` |
| `published` | boolean | Public directory only when true |
| `languages` | string[] | Provider-stated service languages |
| `internationalPatientContact` | optional | Phone and/or email |

## Nested types

**Branch:** `city`, `country`, optional `name`.

**Source:** `url`, `kind` (`official_website` \| `provider_document` \| `registry` \| `other`).

**VerificationRecord:** `status`, optional `verifiedAt`, optional `reviewer`.

**SpecialtyOffering:** `id`, `taxonomyId`, optional `statedLabel`. Hospitals store `offeringIds` rather than free-text clinical claims.

**ProviderRelationship:** `none` \| `invited` \| `documents_pending` \| `verified` \| `contracted` \| `published` \| `suspended` \| `terminated`.

## Publish guard

`published === true` requires:

- `source.url`
- `verification.verifiedAt` and `reviewer`
- `nextReviewAt` (may be in the past; the listing is then flagged stale)
- relationship `published` or `contracted`

A past `nextReviewAt` does **not** fail the schema. The daily job flags it and the default verified filter excludes it.

## Related

- [Directory ranking policy](./directory-ranking-policy.md)
- [Directory operations](./directory-operations.md)
