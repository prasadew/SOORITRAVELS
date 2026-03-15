import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  // Tabs
  readonly basicInfoTab: Locator;
  readonly securityTab: Locator;
  readonly bookingsTab: Locator;
  readonly settingsTab: Locator;

  // Basic Info
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly countryInput: Locator;
  readonly editProfileBtn: Locator;
  readonly saveProfileBtn: Locator;

  // Security
  readonly resetPasswordBtn: Locator;

  // Bookings
  readonly bookingsTable: Locator;
  readonly bookingRows: Locator;

  // Settings
  readonly deleteAccountBtn: Locator;

  // Messages
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  // Member Badge
  readonly memberBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.basicInfoTab = page.locator('[data-tab="basic-info"], .tab-basic, #basic-info-tab');
    this.securityTab = page.locator('[data-tab="security"], .tab-security, #security-tab');
    this.bookingsTab = page.locator('[data-tab="bookings"], .tab-bookings, #bookings-tab');
    this.settingsTab = page.locator('[data-tab="settings"], .tab-settings, #settings-tab');
    this.nameInput = page.locator('#profile-name, input[name="name"]');
    this.emailInput = page.locator('#profile-email, input[name="email"]');
    this.phoneInput = page.locator('#profile-phone, input[name="phone"]');
    this.countryInput = page.locator('#profile-country, input[name="country"], select[name="country"]');
    this.editProfileBtn = page.locator('#edit-profile-btn, .edit-btn');
    this.saveProfileBtn = page.locator('#save-profile-btn, .save-btn');
    this.resetPasswordBtn = page.locator('#reset-password-btn, .reset-password');
    this.bookingsTable = page.locator('.bookings-table, #bookings-table, table');
    this.bookingRows = page.locator('.bookings-table tbody tr, #bookings-table tbody tr');
    this.deleteAccountBtn = page.locator('#delete-account-btn, .delete-account');
    this.errorMessage = page.locator('.error-message, .error, .alert-danger');
    this.successMessage = page.locator('.success-message, .success, .alert-success');
    this.memberBadge = page.locator('.member-badge, .badge');
  }

  async navigate() {
    await this.goto('profile_new.php');
  }

  async switchToTab(tab: 'basic-info' | 'security' | 'bookings' | 'settings') {
    const tabMap = {
      'basic-info': this.basicInfoTab,
      'security': this.securityTab,
      'bookings': this.bookingsTab,
      'settings': this.settingsTab,
    };
    await tabMap[tab].click();
  }

  async getBookingCount(): Promise<number> {
    return this.bookingRows.count();
  }

  async editProfile(data: { name?: string; phone?: string }) {
    await this.editProfileBtn.click();
    if (data.name) {
      await this.nameInput.clear();
      await this.nameInput.fill(data.name);
    }
    if (data.phone) {
      await this.phoneInput.clear();
      await this.phoneInput.fill(data.phone);
    }
    await this.saveProfileBtn.click();
  }
}
