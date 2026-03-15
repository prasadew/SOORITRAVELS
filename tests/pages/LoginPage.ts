import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly passwordToggle: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#email, input[name="email"], input[type="email"]');
    this.passwordInput = page.locator('#password, input[name="password"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"], #login-btn, .login-btn');
    this.registerLink = page.locator('a[href*="register"], .register-link');
    this.forgotPasswordLink = page.locator('a[href*="forgot"], .forgot-password, #forgot-password');
    this.errorMessage = page.locator('.error-message, .error, #error-message, .alert-danger');
    this.successMessage = page.locator('.success-message, .success, #success-message, .alert-success');
    this.passwordToggle = page.locator('.toggle-password, .password-toggle, #toggle-password');
  }

  async navigate() {
    await this.goto('login_new.php');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorText(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return this.errorMessage.textContent() as Promise<string>;
  }

  async isLoginFormVisible(): Promise<boolean> {
    return await this.emailInput.isVisible() && this.passwordInput.isVisible();
  }

  async clickRegisterLink() {
    await this.registerLink.click();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }
}
