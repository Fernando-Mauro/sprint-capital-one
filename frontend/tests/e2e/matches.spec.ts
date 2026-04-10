import { test, expect } from '@playwright/test';

test.describe('Matches', () => {
  test('home page loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test.fixme('should display the matches list page', async ({ page }) => {
    await page.goto('/dashboard/matches');
  });

  test.fixme('should navigate to create match form', async ({ page }) => {
    await page.goto('/dashboard/matches/create');
  });

  test.fixme('should show match details', async ({ page }) => {
    // Navigate to a specific match detail page
  });
});
