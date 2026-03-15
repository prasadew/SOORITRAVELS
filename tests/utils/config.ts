import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost/SOORITRAVELS',
  adminUrl: process.env.ADMIN_URL || 'http://localhost/SOORITRAVELS/admin',

  testUser: {
    email: process.env.TEST_USER_EMAIL || 'testuser@sooritravels.com',
    password: process.env.TEST_USER_PASSWORD || 'Test@12345',
    name: process.env.TEST_USER_NAME || 'Test User',
    phone: process.env.TEST_USER_PHONE || '+94771234567',
    country: process.env.TEST_USER_COUNTRY || 'Sri Lanka',
  },

  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@sooritravels.com',
    password: process.env.ADMIN_PASSWORD || 'password',
  },

  timeouts: {
    default: Number(process.env.DEFAULT_TIMEOUT) || 30000,
    navigation: Number(process.env.NAVIGATION_TIMEOUT) || 60000,
    api: Number(process.env.API_TIMEOUT) || 10000,
  },

  api: {
    baseUrl: `${process.env.BASE_URL || 'http://localhost/SOORITRAVELS'}/api`,
  },
};
