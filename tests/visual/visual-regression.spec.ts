import { test, expect } from '../fixtures/test-fixtures';
import { ADMIN_CREDENTIALS } from '../data/test-data';

test.describe('Visual Regression - Homepage @visual @regression', () => {
  test('homepage hero section', async ({ homePage }) => {
    await homePage.navigate();
    await homePage.waitForPageLoad();
    await expect(homePage.heroSection).toHaveScreenshot('homepage-hero.png');
  });

  test('homepage packages section', async ({ homePage }) => {
    await homePage.navigate();
    await homePage.waitForPageLoad();
    await homePage.scrollToSection(homePage.packagesSection);
    await homePage.page.waitForTimeout(1000); // Wait for AOS animations
    await expect(homePage.packagesSection).toHaveScreenshot('homepage-packages.png');
  });

  test('homepage footer', async ({ homePage }) => {
    await homePage.navigate();
    await homePage.scrollToElement(homePage.footer);
    await expect(homePage.footer).toHaveScreenshot('homepage-footer.png');
  });

  test('full homepage snapshot', async ({ homePage }) => {
    await homePage.navigate();
    await homePage.waitForPageLoad();
    await expect(homePage.page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });
});

test.describe('Visual Regression - Login Page @visual @regression', () => {
  test('login page layout', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.waitForPageLoad();
    await expect(loginPage.page).toHaveScreenshot('login-page.png');
  });
});

test.describe('Visual Regression - Registration Page @visual @regression', () => {
  test('registration page layout', async ({ registerPage }) => {
    await registerPage.navigate();
    await registerPage.waitForPageLoad();
    await expect(registerPage.page).toHaveScreenshot('register-page.png');
  });
});

test.describe('Visual Regression - Booking Page @visual @regression', () => {
  test('booking page layout', async ({ bookingPage }) => {
    await bookingPage.navigate(1);
    await bookingPage.waitForPageLoad();
    await expect(bookingPage.page).toHaveScreenshot('booking-page.png');
  });
});

test.describe('Visual Regression - Admin Login @visual @regression', () => {
  test('admin login page layout', async ({ adminLoginPage }) => {
    await adminLoginPage.navigate();
    await adminLoginPage.waitForPageLoad();
    await expect(adminLoginPage.page).toHaveScreenshot('admin-login-page.png');
  });
});

test.describe('Visual Regression - Admin Dashboard @visual @regression', () => {
  test('admin dashboard layout', async ({ adminLoginPage, page }) => {
    await adminLoginPage.navigate();
    await adminLoginPage.login(
      ADMIN_CREDENTIALS.valid.email,
      ADMIN_CREDENTIALS.valid.password,
    );
    await page.waitForURL(/dashboard/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('admin-dashboard.png', {
      maxDiffPixelRatio: 0.1,
    });
  });
});

test.describe('Visual Regression - Developers Page @visual @regression', () => {
  test('developers page layout', async ({ page }) => {
    await page.goto('developers.html');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('developers-page.png');
  });
});
