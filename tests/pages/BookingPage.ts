import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class BookingPage extends BasePage {
  readonly heroImage: Locator;
  readonly bookingForm: Locator;
  readonly packageTitle: Locator;
  readonly packagePrice: Locator;
  readonly packageDuration: Locator;
  readonly travelDateInput: Locator;
  readonly numberOfPeopleInput: Locator;
  readonly vehicleSelect: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly trustBadges: Locator;

  constructor(page: Page) {
    super(page);
    this.heroImage = page.locator('.booking-hero, .hero-image, .booking-image');
    this.bookingForm = page.locator('#booking-form, .booking-form, form');
    this.packageTitle = page.locator('#package-title, .package-title, .package-name');
    this.packagePrice = page.locator('#package-price, .package-price, .price');
    this.packageDuration = page.locator('#package-duration, .package-duration, .duration');
    this.travelDateInput = page.locator('#travel-date, input[name="travel_date"], input[type="date"]');
    this.numberOfPeopleInput = page.locator('#number-of-people, input[name="number_of_people"], #num-people');
    this.vehicleSelect = page.locator('#vehicle-select, select[name="vehicle_id"], #vehicle');
    this.submitButton = page.locator('button[type="submit"], #book-now-btn, .book-btn');
    this.errorMessage = page.locator('.error-message, .error, #error-message, .alert-danger');
    this.successMessage = page.locator('.success-message, .success, #success-message, .alert-success');
    this.trustBadges = page.locator('.trust-badges, .badges');
  }

  async navigate(packageId: number = 1) {
    await this.goto(`booking.php?package_id=${packageId}`);
  }

  async fillBookingForm(data: {
    travelDate: string;
    numberOfPeople: number;
    vehicleIndex?: number;
  }) {
    await this.travelDateInput.fill(data.travelDate);
    // Trigger change event to load vehicles
    await this.travelDateInput.dispatchEvent('change');
    // Wait for vehicles to load
    await this.page.waitForTimeout(1000);

    if (data.vehicleIndex !== undefined) {
      const options = await this.vehicleSelect.locator('option').all();
      if (options.length > data.vehicleIndex + 1) {
        await this.vehicleSelect.selectOption({ index: data.vehicleIndex + 1 });
      }
    }

    await this.numberOfPeopleInput.fill(data.numberOfPeople.toString());
  }

  async submitBooking() {
    await this.submitButton.click();
  }

  async getVehicleOptions(): Promise<string[]> {
    const options = await this.vehicleSelect.locator('option').allTextContents();
    return options.filter(opt => opt.trim() !== '' && !opt.includes('Select'));
  }

  async isBookingFormVisible(): Promise<boolean> {
    return this.bookingForm.isVisible();
  }

  async getErrorText(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return this.errorMessage.textContent() as Promise<string>;
  }
}
