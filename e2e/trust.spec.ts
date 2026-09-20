import { expect, test } from "@playwright/test";

const routes = [
  "/trust",
  "/how-it-works",
  "/fees",
  "/privacy",
  "/contact",
] as const;

for (const locale of ["en", "bn"] as const) {
  for (const route of routes) {
    test(`${locale}${route} renders`, async ({ page }) => {
      await page.goto(`/${locale}${route}`);
      await expect(page.locator("main")).toBeVisible();
    });
  }
}
