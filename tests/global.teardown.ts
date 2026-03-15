import { test as teardown } from '@playwright/test';

/**
 * Global teardown: cleanup test artifacts
 */
teardown('cleanup test data', async ({}) => {
  console.log('✓ Test suite teardown complete');
});
