import { test, expect } from '../fixtures/test-fixtures';
import { API_ENDPOINTS } from '../data/test-data';

test.describe('API Response Format Validation @api @regression', () => {
  const publicEndpoints = [
    { name: 'packages', url: 'api/get_packages.php' },
    { name: 'destinations', url: 'api/get_destinations.php' },
    { name: 'services', url: 'api/get_services.php' },
    { name: 'gallery', url: 'api/get_gallery.php' },
    { name: 'vehicles', url: 'api/get_vehicles.php' },
    { name: 'testimonials', url: 'api/get_testimonials.php' },
  ];

  for (const endpoint of publicEndpoints) {
    test(`${endpoint.name} API should return valid JSON`, async ({ request }) => {
      const response = await request.get(endpoint.url);
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('json');

      const body = await response.json();
      expect(body).toBeDefined();
      expect(typeof body).toBe('object');
    });

    test(`${endpoint.name} API should have correct response structure`, async ({ request }) => {
      const response = await request.get(endpoint.url);
      const body = await response.json();

      expect(body).toHaveProperty('success');
      expect(typeof body.success).toBe('boolean');
      if (body.success) {
        expect(body).toHaveProperty('data');
      }
    });

    test(`${endpoint.name} API should return correct HTTP status`, async ({ request }) => {
      const response = await request.get(endpoint.url);
      expect(response.status()).toBe(200);
    });
  }
});

test.describe('API Error Handling @api @regression', () => {
  test('should handle malformed JSON in POST body', async ({ request }) => {
    const response = await request.post('api/register_user.php', {
      headers: { 'Content-Type': 'application/json' },
      data: 'not valid json{{{',
    });
    expect(response.status()).toBeLessThan(500);
  });

  test('should handle empty POST body', async ({ request }) => {
    const response = await request.post('api/register_user.php', {
      data: {},
    });
    const body = await response.json();
    expect(body.success).toBeFalsy();
  });

  test('should handle very large input values', async ({ request }) => {
    const longString = 'A'.repeat(10000);
    const response = await request.post('api/register_user.php', {
      data: {
        firebase_uid: longString,
        name: longString,
        email: `${longString}@test.com`,
      },
    });
    expect(response.status()).toBeLessThan(500);
  });

  test('should handle special characters in query params', async ({ request }) => {
    const response = await request.get('api/get_gallery.php?category=<script>alert(1)</script>');
    expect(response.status()).toBeLessThan(500);
  });

  test('should handle non-existent API endpoints', async ({ request }) => {
    const response = await request.get('api/nonexistent_endpoint.php');
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

test.describe('API Content-Type Validation @api @regression', () => {
  test('all API responses should be JSON', async ({ request }) => {
    const endpoints = [
      'api/get_packages.php',
      'api/get_destinations.php',
      'api/get_services.php',
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      const contentType = response.headers()['content-type'];
      expect(contentType, `${endpoint} should return JSON`).toContain('json');
    }
  });
});
