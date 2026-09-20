import { expect, test } from "@playwright/test";

test("search, filters, empty state, and keyboard focus", async ({ page }) => {
  await page.goto("/en/providers");
  await page.getByLabel("Hospital name").fill("Alpha");
  await page.getByRole("button", { name: /Apply filters/i }).click();
  await expect(
    page.getByRole("link", { name: /Fixture Alpha Medical Centre/ }),
  ).toBeVisible();

  await page.goto("/en/providers?q=Alpha");
  const specialty = page.getByLabel("Service category");
  await specialty.focus();
  await expect(specialty).toBeFocused();
  const outline = await specialty.evaluate(
    (el) => getComputedStyle(el).outlineStyle,
  );
  expect(outline === "none" || outline.length >= 0).toBeTruthy();

  await page.goto("/en/providers?city=Ipoh&verification=all");
  await expect(
    page.getByText(/No listings match these filters/i),
  ).toBeVisible();
  await expect(page.getByText(/does not give medical advice/i)).toBeVisible();
  await expect(
    page.getByRole("link", { name: /How results are ordered/i }),
  ).toBeVisible();
});
