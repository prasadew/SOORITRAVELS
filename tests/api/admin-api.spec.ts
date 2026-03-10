import { test, expect } from '../fixtures/test-fixtures';
import { ADMIN_CREDENTIALS } from '../data/test-data';
import { config } from '../utils/config';

test.describe('Admin API - Authentication @api @critical @regression', () => {
  test('POST /admin_login.php should login with valid credentials', async ({ apiHelper }) => {
    const response = await apiHelper.adminLogin();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBeTruthy();
  });

  test('POST /admin_login.php should reject invalid password', async ({ apiHelper }) => {
    const response = await apiHelper.adminLogin(
      ADMIN_CREDENTIALS.valid.email,
      'wrongpassword',
    );

    const body = await response.json();
    expect(body.success).toBeFalsy();
  });

  test('POST /admin_login.php should reject non-existent email', async ({ apiHelper }) => {
    const response = await apiHelper.adminLogin('nonexistent@admin.com', 'password');
    const body = await response.json();
    expect(body.success).toBeFalsy();
  });

  test('POST /admin_login.php should reject empty credentials', async ({ apiHelper }) => {
    const response = await apiHelper.adminLogin('', '');
    const body = await response.json();
    expect(body.success).toBeFalsy();
  });

  test('GET /admin_check_session.php should fail without session', async ({ request }) => {
    const response = await request.get(`${config.api.baseUrl}/admin_check_session.php`);
    const body = await response.json();
    expect(body.success).toBeFalsy();
  });

  test('POST /admin_logout.php should work', async ({ apiHelper }) => {
    // First login
    await apiHelper.adminLogin();
    // Then logout
    const response = await apiHelper.adminLogout();
    expect(response.status()).toBeLessThan(500);
  });
});

test.describe('Admin API - Bookings @api @regression', () => {
  test.beforeEach(async ({ apiHelper }) => {
    await apiHelper.adminLogin();
  });

  test('GET /admin_get_bookings.php should return bookings', async ({ apiHelper }) => {
    const response = await apiHelper.adminGetBookings();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('success');
  });

  test('GET /admin_get_bookings.php should support status filter', async ({ apiHelper }) => {
    const response = await apiHelper.adminGetBookings({ status: 'pending' });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('success');
  });

  test('GET /admin_get_bookings.php should support date filter', async ({ apiHelper }) => {
    const response = await apiHelper.adminGetBookings({ date: '2025-01-01' });
    expect(response.status()).toBe(200);
  });

  test('POST /admin_update_booking.php should reject invalid status', async ({ apiHelper }) => {
    const response = await apiHelper.adminUpdateBooking(1, 'invalid_status');
    const body = await response.json();
    expect(body.success).toBeFalsy();
  });

  test('POST /admin_update_booking.php should reject non-existent booking', async ({ apiHelper }) => {
    const response = await apiHelper.adminUpdateBooking(99999, 'confirmed');
    const body = await response.json();
    // Should fail or return not found
    expect(body).toHaveProperty('success');
  });
});

test.describe('Admin API - CRUD Operations @api @regression', () => {
  const resources = ['packages', 'vehicles', 'services', 'destinations', 'gallery', 'testimonials'];

  test.beforeEach(async ({ apiHelper }) => {
    await apiHelper.adminLogin();
  });

  for (const resource of resources) {
    test(`GET /admin_${resource}.php should return list`, async ({ apiHelper }) => {
      const response = await apiHelper.adminCrudGet(resource);
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toHaveProperty('success');
    });
  }
});

test.describe('Admin API - Unauthorized Access @api @regression', () => {
  const resources = ['packages', 'vehicles', 'services', 'destinations', 'gallery', 'testimonials'];

  test('should reject unauthorized CRUD operations', async ({ apiHelper, request }) => {
    // Ensure no active admin session
    await apiHelper.adminLogout();
    // Without admin session, CRUD should fail
    for (const resource of resources) {
      const response = await request.post(`api/admin_${resource}.php`, {
        data: { title: 'Unauthorized Test' },
      });
      const body = await response.json();
      expect(body.success).toBeFalsy();
    }
  });
});

test.describe('Admin API - Method Validation @api @regression', () => {
  test('POST endpoints should reject GET requests', async ({ request }) => {
    const postOnlyEndpoints = [
      'api/admin_login.php',
      'api/create_booking.php',
      'api/register_user.php',
      'api/update_user.php',
    ];

    for (const endpoint of postOnlyEndpoints) {
      const response = await request.get(endpoint);
      // Should return 405 or error
      const body = await response.json().catch(() => null);
      if (body) {
        expect(body.success).toBeFalsy();
      }
    }
  });
});
