import { test, expect } from '@playwright/test';

test.describe('Auth', () => {
  test('login page is accessible', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/login/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test.fixme('should display the login form', async ({ page }) => {
    await page.goto('/login');
  });

  test.fixme('should display the register page', async ({ page }) => {
    await page.goto('/register');
  });

  test.fixme('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');
  });
});
