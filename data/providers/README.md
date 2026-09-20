# Provider data files

This folder holds **manually verified** hospital JSON files for import. Files must pass `npm run validate:providers`.

## Workflow

1. Collect an **official source URL** (hospital website or authorised document). Do not copy unverified marketing claims.
2. Record only provider-stated service **categories** that exist in `data/specialty-taxonomy.json`. Never add symptoms, diagnoses, urgency, or quality scores.
3. Set `verification.reviewer`, `verifiedAt`, and `nextReviewAt`. Published records also need relationship `published` or `contracted`.
4. `sponsored` may be true only when a written contracted placement exists. It is forbidden when `relationship` is `none`.
5. Run `npm run validate:providers`, then `npx tsx scripts/import-providers.ts --dry-run`.
6. An approver publishes after the source check. Editors may draft with a source URL; they cannot publish.

## Rules

- Do **not** invent real hospital treatment claims as published production truth.
- Test-only hospitals live in `src/test/fixtures/providers.json` and load when `TEST_FIXTURES=1` or `NODE_ENV=test`.
- Empty production imports are expected until counsel and directory ops approve live listings.
