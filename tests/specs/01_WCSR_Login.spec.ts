import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { TEST_CREDENTIALS } from '../../src/constants';

test.describe('WCSR Tool - Login Scenarios', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // ---------------------------------------------------------
  // POSITIVE SCENARIOS & UI VERIFICATION
  // ---------------------------------------------------------

  test('TC_01: Verify "WCSR Tool - Sign On" text on Landing Page', async ({ page }) => {
    // Verifying the specific text exists on the page
    await expect(page.locator('body')).toContainText('WCSR Tool - Sign On');
  });

  test('TC_02: Positive - Login with valid credentials', async ({ page }) => {
    await loginPage.login();
    
  });

  test('TC_03: Positive - Login using "Enter" key', async ({ page }) => {
    await loginPage.loginWithEnter();
    
    // Add assertion for successful login
  });

  // ---------------------------------------------------------
  // NEGATIVE SCENARIOS
  // ---------------------------------------------------------

  test('TC_04: Negative - Invalid Username and Valid Password', async ({ page }) => {
    await page.locator('input[id="username"]').fill('invalid_user@moto.com');
    await page.locator('input[id="password"]').fill(TEST_CREDENTIALS.PASSWORD);
    await page.locator('button[title="Sign On"]').click();
    await expect(page.locator('button[title="Sign On"]')).toBeVisible();
  });

  test('TC_05: Negative - Valid Username and Invalid Password', async ({ page }) => {
    await page.locator('input[id="username"]').fill(TEST_CREDENTIALS.USERNAME);
    await page.locator('input[id="password"]').fill('WrongPassword@123');
    await page.locator('button[title="Sign On"]').click();
    await expect(page.locator('button[title="Sign On"]')).toBeVisible();
  });

  test('TC_06: Negative - Invalid Username and Invalid Password', async ({ page }) => {
    await page.locator('input[id="username"]').fill('invalid_user@moto.com');
    await page.locator('input[id="password"]').fill('WrongPassword@123');
    await page.locator('button[title="Sign On"]').click();
    await expect(page.locator('button[title="Sign On"]')).toBeVisible();
  });

  test('TC_07: Negative - Empty Username and Valid Password', async ({ page }) => {
    await page.locator('input[id="password"]').fill(TEST_CREDENTIALS.PASSWORD);
    await page.locator('button[title="Sign On"]').click();
    await expect(page.locator('button[title="Sign On"]')).toBeVisible();
  });

  test('TC_08: Negative - Valid Username and Empty Password', async ({ page }) => {
    await page.locator('input[id="username"]').fill(TEST_CREDENTIALS.USERNAME);
    await page.locator('button[title="Sign On"]').click();
    await expect(page.locator('button[title="Sign On"]')).toBeVisible();
  });

  test('TC_09: Negative - Empty Username and Empty Password', async ({ page }) => {
    await page.locator('button[title="Sign On"]').click();
    await expect(page.locator('button[title="Sign On"]')).toBeVisible();
  });

  test('TC_10: Positive - Verify username input accepts email format', async ({ page }) => {
    const usernameInput = page.locator('input[id="username"]');
    await usernameInput.fill(TEST_CREDENTIALS.USERNAME);
    const inputValue = await usernameInput.inputValue();
    await expect(inputValue).toBe(TEST_CREDENTIALS.USERNAME);
    // Verify input field accepts email characters
    await expect(usernameInput).toHaveAttribute('type', 'text');
  });

  test('TC_11: Positive - Verify password input field is masked', async ({ page }) => {
    const passwordInput = page.locator('input[id="password"]');
    await passwordInput.fill(TEST_CREDENTIALS.PASSWORD);
    // Verify password input is type password (masked)
    await expect(passwordInput).toHaveAttribute('type', 'password');
    // Verify the input value is set correctly
    const inputValue = await passwordInput.inputValue();
    await expect(inputValue).toBe(TEST_CREDENTIALS.PASSWORD);
  });

  test('TC_12: Negative - Password with leading space', async ({ page }) => {
    await page.locator('input[id="username"]').fill(TEST_CREDENTIALS.USERNAME);
    await page.locator('input[id="password"]').fill(` ${TEST_CREDENTIALS.PASSWORD}`);
    await page.locator('button[title="Sign On"]').click();
    await expect(page.locator('button[title="Sign On"]')).toBeVisible();
  });

  test('TC_13: Negative - Password with trailing space', async ({ page }) => {
    await page.locator('input[id="username"]').fill(TEST_CREDENTIALS.USERNAME);
    await page.locator('input[id="password"]').fill(`${TEST_CREDENTIALS.PASSWORD} `);
    await page.locator('button[title="Sign On"]').click();
    await expect(page.locator('button[title="Sign On"]')).toBeVisible();
  });

  test('TC_14: Positive - Verify Sign On button is enabled and clickable', async ({ page }) => {
    const signOnButton = page.locator('button[title="Sign On"]');
    // Verify button is visible and enabled
    await expect(signOnButton).toBeVisible();
    await expect(signOnButton).toBeEnabled();
    // Fill credentials and verify button remains enabled
    await page.locator('input[id="username"]').fill(TEST_CREDENTIALS.USERNAME);
    await page.locator('input[id="password"]').fill(TEST_CREDENTIALS.PASSWORD);
    await expect(signOnButton).toBeEnabled();
  });

  test('TC_15: Negative - Password in UPPERCASE', async ({ page }) => {
    await page.locator('input[id="username"]').fill(TEST_CREDENTIALS.USERNAME);
    await page.locator('input[id="password"]').fill(TEST_CREDENTIALS.PASSWORD.toUpperCase());
    await page.locator('button[title="Sign On"]').click();
    await expect(page.locator('button[title="Sign On"]')).toBeVisible();
  });

  test('TC_16: Negative - Special characters only in Username', async ({ page }) => {
    await page.locator('input[id="username"]').fill('!@#$%^&*()');
    await page.locator('input[id="password"]').fill(TEST_CREDENTIALS.PASSWORD);
    await page.locator('button[title="Sign On"]').click();
    await expect(page.locator('button[title="Sign On"]')).toBeVisible();
  });

  test('TC_17: Negative - Special characters only in Password', async ({ page }) => {
    await page.locator('input[id="username"]').fill(TEST_CREDENTIALS.USERNAME);
    await page.locator('input[id="password"]').fill('!@#$%^&*()');
    await page.locator('button[title="Sign On"]').click();
    await expect(page.locator('button[title="Sign On"]')).toBeVisible();
  });

  test('TC_18: Negative - SQL Injection payload in Username', async ({ page }) => {
    await page.locator('input[id="username"]').fill("' OR '1'='1");
    await page.locator('input[id="password"]').fill(TEST_CREDENTIALS.PASSWORD);
    await page.locator('button[title="Sign On"]').click();
    await expect(page.locator('button[title="Sign On"]')).toBeVisible();
  });

  test('TC_19: Negative - XSS payload in Username', async ({ page }) => {
    await page.locator('input[id="username"]').fill("<script>alert('xss')</script>");
    await page.locator('input[id="password"]').fill(TEST_CREDENTIALS.PASSWORD);
    await page.locator('button[title="Sign On"]').click();
    await expect(page.locator('button[title="Sign On"]')).toBeVisible();
  });

  test('TC_20: Negative - Extremely long string in Username', async ({ page }) => {
    const longString = 'a'.repeat(256); // 256 characters
    await page.locator('input[id="username"]').fill(longString);
    await page.locator('input[id="password"]').fill(TEST_CREDENTIALS.PASSWORD);
    await page.locator('button[title="Sign On"]').click();
    await expect(page.locator('button[title="Sign On"]')).toBeVisible();
  });

});