import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminLoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#admin-email');
    this.passwordInput = page.locator('#admin-password');
    this.loginButton = page.locator('button[type="submit"], #login-btn');
    this.errorMessage = page.locator('#login-message');
    this.logo = page.locator('.logo, .admin-logo, img[alt*="logo"]');
  }

  async navigate() {
    await this.goto('admin/login.php');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
