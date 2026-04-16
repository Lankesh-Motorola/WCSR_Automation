import { test as setup, expect } from '@playwright/test';
import * as path from 'path';
import { APP_URLS, TEST_CREDENTIALS } from '../../src/constants';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('Authenticate and store session', async ({ page }) => {
  await page.goto(APP_URLS.LOGIN_URL);
  
  await page.locator('input[id="username"]').fill(TEST_CREDENTIALS.USERNAME);
  await page.locator('input[id="password"]').fill(TEST_CREDENTIALS.PASSWORD);
  await page.locator('button[title="Sign On"]').click();
  
  // FIX: Wait for a specific element on the post-login page to be visible
  await expect(
    page.getByText('Welcome to Customer Service Representative Tool!', { exact: false })
  ).toBeVisible({ timeout: 120000 });
  // Save storage state into the file
  await page.context().storageState({ path: authFile });
});