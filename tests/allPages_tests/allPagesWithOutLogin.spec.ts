import { expect, test } from "@playwright/test";

const routesToTest = [
  { path: "/dashboard", selector: "form" },
  { path: "/dashboard/instances", selector: "form" },
  { path: "/dashboard/import", selector: "form" },
  { path: "/dashboard/users", selector: "form" },
  { path: "/dashboard/", selector: "form" },
  { path: "/dashboard/layout", selector: "form" },
  { path: "/login", selector: "form" },
  { path: "/view-data", selector: "main" },
  { path: "/view-data/malie?timeSeriesMetric=batterySoc", selector: "main" },
  { path: "/view-data/", selector: "main" },
  { path: "/view-data/contribute", selector: "main" },
  { path: "/view-data/impressum", selector: "main" },
  { path: "/view-data/privacy", selector: "main" },
  { path: "/view-data/layout", selector: "main" },
];

routesToTest.forEach(({ path, selector }) => {
  test(`should visit ${path} and find ${selector}`, async ({ page }) => {
    await page.goto(path); 
    await expect(page.locator(selector)).toBeVisible(); 
  });
});
