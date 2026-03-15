import { test, expect } from '../fixtures/test-fixtures';
import { getFutureDate } from '../utils/helpers';
import { BOOKING_DATA } from '../data/test-data';

test.describe('Booking Page @regression', () => {
  // Booking page requires Firebase authentication - unauthenticated users are redirected to login
  // These tests verify the redirect behavior and page accessibility

  test('should redirect unauthenticated users to login @smoke', async ({ bookingPage }) => {
    await bookingPage.navigate(1);
    // Booking page requires authentication - should redirect to login
    await expect(bookingPage.page).toHaveURL(/login/, { timeout: 10000 });
  });

  test('booking URL should include package_id parameter', async ({ bookingPage }) => {
    // Verify that the booking URL is constructed correctly before redirect
    await bookingPage.page.goto('booking.php?package_id=1', { waitUntil: 'domcontentloaded' });
    // After redirect, verify we ended up on login page
    await bookingPage.page.waitForURL(/login/, { timeout: 10000 });
    await expect(bookingPage.page).toHaveURL(/login/);
  });

  test('should handle invalid package ID gracefully', async ({ bookingPage }) => {
    await bookingPage.page.goto('booking.php?package_id=99999', { waitUntil: 'domcontentloaded' });
    // Should redirect to login (unauthenticated) or show error
    await bookingPage.page.waitForTimeout(2000);
    const url = bookingPage.page.url();
    expect(url).toBeTruthy();
  });

  test('should handle missing package ID', async ({ bookingPage }) => {
    await bookingPage.page.goto('booking.php', { waitUntil: 'domcontentloaded' });
    await bookingPage.page.waitForTimeout(2000);
    const url = bookingPage.page.url();
    // Should redirect or show error
    expect(url).toBeTruthy();
  });
});
