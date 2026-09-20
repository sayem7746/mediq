import { expect, test } from "@playwright/test";

test("throttled network still renders home and directory", async ({ page }) => {
  await page.route("**/*", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    await route.continue();
  });
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.goto("/en/providers");
  await expect(
    page.getByRole("heading", { name: /Directory results/i }),
  ).toBeVisible();
});
