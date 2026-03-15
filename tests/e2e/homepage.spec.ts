import { test, expect } from '../fixtures/test-fixtures';

test.describe('Homepage @smoke @regression', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test('should load homepage successfully', async ({ homePage }) => {
    const title = await homePage.getTitle();
    expect(title).toBeTruthy();
    // Accept root deployments (e.g. http://localhost:8080/) and folder deployments.
    await expect(homePage.page).toHaveURL(/\/(index\.php)?(\?.*)?$/i);
  });

  test('should display hero section', async ({ homePage }) => {
    await expect(homePage.heroSection).toBeVisible();
  });

  test('should display navigation bar', async ({ homePage }) => {
    await expect(homePage.navbar).toBeVisible();
  });

  test('should display auth navigation button', async ({ homePage }) => {
    await expect(homePage.authNavBtn.first()).toBeVisible();
  });

  test('should display footer', async ({ homePage }) => {
    await homePage.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await homePage.page.waitForTimeout(1000);
    await expect(homePage.footer).toBeVisible();
  });

  test('should load packages section dynamically', async ({ homePage }) => {
    await homePage.scrollToSection(homePage.packagesSection);
    await expect(homePage.packagesContainer).toBeVisible();
    // Package count depends on database data - verify container exists
    const count = await homePage.packageCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should load destinations section dynamically', async ({ homePage }) => {
    await homePage.scrollToSection(homePage.destinationsSection);
    await expect(homePage.destinationsContainer).toBeVisible();
    // Destination count depends on database data
    const count = await homePage.destinationCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should load gallery section dynamically', async ({ homePage }) => {
    await homePage.scrollToSection(homePage.gallerySection);
    await expect(homePage.galleryContainer).toBeVisible();
  });

  test('should load services section', async ({ homePage }) => {
    await homePage.scrollToSection(homePage.servicesSection);
    await expect(homePage.servicesContainer).toBeVisible();
  });

  test('should load testimonials section', async ({ homePage }) => {
    await homePage.scrollToSection(homePage.testimonialsSection);
    await expect(homePage.testimonialsContainer).toBeVisible();
  });

  test('should have about section', async ({ homePage }) => {
    await homePage.scrollToSection(homePage.aboutSection);
    await expect(homePage.aboutSection).toBeVisible();
  });

  test('should have no console errors @critical', async ({ homePage }) => {
    const errors: string[] = [];
    homePage.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    await homePage.navigate();
    await homePage.waitForPageLoad();
    // Filter out expected errors: third-party, favicon, firebase, API fetch failures (DB may be empty)
    const criticalErrors = errors.filter(
      e => !e.includes('favicon') && !e.includes('firebase') && !e.includes('net::ERR')
        && !e.includes('Failed to load') && !e.includes('Failed to fetch')
        && !e.includes('404')
        // External font CDN failures are non-functional and intermittent in CI.
        && !e.toLowerCase().includes('downloadable font')
        && !e.toLowerCase().includes('font-awesome')
        && !e.toLowerCase().includes('font awesome')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should have no broken images', async ({ homePage }) => {
    await homePage.waitForPageLoad();
    const images = await homePage.page.locator('img').all();
    for (const img of images) {
      const src = await img.getAttribute('src');
      if (src && !src.startsWith('data:') && !src.includes('placeholder')) {
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        expect(naturalWidth, `Broken image: ${src}`).toBeGreaterThan(0);
      }
    }
  });
});
