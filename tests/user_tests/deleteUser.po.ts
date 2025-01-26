import type { Page } from "playwright/test";

export class DeleteUser {
  // get the row where the Email field is equal to the {username} parameter
  readonly menuButtonForUser = this.page
    .getByRole(`row`)
    .filter({ has: this.page.getByRole("cell", { name: this.username }) })
    .getByRole("button");
  readonly table = this.page.locator("table");
  constructor(
    readonly page: Page,
    readonly username: string,
  ) {}
}
