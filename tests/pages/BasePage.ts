import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Base page object with shared functionality
 */
export class BasePage {
  readonly page: Page;
  readonly navbar: Locator;
  readonly authNavBtn: Locator;
  readonly hamburgerMenu: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navbar = page.locator('nav.navbar');
    this.authNavBtn = page.locator('#auth-nav-btn, .auth-btn, [href*="login"], [href*="profile"]');
    this.hamburgerMenu = page.locator('#menu-btn, .hamburger, .menu-toggle');
    this.footer = page.locator('section.footer');
  }

  async goto(path: string = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async scrollToElement(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }
}
