import { test, expect } from '../fixtures/test-fixtures';

test.describe('Profile Page @regression', () => {
  // Profile page requires Firebase authentication - unauthenticated users are redirected to login

  test('should redirect unauthenticated users to login @smoke', async ({ profilePage }) => {
    await profilePage.navigate();
    // Profile page requires authentication — should redirect to login
    await expect(profilePage.page).toHaveURL(/login/, { timeout: 10000 });
  });

  test('login page should be functional after redirect', async ({ profilePage }) => {
    await profilePage.navigate();
    await profilePage.page.waitForURL(/login/, { timeout: 10000 });
    // Verify login form is displayed after redirect
    const emailInput = profilePage.page.locator('#email, input[type="email"]');
    await expect(emailInput).toBeVisible();
  });
});
