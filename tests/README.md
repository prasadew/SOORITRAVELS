# SOORI Travels - Test Automation Suite

Comprehensive test automation framework for the SOORI Travels web application using **Playwright** with **TypeScript**.

---

## Test Coverage Summary

| Test Type           | Spec File(s)                          | Test Count | Priority  |
|---------------------|---------------------------------------|------------|-----------|
| **E2E - Homepage**  | `e2e/homepage.spec.ts`                | 14         | Smoke     |
| **E2E - Navigation**| `e2e/navigation.spec.ts`              | 7          | Smoke     |
| **E2E - Auth**      | `e2e/auth.spec.ts`                    | 14         | Critical  |
| **E2E - Booking**   | `e2e/booking.spec.ts`                 | 9          | Critical  |
| **E2E - Profile**   | `e2e/profile.spec.ts`                 | 6          | Regression|
| **E2E - Admin**     | `e2e/admin-dashboard.spec.ts`         | 7          | Critical  |
| **E2E - Mobile**    | `e2e/responsive.mobile.spec.ts`       | 7          | Regression|
| **API - Public**    | `api/public-api.spec.ts`              | 17         | Smoke     |
| **API - User**      | `api/user-api.spec.ts`                | 9          | Regression|
| **API - Booking**   | `api/booking-api.spec.ts`             | 8          | Critical  |
| **API - Admin**     | `api/admin-api.spec.ts`               | 16         | Critical  |
| **API - Validation**| `api/api-validation.spec.ts`          | 12         | Regression|
| **Visual**          | `visual/visual-regression.spec.ts`    | 7          | Regression|
| **Accessibility**   | `accessibility/accessibility.spec.ts` | 12         | Regression|
| **Performance**     | `performance/performance.spec.ts`     | 10         | Regression|
| **Security**        | `security/security.spec.ts`           | 18         | Critical  |

**Total: ~173 test cases** across 6 test types, 3 browsers, and 2 mobile devices.

---

## Project Structure

```
tests/
├── playwright.config.ts        # Playwright configuration
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript configuration
├── global.setup.ts             # Pre-test health checks
├── global.teardown.ts          # Post-test cleanup
├── .env                        # Environment variables
├── .env.example                # Environment template
│
├── pages/                      # Page Object Model
│   ├── BasePage.ts             # Base page with shared methods
│   ├── HomePage.ts             # Homepage locators & actions
│   ├── LoginPage.ts            # Login page
│   ├── RegisterPage.ts         # Registration page
│   ├── BookingPage.ts          # Booking page
│   ├── ProfilePage.ts          # User profile page
│   ├── AdminLoginPage.ts       # Admin login
│   ├── AdminDashboardPage.ts   # Admin dashboard
│   └── index.ts                # Barrel exports
│
├── fixtures/
│   └── test-fixtures.ts        # Custom Playwright fixtures
│
├── utils/
│   ├── config.ts               # Configuration loader
│   ├── helpers.ts              # Utility functions
│   └── api-helper.ts           # API request helper
│
├── data/
│   └── test-data.ts            # Test data constants
│
├── e2e/                        # End-to-End Tests
│   ├── homepage.spec.ts        # Homepage tests
│   ├── navigation.spec.ts      # Navigation & routing tests
│   ├── auth.spec.ts            # Authentication tests
│   ├── booking.spec.ts         # Booking flow tests
│   ├── profile.spec.ts         # User profile tests
│   ├── admin-dashboard.spec.ts # Admin dashboard tests
│   └── responsive.mobile.spec.ts # Mobile responsive tests
│
├── api/                        # API Tests
│   ├── public-api.spec.ts      # Public endpoint tests
│   ├── user-api.spec.ts        # User API tests
│   ├── booking-api.spec.ts     # Booking API tests
│   ├── admin-api.spec.ts       # Admin API tests
│   └── api-validation.spec.ts  # Response format validation
│
├── visual/                     # Visual Regression Tests
│   └── visual-regression.spec.ts
│
├── accessibility/              # Accessibility Tests (WCAG 2.1)
│   └── accessibility.spec.ts
│
├── performance/                # Performance Tests
│   └── performance.spec.ts
│
└── security/                   # Security Tests
    └── security.spec.ts
```

---

## Prerequisites

- **Node.js** >= 18.x
- **WAMP/XAMPP** running with PHP 7+ and MySQL
- **SOORI Travels** application deployed at `http://localhost/SOORITRAVELS`
- **Database** seeded with `database/schema.sql`

---

## Setup

```bash
# Navigate to tests directory
cd tests

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Copy environment template
copy .env.example .env
# Edit .env with your local settings
```

---

## Running Tests

### Run All Tests
```bash
npm test
```

### By Test Type
```bash
npm run test:e2e           # End-to-End tests (all browsers)
npm run test:api           # API tests
npm run test:visual        # Visual regression tests
npm run test:a11y          # Accessibility tests
npm run test:performance   # Performance tests
npm run test:security      # Security tests
```

### By Priority
```bash
npm run test:smoke         # Smoke tests (quick sanity)
npm run test:critical      # Critical path tests
npm run test:regression    # Full regression suite
```

### Development Mode
```bash
npm run test:headed        # Run with browser visible
npm run test:debug         # Debug mode with inspector
npm run test:ui            # Playwright UI mode
```

### Specific Tests
```bash
# Run a single test file
npx playwright test e2e/auth.spec.ts

# Run tests matching a pattern
npx playwright test --grep "login"

# Run in a specific browser
npx playwright test --project=e2e-chromium
```

### Reports
```bash
npm run test:report        # Open HTML report
npm run test:ci            # Generate HTML + JUnit reports
```

### Update Visual Snapshots
```bash
npm run test:update-snapshots
```

---

## Test Types Explained

### 1. E2E Tests (`e2e/`)
Full user journey tests simulating real browser interactions:
- Page loading and content verification
- Form submissions and validations
- Navigation flows
- Mobile responsive behavior

### 2. API Tests (`api/`)
Backend API validation:
- Response format (JSON structure, status codes)
- CRUD operations
- Input validation
- Error handling
- Authentication enforcement

### 3. Visual Regression Tests (`visual/`)
Screenshot comparison to detect UI changes:
- Page layout consistency
- Component rendering
- Cross-browser visual parity

### 4. Accessibility Tests (`accessibility/`)
WCAG 2.1 AA compliance using axe-core:
- Automated accessibility audits
- Keyboard navigation
- Color contrast
- ARIA attributes
- Image alt text
- Heading hierarchy

### 5. Performance Tests (`performance/`)
Load time and resource optimization:
- Page load times
- Core Web Vitals (LCP, CLS)
- API response times
- Resource count and size
- Concurrent request handling

### 6. Security Tests (`security/`)
OWASP Top 10 vulnerability checks:
- XSS prevention
- SQL injection prevention
- Authentication/authorization bypass
- Session management
- Input validation
- Error information disclosure
- CSRF protection
- Directory traversal

---

## Architecture

### Page Object Model (POM)
All page interactions are abstracted into page objects for maintainability:
```typescript
// Usage in tests
test('should login', async ({ loginPage }) => {
  await loginPage.navigate();
  await loginPage.login('user@test.com', 'password');
});
```

### Custom Fixtures
Extended Playwright test fixtures inject page objects and helpers:
```typescript
import { test, expect } from '../fixtures/test-fixtures';
// homePage, loginPage, bookingPage, apiHelper, etc. are auto-injected
```

### Test Data Management
Centralized test data in `data/test-data.ts`:
- User credentials
- Booking data
- Security payloads
- API endpoints

### Tags
Tests are tagged for selective execution:
- `@smoke` - Quick sanity checks
- `@critical` - Business-critical paths
- `@regression` - Full regression
- `@security` - Security-focused
- `@a11y` - Accessibility
- `@visual` - Visual regression
- `@mobile` - Mobile-specific
- `@api` - API-only

---

## CI/CD Integration

GitHub Actions workflow is included at `.github/workflows/test-automation.yml`:
- Runs on push to `main`/`develop` and PRs
- Scheduled daily runs
- Parallel browser matrix (Chromium, Firefox, WebKit)
- Separate jobs for API, E2E, Security, and Accessibility
- Artifact uploads for test reports

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Tests fail with "Application not available" | Ensure WAMP is running and app is accessible at BASE_URL |
| Admin tests fail | Verify admin credentials in .env match database |
| Visual tests fail on first run | Run `npm run test:update-snapshots` to generate baselines |
| Firebase auth tests skip | Firebase tests require actual Firebase project setup |
| Accessibility violations | Review the violation details in the report and fix source HTML |
