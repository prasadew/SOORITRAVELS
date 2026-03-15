/**
 * Helper utilities for test automation
 */

/** Generate a future date string in YYYY-MM-DD format */
export function getFutureDate(daysFromNow: number = 7): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

/** Generate a unique email for test isolation */
export function generateTestEmail(prefix: string = 'test'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}@sooritravels.com`;
}

/** Generate a random string */
export function randomString(length: number = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/** Generate a random phone number */
export function randomPhone(): string {
  const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
  return `+9477${digits.substring(0, 7)}`;
}

/** Wait helper for explicit timing needs */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Parse JSON response safely */
export function safeJsonParse(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Format date for display comparison */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Generate test data for bookings */
export function generateBookingData(overrides: Record<string, any> = {}) {
  return {
    travel_date: getFutureDate(14),
    number_of_people: 2,
    ...overrides,
  };
}
