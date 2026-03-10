import { test as base, expect } from '@playwright/test';
import {
  HomePage,
  LoginPage,
  RegisterPage,
  BookingPage,
  ProfilePage,
  AdminLoginPage,
  AdminDashboardPage,
} from '../pages';
import { ApiHelper } from '../utils/api-helper';
import { config } from '../utils/config';

/**
 * Extended test fixtures with page objects and helpers
 */
type TestFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  bookingPage: BookingPage;
  profilePage: ProfilePage;
  adminLoginPage: AdminLoginPage;
  adminDashboardPage: AdminDashboardPage;
  apiHelper: ApiHelper;
};

export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  bookingPage: async ({ page }, use) => {
    await use(new BookingPage(page));
  },

  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },

  adminLoginPage: async ({ page }, use) => {
    await use(new AdminLoginPage(page));
  },

  adminDashboardPage: async ({ page }, use) => {
    await use(new AdminDashboardPage(page));
  },

  apiHelper: async ({ request }, use) => {
    await use(new ApiHelper(request));
  },
});

export { expect };
