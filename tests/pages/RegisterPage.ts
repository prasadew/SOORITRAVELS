import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly countrySelect: Locator;
  readonly phoneInput: Locator;
  readonly registerButton: Locator;
  readonly loginLink: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.locator('#name, input[name="name"], #full-name');
    this.emailInput = page.locator('#email, input[name="email"], input[type="email"]');
    this.passwordInput = page.locator('#password, input[name="password"], input[type="password"]');
    this.countrySelect = page.locator('#countrycmb, select[name="country"]');
    this.phoneInput = page.locator('#contact_no, input[type="tel"]');
    this.registerButton = page.locator('button[type="submit"], #register-btn, .register-btn');
    this.loginLink = page.locator('a[href*="login"], .login-link');
    this.errorMessage = page.locator('.error-message, .error, #error-message, .alert-danger');
    this.successMessage = page.locator('.success-message, .success, #success-message, .alert-success');
  }

  async navigate() {
    await this.goto('register_new.php');
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    country: string;
    phone: string;
  }) {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    if (await this.countrySelect.isVisible()) {
      await this.countrySelect.selectOption({ label: data.country });
    }
    await this.phoneInput.fill(data.phone);
    await this.registerButton.click();
  }

  async isRegistrationFormVisible(): Promise<boolean> {
    return await this.nameInput.isVisible() && this.emailInput.isVisible();
  }

  async getErrorText(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return this.errorMessage.textContent() as Promise<string>;
  }

  async clickLoginLink() {
    await this.loginLink.click();
  }
}
