import { expect, test } from "@playwright/test";
import { DeleteUser } from "tests/user_tests/deleteUser.po";
import { LoginPage } from "tests/user_tests/login.po";
import { LogoutPage } from "tests/user_tests/logout.po";

const routesToTest = [
  { path: "/dashboard", selector: "header" },
  { path: "/dashboard/instances", selector: "header" },
  { path: "/dashboard/import", selector: "header" },
  { path: "/dashboard/users", selector: "header" },
  { path: "/dashboard/layout", selector: "header" },
  { path: "/login", selector: "form" },
  { path: "/view-data", selector: "main" },
  { path: "/view-data/malie?timeSeriesMetric=batterySoc", selector: "main" },
  { path: "/view-data/contribute", selector: "main" },
  { path: "/view-data/impressum", selector: "main" },
  { path: "/view-data/privacy", selector: "main" },
  { path: "/view-data/layout", selector: "main" },
  { path: "/dashboard/", selector: "header" },
];

let username: string;
let password: string;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  const jsonData = await page.evaluate(async () => {
    const response = await fetch("/api/seed");
    return response.json() as Promise<{ email: string; password: string }>;
  });

  {
    const { email, password: pw } = jsonData;
    username = email;
    password = pw;
  }
  await page.goto("/login");
});

test(`should visit page and find something`, async ({ page }) => {
  // So i can actually see all the pages i have to be logged in
  await page.goto("/dashboard");

  const loginPage = new LoginPage(page);

  await expect(loginPage.usernameInputfield).toBeVisible();
  await expect(loginPage.passwordInputfield).toBeVisible();
  await expect(loginPage.loginButton).toBeVisible();
  await loginPage.passwordInputfield.fill(password);
  await loginPage.usernameInputfield.fill(username);
  await loginPage.loginButton.click();

  await page.waitForSelector("text=Dashboard");
  // untill here
  for (const { path, selector } of routesToTest) {
    await page.goto(path);
    await expect(page.locator(selector)).toBeVisible(); 
  }

  await page.goto("/dashboard/users");
  
  // and also log out
  const user_DeletePage = new DeleteUser(page, username);
  await user_DeletePage.menuButtonForUser.hover();
  await user_DeletePage.menuButtonForUser.focus();
  await user_DeletePage.menuButtonForUser.click();
  await page.getByRole("menuitem", { name: "Delete" }).click();

  await page.goto("/dashboard");

  // logging out user

  const logoutPage = new LogoutPage(page, username);

  if (!(await logoutPage.userButtonIsVisible)) {
    await logoutPage.openDashboardButton.hover();
    await logoutPage.openDashboardButton.focus();
    await logoutPage.openDashboardButton.click();
  }

  await logoutPage.userbutton.hover();
  await logoutPage.userbutton.focus();
  await logoutPage.userbutton.click();
  await page.getByRole("menuitem", { name: "Log out" }).click();

  // trying to access dashboard after logging out

  await page.goto("/dashboard");
});
