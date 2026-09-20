# Security and data handling

**Status:** Engineering + privacy notes — **not a legal opinion**  
**Owner:** Privacy lead — _unassigned_  
**Last reviewed:** 2026-09-20

## Secrets

- Store `SESSION_SECRET` and bootstrap credentials in a secrets manager in production. Do not commit `.env` files.
- Rotate `SESSION_SECRET` when staff leave. Sessions are HMAC-signed cookies (`httpOnly`, `secure` in production, `sameSite=lax`).

## Production / test separation

- `TEST_FIXTURES=1` or `NODE_ENV=test` loads fake hospitals from `src/test/fixtures/providers.json`.
- Production must not point `DATABASE_PATH` at a test file. Default path: `./data/mediq.sqlite`.

## Encryption at rest

SQLite files on disk are not application-encrypted. Production hosting must use volume encryption (cloud disk encryption or equivalent). **Note for counsel / infra:** confirm the hosting control.

## TLS

All production traffic must be HTTPS. The session cookie sets `secure` when `NODE_ENV=production`.

## Backup owner

_PLACEHOLDER — named backup owner unassigned._

## Retention duration

_PLACEHOLDER for counsel._ The retention job (`src/lib/jobs/retention.ts`) dry-runs and writes an audit log. It will not delete until counsel sets a duration.

## Deletion workflow

1. User or regulator request logged as a deletion job.
2. Dry-run lists candidate navigation requests older than the (future) retention window.
3. Admin export may include consent + audit (`consent.export` is admin-only).
4. Ordinary staff cannot update or delete consent events.

## Related

- [Legal review checklist](./legal-review-checklist.md)
- [Open legal questions](./open-legal-questions.md)
