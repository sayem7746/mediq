import { expect, test } from "@playwright/test";

test("language switch on a provider page preserves the path", async ({
  page,
}) => {
  await page.goto("/en/providers/fixture-alpha-medical-centre");
  await expect(
    page.getByRole("heading", { name: /Fixture Alpha Medical Centre/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "বাংলা" }).click();
  await expect(page).toHaveURL(/\/bn\/providers\/fixture-alpha-medical-centre/);
  await expect(
    page.getByRole("heading", { name: /Fixture Alpha Medical Centre/ }),
  ).toBeVisible();
});
