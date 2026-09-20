# Pre-launch security review

**Reviewer:** Engineering launch review  
**Date:** 2026-09-20

| ID | Finding | Severity | Status | Evidence | Owner | Fix / exception | Retest |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SEC-001 | Dev-only npm audit hits in vitest mocker and drizzle-kit/esbuild | moderate | exception recorded | `npm audit --omit=dev` is clean; CI runs `npm run audit:prod` | Engineering | Do not force-downgrade drizzle-kit. Production install has 0 vulnerabilities. | each CI run |
| SEC-002 | Live navigation-fee amount still a placeholder | high | open | `content/fee-disclosure.*.json` | Finance + counsel | Required before general launch | pending |

Automated gates already in CI: production dependency audit, lint, typecheck, unit tests, content-policy, Playwright, build. Dependabot weekly for npm. Unresolved critical/high production findings block launch unless an authorized exception is recorded.

Tests that must stay green:

- No admin session without auth cookie
- Expired request tokens fail indistinguishably
- Rate limit after burst
- Honeypot creates no navigation request row
