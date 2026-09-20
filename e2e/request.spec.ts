import { expect, test } from "@playwright/test";

test("request form requires consent", async ({ page }) => {
  await page.goto("/en/request-info?provider=fixture-alpha-medical-centre");
  await page.getByLabel("Your name").fill("Sam Example");
  await page.getByLabel(/Email, phone/).fill("sam@example.com");
  await page.getByLabel("Short message").fill("International desk hours");
  await page.getByRole("button", { name: /Send request/i }).click();
  await expect(page.getByRole("alert")).toContainText(/Consent is required/i);

  await page
    .getByLabel(/I understand MediQ will not give medical advice/i)
    .check();
  await page.getByRole("button", { name: /Send request/i }).click();
  await expect(
    page.getByRole("heading", { name: /Request received/i }),
  ).toBeVisible();
});
