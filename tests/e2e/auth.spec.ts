import { test, expect } from '../fixtures/test-fixtures';
import { TEST_USERS, ADMIN_CREDENTIALS } from '../data/test-data';

test.describe('User Login @smoke @regression', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('should display login form correctly', async ({ loginPage }) => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should show error for empty email', async ({ loginPage }) => {
    await loginPage.login('', 'password123');
    // HTML5 validation or custom error
    const isInvalid = await loginPage.emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    );
    expect(isInvalid).toBeTruthy();
  });

  test('should show error for invalid email format', async ({ loginPage }) => {
    await loginPage.login('notanemail', 'password123');
    const isInvalid = await loginPage.emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    );
    expect(isInvalid).toBeTruthy();
  });

  test('should show error for empty password', async ({ loginPage }) => {
    await loginPage.login('test@test.com', '');
    const isInvalid = await loginPage.passwordInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    );
    expect(isInvalid).toBeTruthy();
  });

  test('should have link to registration page', async ({ loginPage }) => {
    await expect(loginPage.registerLink.first()).toBeVisible();
    await loginPage.clickRegisterLink();
    await expect(loginPage.page).toHaveURL(/register/);
  });

  test('should have password field masked by default', async ({ loginPage }) => {
    const type = await loginPage.passwordInput.getAttribute('type');
    expect(type).toBe('password');
  });

  test('email input should have correct type', async ({ loginPage }) => {
    const type = await loginPage.emailInput.getAttribute('type');
    expect(type).toBe('email');
  });
});

test.describe('User Registration @regression', () => {
  test.beforeEach(async ({ registerPage }) => {
    await registerPage.navigate();
  });

  test('should display registration form correctly', async ({ registerPage }) => {
    await expect(registerPage.nameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.phoneInput).toBeVisible();
    await expect(registerPage.registerButton).toBeVisible();
  });

  test('should validate required fields @critical', async ({ registerPage }) => {
    await registerPage.registerButton.click();

    // Check HTML5 validation
    const nameInvalid = await registerPage.nameInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    );
    expect(nameInvalid).toBeTruthy();
  });

  test('should validate email format', async ({ registerPage }) => {
    await registerPage.emailInput.fill('invalid-email');
    await registerPage.registerButton.click();
    const isInvalid = await registerPage.emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    );
    expect(isInvalid).toBeTruthy();
  });

  test('should have country selector with options', async ({ registerPage }) => {
    if (await registerPage.countrySelect.isVisible()) {
      const options = await registerPage.countrySelect.locator('option').count();
      expect(options).toBeGreaterThan(1);
    }
  });

  test('should have link to login page', async ({ registerPage }) => {
    await expect(registerPage.loginLink.first()).toBeVisible();
    await registerPage.clickLoginLink();
    await expect(registerPage.page).toHaveURL(/login/);
  });

  test('password should be masked', async ({ registerPage }) => {
    const type = await registerPage.passwordInput.getAttribute('type');
    expect(type).toBe('password');
  });
});

test.describe('Admin Login @smoke @regression', () => {
  test.beforeEach(async ({ adminLoginPage }) => {
    await adminLoginPage.navigate();
  });

  test('should display admin login form', async ({ adminLoginPage }) => {
    await expect(adminLoginPage.emailInput).toBeVisible();
    await expect(adminLoginPage.passwordInput).toBeVisible();
    await expect(adminLoginPage.loginButton).toBeVisible();
  });

  test('should login with valid admin credentials @critical', async ({ adminLoginPage }) => {
    await adminLoginPage.login(
      ADMIN_CREDENTIALS.valid.email,
      ADMIN_CREDENTIALS.valid.password,
    );
    await adminLoginPage.page.waitForURL(/dashboard/, { timeout: 10000 });
    await expect(adminLoginPage.page).toHaveURL(/dashboard/);
  });

  test('should show error for invalid admin credentials', async ({ adminLoginPage }) => {
    await adminLoginPage.login(
      ADMIN_CREDENTIALS.invalid.wrongPassword.email,
      ADMIN_CREDENTIALS.invalid.wrongPassword.password,
    );
    // Wait for the API response and #login-message to become visible with error text
    await expect(adminLoginPage.errorMessage).toBeVisible({ timeout: 10000 });
    const text = await adminLoginPage.errorMessage.textContent();
    expect(text).toBeTruthy();
  });

  test('should show error for empty fields', async ({ adminLoginPage }) => {
    await adminLoginPage.loginButton.click();
    const isInvalid = await adminLoginPage.emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    );
    expect(isInvalid).toBeTruthy();
  });
});
