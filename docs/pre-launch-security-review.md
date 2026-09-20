# Pre-launch security review

**Reviewer:** _unassigned_  
**Date:** pending

| ID | Finding | Severity | Status | Evidence |
| --- | --- | --- | --- | --- |
| | | | open | |

Automated gates already in CI: lint, typecheck, unit tests, content-policy, Playwright, build. Dependabot weekly for npm.

Tests that must stay green:

- No admin session without auth cookie
- Expired request tokens fail indistinguishably
- Rate limit after burst
- Honeypot creates no navigation request row
