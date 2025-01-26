import type { Page } from "playwright/test";

export class LogoutPage {
  // get the row where the Email field is equal to the {username} parameter
  readonly openDashboardButton = this.page.getByText(`Toggle Sidebar`);
  readonly userbutton = this.page
    .locator("button")
    .filter({ has: this.page.getByText(this.username) });
  readonly userButtonIsVisible = this.userbutton.isVisible();
  constructor(
    readonly page: Page,
    readonly username: string,
  ) {}
}
