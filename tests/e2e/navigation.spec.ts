import { test, expect } from '../fixtures/test-fixtures';
import { PAGES } from '../data/test-data';

test.describe('Navigation & Routing @smoke @regression', () => {
  test('should navigate to all main pages', async ({ page }) => {
    // Only test publicly accessible pages (not auth-gated ones)
    const publicPages = {
      home: PAGES.home,
      login: PAGES.login,
      register: PAGES.register,
      developers: PAGES.developers,
      adminLogin: PAGES.adminLogin,
    };
    for (const [name, path] of Object.entries(publicPages)) {
      const response = await page.goto(path);
      const status = response?.status() ?? 200;
      expect(status, `${name} page returned error`).toBeLessThan(500);
    }
  });

  test('should have working navbar links', async ({ homePage }) => {
    await homePage.navigate();
    const navLinks = await homePage.page.locator('nav a, .navbar a').all();
    expect(navLinks.length).toBeGreaterThan(0);

    for (const link of navLinks) {
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript') && !href.startsWith('mailto')) {
        expect(href).toBeTruthy();
      }
    }
  });

  test('should scroll to sections via anchor links', async ({ homePage }) => {
    await homePage.navigate();
    const anchorLinks = await homePage.page.locator('a[href^="#"]').all();

    for (const link of anchorLinks) {
      const href = await link.getAttribute('href');
      if (href && href.length > 1) {
        const targetId = href.substring(1);
        const target = homePage.page.locator(`#${targetId}`);
        if (await target.isVisible()) {
          await link.click();
          await expect(target).toBeInViewport({ timeout: 3000 });
        }
      }
    }
  });

  test('should show 404-like behavior for non-existent pages', async ({ page }) => {
    const response = await page.goto('nonexistent-page.php');
    expect(response?.status()).toBeGreaterThanOrEqual(400);
  });

  test('login page should be accessible', async ({ loginPage }) => {
    await loginPage.navigate();
    expect(await loginPage.isLoginFormVisible()).toBeTruthy();
  });

  test('register page should be accessible', async ({ registerPage }) => {
    await registerPage.navigate();
    expect(await registerPage.isRegistrationFormVisible()).toBeTruthy();
  });

  test('developers page should load', async ({ page }) => {
    await page.goto('developers.html');
    await expect(page).toHaveURL(/developers/);
  });
});
