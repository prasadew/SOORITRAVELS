import { test, expect } from '../fixtures/test-fixtures';

test.describe('Mobile Responsive Tests @mobile @regression', () => {
  test('homepage should be responsive', async ({ homePage }) => {
    await homePage.navigate();
    await expect(homePage.heroSection).toBeVisible();
    await expect(homePage.navbar).toBeVisible();
  });

  test('should display hamburger menu on mobile', async ({ homePage }) => {
    await homePage.navigate();
    // On mobile viewport, hamburger should be visible
    const hamburger = homePage.page.locator('.hamburger, .menu-toggle, .navbar-toggler, .mobile-menu-btn');
    const hamburgerCount = await hamburger.count();
    if (hamburgerCount > 0) {
      await expect(hamburger.first()).toBeVisible();
    }
  });

  test('login form should be usable on mobile', async ({ loginPage }) => {
    await loginPage.navigate();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    // Verify inputs are not cut off
    const emailBox = await loginPage.emailInput.boundingBox();
    const viewportSize = loginPage.page.viewportSize();
    if (emailBox && viewportSize) {
      expect(emailBox.width).toBeLessThanOrEqual(viewportSize.width);
    }
  });

  test('registration form should be usable on mobile', async ({ registerPage }) => {
    await registerPage.navigate();
    await expect(registerPage.nameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.registerButton).toBeVisible();
  });

  test('booking page should be responsive', async ({ bookingPage }) => {
    // Booking page requires Firebase auth and redirects to login
    await bookingPage.navigate(1);
    // Verify redirect happens on mobile too
    await expect(bookingPage.page).toHaveURL(/login/, { timeout: 10000 });
  });

  test('footer should be visible on mobile', async ({ homePage }) => {
    await homePage.navigate();
    await homePage.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await homePage.page.waitForTimeout(1000);
    await expect(homePage.footer).toBeVisible();
  });

  test('no horizontal scroll on mobile', async ({ homePage }) => {
    await homePage.navigate();
    const scrollWidth = await homePage.page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await homePage.page.evaluate(() => document.documentElement.clientWidth);
    // Allow small tolerance (2px)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });
});
