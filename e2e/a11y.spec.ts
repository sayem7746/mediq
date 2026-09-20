import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function expectNoSerious(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter(
    (item) => item.impact === "serious" || item.impact === "critical",
  );
  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
}

test("axe directory, profile, and request", async ({ page }) => {
  await page.goto("/en/providers");
  await expectNoSerious(page);
  await page.goto("/en/providers/fixture-alpha-medical-centre");
  await expectNoSerious(page);
  await page.goto("/en/request-info");
  await expectNoSerious(page);
});
