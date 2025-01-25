import { expect, test } from "@playwright/test";

import { DeleteUser } from "./deleteUser";
import { LoginPage } from "./login.po";

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

test("login and user delete", async ({ page }) => {
  console.log(username);

  await page.goto("/dashboard");

  const loginPage = new LoginPage(page);

  await expect(loginPage.usernameInputfield).toBeVisible();
  await expect(loginPage.passwordInputfield).toBeVisible();
  await expect(loginPage.loginButton).toBeVisible();
  await loginPage.passwordInputfield.fill(password);
  await loginPage.usernameInputfield.fill(username);
  await loginPage.loginButton.click();

  await page.waitForSelector("text=Dashboard");
  await page.goto("/dashboard/users");

  const user_DeletePage = new DeleteUser(page, username);
  await user_DeletePage.menuButtonForUser.focus();
  await user_DeletePage.menuButtonForUser.hover();
  await user_DeletePage.menuButtonForUser.click();
  await page.getByRole("menuitem", { name: "Delete" }).click();
});
