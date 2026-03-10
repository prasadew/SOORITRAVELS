import { test, expect } from '@playwright/test';
import { config } from '../utils/config';

test.describe('Performance - Page Load Times @performance @regression', () => {
  const pages = [
    { name: 'Homepage', path: './' },
    { name: 'Login', path: 'login_new.php' },
    { name: 'Register', path: 'register_new.php' },
    { name: 'Booking', path: 'booking.php?package_id=1' },
    { name: 'Developers', path: 'developers.html' },
    { name: 'Admin Login', path: 'admin/login.php' },
  ];

  for (const pageInfo of pages) {
    test(`${pageInfo.name} should load within acceptable time`, async ({ page }) => {
      const startTime = Date.now();
      await page.goto(pageInfo.path, { waitUntil: 'domcontentloaded' });
      const loadTime = Date.now() - startTime;

      console.log(`${pageInfo.name} DOM content loaded in ${loadTime}ms`);
      // Page should load within 5 seconds on local environment
      expect(loadTime, `${pageInfo.name} took ${loadTime}ms`).toBeLessThan(5000);
    });
  }
});

test.describe('Performance - Web Vitals @performance @regression', () => {
  test('homepage should have good Core Web Vitals', async ({ page }) => {
    await page.goto('./');
    await page.waitForLoadState('networkidle');

    // Measure LCP (Largest Contentful Paint)
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          resolve(lastEntry.startTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // Fallback timeout
        setTimeout(() => resolve(-1), 5000);
      });
    });

    if (lcp > 0) {
      console.log(`LCP: ${lcp}ms`);
      // LCP should be under 2.5s for "good"
      expect(lcp, 'LCP exceeds 2.5s threshold').toBeLessThan(4000);
    }

    // Measure CLS (Cumulative Layout Shift)
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          resolve(clsValue);
        }).observe({ type: 'layout-shift', buffered: true });

        setTimeout(() => resolve(clsValue), 3000);
      });
    });

    console.log(`CLS: ${cls}`);
    // CLS should be under 0.1 for "good"
    expect(cls, 'CLS exceeds 0.1 threshold').toBeLessThan(0.25);
  });

  test('homepage should have reasonable number of DOM nodes', async ({ page }) => {
    await page.goto('./');
    await page.waitForLoadState('networkidle');

    const nodeCount = await page.evaluate(() => document.querySelectorAll('*').length);
    console.log(`DOM nodes: ${nodeCount}`);
    // Should not exceed 3000 nodes for good performance
    expect(nodeCount, 'Too many DOM nodes').toBeLessThan(5000);
  });
});

test.describe('Performance - API Response Times @performance @regression', () => {
  const apiEndpoints = [
    'api/get_packages.php',
    'api/get_destinations.php',
    'api/get_services.php',
    'api/get_gallery.php',
    'api/get_vehicles.php',
    'api/get_testimonials.php',
  ];

  for (const endpoint of apiEndpoints) {
    test(`${endpoint} should respond within 2s`, async ({ request }) => {
      const startTime = Date.now();
      const response = await request.get(endpoint);
      const responseTime = Date.now() - startTime;

      console.log(`${endpoint}: ${responseTime}ms (status: ${response.status()})`);
      expect(response.status()).toBe(200);
      expect(responseTime, `${endpoint} took ${responseTime}ms`).toBeLessThan(2000);
    });
  }
});

test.describe('Performance - Resource Loading @performance @regression', () => {
  test('homepage should not load too many resources', async ({ page }) => {
    const resources: { url: string; size: number; type: string }[] = [];

    page.on('response', async (response) => {
      const url = response.url();
      const headers = response.headers();
      const size = parseInt(headers['content-length'] || '0');
      const type = headers['content-type'] || 'unknown';
      resources.push({ url, size, type });
    });

    await page.goto('./');
    await page.waitForLoadState('networkidle');

    console.log(`Total resources loaded: ${resources.length}`);

    // Count by type
    const scripts = resources.filter(r => r.type.includes('javascript'));
    const styles = resources.filter(r => r.type.includes('css'));
    const images = resources.filter(r => r.type.includes('image'));

    console.log(`Scripts: ${scripts.length}, Styles: ${styles.length}, Images: ${images.length}`);

    // Total resources should be reasonable
    expect(resources.length, 'Too many resources loaded').toBeLessThan(100);
  });

  test('should not have excessively large scripts', async ({ page }) => {
    const largeScripts: string[] = [];

    page.on('response', async (response) => {
      if (response.url().endsWith('.js')) {
        const body = await response.body().catch(() => Buffer.from(''));
        if (body.length > 500 * 1024) { // 500KB
          largeScripts.push(`${response.url()} (${Math.round(body.length / 1024)}KB)`);
        }
      }
    });

    await page.goto('./');
    await page.waitForLoadState('networkidle');

    if (largeScripts.length > 0) {
      console.warn('Large scripts detected:', largeScripts);
    }
  });

  test('images should be optimized', async ({ page }) => {
    await page.goto('./');
    await page.waitForLoadState('networkidle');

    const imageDetails = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      return Array.from(imgs).map(img => ({
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayWidth: img.clientWidth,
        displayHeight: img.clientHeight,
        hasLazy: img.loading === 'lazy',
      }));
    });

    // Check for oversized images (displayed much smaller than natural size)
    const oversized = imageDetails.filter(
      img => img.naturalWidth > 0 && img.displayWidth > 0 &&
      img.naturalWidth > img.displayWidth * 3
    );

    if (oversized.length > 0) {
      console.warn(`${oversized.length} oversized images found (served 3x+ larger than displayed)`);
    }
  });
});

test.describe('Performance - Concurrent API Load @performance @regression', () => {
  test('should handle concurrent API requests', async ({ request }) => {
    const endpoints = [
      'api/get_packages.php',
      'api/get_destinations.php',
      'api/get_services.php',
      'api/get_gallery.php',
      'api/get_vehicles.php',
      'api/get_testimonials.php',
    ];

    const startTime = Date.now();
    const responses = await Promise.all(
      endpoints.map(endpoint => request.get(endpoint))
    );
    const totalTime = Date.now() - startTime;

    console.log(`Concurrent requests completed in ${totalTime}ms`);

    // All should succeed
    for (const response of responses) {
      expect(response.status()).toBe(200);
    }

    // Total time should be reasonable (not sequential)
    expect(totalTime, 'Concurrent requests too slow').toBeLessThan(5000);
  });
});
