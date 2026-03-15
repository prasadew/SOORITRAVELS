import { test as setup } from '@playwright/test';
import { config } from './utils/config';

/**
 * Global setup: verify application is running and seed test data
 */
setup('verify application availability', async ({ request }) => {
  // Check that main site is up
  const homeResponse = await request.get(config.baseUrl);
  if (homeResponse.status() !== 200) {
    throw new Error(
      `Application not available at ${config.baseUrl}. Status: ${homeResponse.status()}. ` +
      'Make sure WAMP server is running and the application is deployed.'
    );
  }

  // Check API availability
  const apiResponse = await request.get(`${config.api.baseUrl}/get_packages.php`);
  if (apiResponse.status() !== 200) {
    throw new Error('API is not responding. Check database connection and API endpoints.');
  }

  console.log('✓ Application is available and healthy');
});

setup('verify admin login', async ({ request }) => {
  const loginResponse = await request.post(`${config.api.baseUrl}/admin_login.php`, {
    data: {
      email: config.admin.email,
      password: config.admin.password,
    },
  });

  const body = await loginResponse.json();
  if (!body.success) {
    console.warn('⚠ Admin login verification failed. Some admin tests may be skipped.');
  } else {
    console.log('✓ Admin authentication verified');
  }
});
