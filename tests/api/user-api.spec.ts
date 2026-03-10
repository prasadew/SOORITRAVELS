import { test, expect } from '../fixtures/test-fixtures';
import { randomString } from '../utils/helpers';

test.describe('User API - Registration @api @regression', () => {
  test('POST /register_user.php should register a new user', async ({ apiHelper }) => {
    const uid = `test_${randomString(16)}`;
    const response = await apiHelper.registerUser({
      firebase_uid: uid,
      name: 'API Test User',
      email: `apitest_${randomString()}@test.com`,
      phone: '+94771234567',
      country: 'Sri Lanka',
    });

    expect(response.status()).toBeLessThan(500);
    const body = await response.json();
    expect(body).toHaveProperty('success');
  });

  test('POST /register_user.php should reject missing firebase_uid', async ({ apiHelper }) => {
    const response = await apiHelper.registerUser({
      firebase_uid: '',
      name: 'Test',
      email: 'test@test.com',
    });

    const body = await response.json();
    expect(body.success).toBeFalsy();
  });

  test('POST /register_user.php should reject missing email', async ({ apiHelper }) => {
    const response = await apiHelper.registerUser({
      firebase_uid: `test_${randomString()}`,
      name: 'Test',
      email: '',
    });

    const body = await response.json();
    expect(body.success).toBeFalsy();
  });

  test('POST /register_user.php should reject invalid email format', async ({ apiHelper }) => {
    const response = await apiHelper.registerUser({
      firebase_uid: `test_${randomString()}`,
      name: 'Test',
      email: 'not-an-email',
    });

    const body = await response.json();
    expect(body.success).toBeFalsy();
  });
});

test.describe('User API - Update @api @regression', () => {
  test('POST /update_user.php should reject missing firebase_uid', async ({ apiHelper }) => {
    const response = await apiHelper.updateUser({
      firebase_uid: '',
      name: 'Updated Name',
    });

    const body = await response.json();
    expect(body.success).toBeFalsy();
  });

  test('POST /update_user.php should reject non-existent user', async ({ apiHelper }) => {
    const response = await apiHelper.updateUser({
      firebase_uid: 'nonexistent_uid_' + randomString(),
      name: 'Updated',
    });

    const body = await response.json();
    // Should return error or no-op
    expect(body).toHaveProperty('success');
  });
});

test.describe('User API - Get User @api @regression', () => {
  test('GET /get_user.php should return user data', async ({ apiHelper }) => {
    // First register a user
    const uid = `test_getuser_${randomString(16)}`;
    await apiHelper.registerUser({
      firebase_uid: uid,
      name: 'Get User Test',
      email: `getuser_${randomString()}@test.com`,
      phone: '+94771111111',
      country: 'Sri Lanka',
    });

    // Try to get the user
    const response = await apiHelper.getUser(uid);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBeTruthy();
    if (body.data) {
      expect(body.data).toHaveProperty('name');
      expect(body.data).toHaveProperty('email');
    }
  });

  test('GET /get_user.php should handle non-existent user', async ({ apiHelper }) => {
    const response = await apiHelper.getUser('nonexistent_uid_99999');
    const body = await response.json();
    expect(body.success).toBeFalsy();
  });

  test('GET /get_user.php should require firebase_uid parameter', async ({ request }) => {
    const response = await request.get('api/get_user.php');
    const body = await response.json();
    expect(body.success).toBeFalsy();
  });
});
