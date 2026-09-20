# Content review checklist

Use before publishing UI copy, staff templates, or listings.

- [ ] Information and navigation only; no diagnosis or treatment recommendation.
- [ ] Search copy tells users not to enter symptoms.
- [ ] Taxonomy labels are service categories, not symptoms.
- [ ] Sponsored is labeled and separate from organic results.
- [ ] Legal strings imported from `content/*.json`, not paraphrased in JSX.
- [ ] English and Bangla keys match (`npm run test:content-policy`).
- [ ] Staff templates pass prohibited-phrase flags.
- [ ] Reviewer name and date recorded.
- [ ] Bangla reviewed by a native speaker before launch.

Quoted prohibited examples in `docs/` are allowlisted for tests so the policy document can show what not to say.
