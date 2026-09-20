# Analytics event schema

Allowlisted events only. Never send free-text enquiry bodies, contact values, or diagnosis fields. Payment must not appear as a ranking dimension.

| Event | When |
| --- | --- |
| `provider_search` | Directory search submitted |
| `filter_applied` | A filter other than empty default is applied |
| `provider_profile_viewed` | Published profile rendered |
| `request_submitted` | Consented request stored |
| `staff_first_response` | First status move off `received` |
| `listing_stale` | Daily stale job flags a listing |
| `complaint_opened` | Complaint logged from contact/ops |

Shared fields: `version` (integer), `locale`, `anonymizedRef`, `timestamp`. Implementation: `src/lib/analytics.ts`.

`/admin/operations` shows conversion (requests / profile views), first-response count, stale rate, and complaints. It does not use payment to rank.
