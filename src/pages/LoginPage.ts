import { Page, Locator } from '@playwright/test';
import { APP_URLS, TEST_CREDENTIALS } from '../constants';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(APP_URLS.LOGIN_URL);
  }

  getUsernameInput(): Locator {
    return this.page.locator('input[id="username"]');
  }

  getPasswordInput(): Locator {
    return this.page.locator('input[id="password"]');
  }

  getSignOnButton(): Locator {
    return this.page.locator('button[title="Sign On"]');
  }

  async login(username: string = TEST_CREDENTIALS.USERNAME, password: string = TEST_CREDENTIALS.PASSWORD): Promise<void> {
    await this.getUsernameInput().fill(username);
    await this.getPasswordInput().fill(password);
    await this.getSignOnButton().click();
  }

  async loginWithEnter(username: string = TEST_CREDENTIALS.USERNAME, password: string = TEST_CREDENTIALS.PASSWORD): Promise<void> {
    await this.getUsernameInput().fill(username);
    await this.getPasswordInput().fill(password);
    await this.getPasswordInput().press('Enter');
  }
}
