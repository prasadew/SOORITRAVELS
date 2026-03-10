import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const BASE_URL = process.env.BASE_URL || 'http://localhost/SOORITRAVELS';
const BASE_URL_WITH_SLASH = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;

export default defineConfig({
  testDir: '.',
  outputDir: './test-results',
  timeout: Number(process.env.DEFAULT_TIMEOUT) || 30000,
  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
    },
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : [['html', { open: 'on-failure' }], ['list']],

  use: {
    baseURL: BASE_URL_WITH_SLASH,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 15000,
    navigationTimeout: Number(process.env.NAVIGATION_TIMEOUT) || 60000,
  },

  projects: [
    // ---------- Setup ----------
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
      teardown: 'teardown',
    },
    {
      name: 'teardown',
      testMatch: /global\.teardown\.ts/,
    },

    // ---------- E2E Tests ----------
    {
      name: 'e2e-chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testDir: './e2e',
    },
    {
      name: 'e2e-firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
      testDir: './e2e',
    },
    {
      name: 'e2e-webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
      testDir: './e2e',
    },

    // ---------- Mobile Tests ----------
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
      testDir: './e2e',
      testMatch: /.*\.mobile\.spec\.ts/,
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
      dependencies: ['setup'],
      testDir: './e2e',
      testMatch: /.*\.mobile\.spec\.ts/,
    },

    // ---------- API Tests ----------
    {
      name: 'api-tests',
      use: {
        baseURL: BASE_URL_WITH_SLASH,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
        },
      },
      testDir: './api',
    },

    // ---------- Visual Regression Tests ----------
    {
      name: 'visual-tests',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testDir: './visual',
    },

    // ---------- Accessibility Tests ----------
    {
      name: 'accessibility-tests',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testDir: './accessibility',
    },

    // ---------- Performance Tests ----------
    {
      name: 'performance-tests',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testDir: './performance',
    },

    // ---------- Security Tests ----------
    {
      name: 'security-tests',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testDir: './security',
    },
  ],
});
