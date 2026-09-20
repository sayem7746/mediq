import { expect, test } from "@playwright/test";

test("profile shows labels, source, disclaimer above enquiry", async ({
  page,
}) => {
  await page.goto("/en/providers/fixture-alpha-medical-centre");
  await expect(page.getByText("Source")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "https://alpha.example/services" }),
  ).toBeVisible();
  await expect(
    page.getByText(/information and navigation only/i),
  ).toBeVisible();
  const disclaimer = page.getByText(/information and navigation only/i).first();
  const cta = page.getByRole("link", { name: /Request information/i });
  const disclaimerBox = await disclaimer.boundingBox();
  const ctaBox = await cta.boundingBox();
  expect(disclaimerBox && ctaBox && disclaimerBox.y < ctaBox.y).toBeTruthy();
});
