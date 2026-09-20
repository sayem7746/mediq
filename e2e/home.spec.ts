import { expect, test } from "@playwright/test";

test("home shows search, categories, emergency, and symptoms helper", async ({
  page,
}) => {
  await page.goto("/en");
  await expect(
    page.getByRole("heading", { name: /Find listed Malaysian hospitals/i }),
  ).toBeVisible();
  await expect(page.getByText(/Do not enter symptoms/i)).toBeVisible();
  await expect(page.getByText(/emergency number is 999/i)).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Search directory/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Cardiology/i })).toBeVisible();
});
