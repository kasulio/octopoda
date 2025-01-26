import { expect, test } from "@playwright/test";

import { DeleteUser } from "./deleteUser.po";
import { LoginPage } from "./login.po";
import { LogoutPage } from "./logout.po";

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
  console.log(username);
  console.log(password);
  await page.goto("/login");
});

test("login, user delete and logout", async ({ page }) => {
  console.log(username);

  await page.goto("/dashboard");

  const loginPage = new LoginPage(page);

  // logging in

  await expect(loginPage.usernameInputfield).toBeVisible();
  await expect(loginPage.passwordInputfield).toBeVisible();
  await expect(loginPage.loginButton).toBeVisible();
  await loginPage.passwordInputfield.fill(password);
  await loginPage.usernameInputfield.fill(username);
  await loginPage.loginButton.click();

  await page.waitForSelector("text=Dashboard");
  await page.goto("/dashboard/users");

  // deleting user

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
