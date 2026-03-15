import { test, expect } from '../fixtures/test-fixtures';
import { API_ENDPOINTS } from '../data/test-data';

test.describe('Public API - Packages @api @smoke @regression', () => {
  test('GET /get_packages.php should return all packages', async ({ apiHelper }) => {
    const response = await apiHelper.getPackages();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBeTruthy();
    expect(body.data).toBeDefined();
    expect(Array.isArray(body.data)).toBeTruthy();
  });

  test('GET /get_packages.php should return package structure', async ({ apiHelper }) => {
    const response = await apiHelper.getPackages();
    const body = await response.json();

    if (body.data && body.data.length > 0) {
      const pkg = body.data[0];
      expect(pkg).toHaveProperty('id');
      expect(pkg).toHaveProperty('title');
      expect(pkg).toHaveProperty('price');
    }
  });

  test('GET /get_packages.php?id=1 should return single package', async ({ apiHelper }) => {
    const response = await apiHelper.getPackages(1);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBeTruthy();
    expect(body.data).toBeDefined();
  });

  test('GET /get_packages.php?id=99999 should handle non-existent package', async ({ apiHelper }) => {
    const response = await apiHelper.getPackages(99999);
    const body = await response.json();
    // Should return 404 or empty data
    expect(body.success === false || !body.data || (Array.isArray(body.data) && body.data.length === 0)).toBeTruthy();
  });
});

test.describe('Public API - Destinations @api @regression', () => {
  test('GET /get_destinations.php should return all destinations', async ({ apiHelper }) => {
    const response = await apiHelper.getDestinations();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBeTruthy();
    expect(body.data).toBeDefined();
    expect(Array.isArray(body.data)).toBeTruthy();
  });

  test('destinations should have required fields', async ({ apiHelper }) => {
    const response = await apiHelper.getDestinations();
    const body = await response.json();

    if (body.data && body.data.length > 0) {
      const dest = body.data[0];
      expect(dest).toHaveProperty('id');
      expect(dest).toHaveProperty('name');
    }
  });
});

test.describe('Public API - Services @api @regression', () => {
  test('GET /get_services.php should return all services', async ({ apiHelper }) => {
    const response = await apiHelper.getServices();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBeTruthy();
    expect(body.data).toBeDefined();
    expect(Array.isArray(body.data)).toBeTruthy();
  });

  test('services should have required fields', async ({ apiHelper }) => {
    const response = await apiHelper.getServices();
    const body = await response.json();

    if (body.data && body.data.length > 0) {
      const service = body.data[0];
      expect(service).toHaveProperty('id');
      expect(service).toHaveProperty('title');
    }
  });
});

test.describe('Public API - Gallery @api @regression', () => {
  test('GET /get_gallery.php should return all gallery items', async ({ apiHelper }) => {
    const response = await apiHelper.getGallery();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBeTruthy();
    expect(body.data).toBeDefined();
  });

  test('GET /get_gallery.php?category=... should filter by category', async ({ apiHelper }) => {
    const response = await apiHelper.getGallery('travel spot');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBeTruthy();
  });
});

test.describe('Public API - Vehicles @api @regression', () => {
  test('GET /get_vehicles.php should return all vehicles', async ({ apiHelper }) => {
    const response = await apiHelper.getVehicles();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBeTruthy();
    expect(body.data).toBeDefined();
    expect(Array.isArray(body.data)).toBeTruthy();
  });

  test('GET /get_vehicles.php?date=... should filter by date availability', async ({ apiHelper }) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const dateStr = futureDate.toISOString().split('T')[0];

    const response = await apiHelper.getVehicles(dateStr);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBeTruthy();
  });

  test('vehicles should have required fields', async ({ apiHelper }) => {
    const response = await apiHelper.getVehicles();
    const body = await response.json();

    if (body.data && body.data.length > 0) {
      const vehicle = body.data[0];
      expect(vehicle).toHaveProperty('id');
      expect(vehicle).toHaveProperty('vehicle_name');
      expect(vehicle).toHaveProperty('seat_capacity');
    }
  });
});

test.describe('Public API - Testimonials @api @regression', () => {
  test('GET /get_testimonials.php should return testimonials', async ({ apiHelper }) => {
    const response = await apiHelper.getTestimonials();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBeTruthy();
    expect(body.data).toBeDefined();
  });

  test('testimonials should have required fields', async ({ apiHelper }) => {
    const response = await apiHelper.getTestimonials();
    const body = await response.json();

    if (body.data && body.data.length > 0) {
      const testimonial = body.data[0];
      expect(testimonial).toHaveProperty('id');
      expect(testimonial).toHaveProperty('customer_name');
      expect(testimonial).toHaveProperty('review_text');
      expect(testimonial).toHaveProperty('rating');
    }
  });
});
