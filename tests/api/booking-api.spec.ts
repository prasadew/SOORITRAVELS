import { test, expect } from '../fixtures/test-fixtures';
import { getFutureDate, randomString } from '../utils/helpers';

test.describe('Booking API @api @critical @regression', () => {
  let testUserId: string;

  test.beforeAll(async ({ request }) => {
    // Create a test user for booking tests
    testUserId = `booking_test_${randomString(16)}`;
    await request.post('api/register_user.php', {
      data: {
        firebase_uid: testUserId,
        name: 'Booking Test User',
        email: `booking_${randomString()}@test.com`,
        phone: '+94771234567',
        country: 'Sri Lanka',
      },
    });
  });

  test('POST /create_booking.php should reject missing fields', async ({ apiHelper }) => {
    const response = await apiHelper.createBooking({
      firebase_uid: '',
      package_id: 1,
      vehicle_id: 1,
      travel_date: getFutureDate(14),
      number_of_people: 2,
    });

    const body = await response.json();
    expect(body.success).toBeFalsy();
  });

  test('POST /create_booking.php should reject past travel date', async ({ apiHelper }) => {
    const response = await apiHelper.createBooking({
      firebase_uid: testUserId,
      package_id: 1,
      vehicle_id: 1,
      travel_date: '2020-01-01',
      number_of_people: 2,
    });

    const body = await response.json();
    expect(body.success).toBeFalsy();
  });

  test('POST /create_booking.php should reject invalid number of people', async ({ apiHelper }) => {
    const response = await apiHelper.createBooking({
      firebase_uid: testUserId,
      package_id: 1,
      vehicle_id: 1,
      travel_date: getFutureDate(14),
      number_of_people: 0,
    });

    const body = await response.json();
    expect(body.success).toBeFalsy();
  });

  test('POST /create_booking.php should reject non-existent package', async ({ apiHelper }) => {
    const response = await apiHelper.createBooking({
      firebase_uid: testUserId,
      package_id: 99999,
      vehicle_id: 1,
      travel_date: getFutureDate(14),
      number_of_people: 2,
    });

    const body = await response.json();
    expect(body.success).toBeFalsy();
  });

  test('POST /create_booking.php should reject non-existent vehicle', async ({ apiHelper }) => {
    const response = await apiHelper.createBooking({
      firebase_uid: testUserId,
      package_id: 1,
      vehicle_id: 99999,
      travel_date: getFutureDate(14),
      number_of_people: 2,
    });

    const body = await response.json();
    expect(body.success).toBeFalsy();
  });

  test('POST /create_booking.php should reject exceeding seat capacity', async ({ apiHelper }) => {
    const response = await apiHelper.createBooking({
      firebase_uid: testUserId,
      package_id: 1,
      vehicle_id: 1,
      travel_date: getFutureDate(14),
      number_of_people: 999,
    });

    const body = await response.json();
    expect(body.success).toBeFalsy();
  });

  test('POST /create_booking.php should handle invalid date format', async ({ apiHelper }) => {
    const response = await apiHelper.createBooking({
      firebase_uid: testUserId,
      package_id: 1,
      vehicle_id: 1,
      travel_date: 'invalid-date',
      number_of_people: 2,
    });

    const body = await response.json();
    expect(body.success).toBeFalsy();
  });

  test('should handle GET method on POST-only endpoint', async ({ request }) => {
    const response = await request.get('api/create_booking.php');
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});
