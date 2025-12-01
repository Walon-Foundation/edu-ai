import { test, expect } from "@playwright/test";

test("homepage has title and links to upload page", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Edu-Ai/);

  // Click the get started link.
  await page.getByRole("link", { name: /Upload Your First PDF/i }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page).toHaveURL(/.*upload/);
});
