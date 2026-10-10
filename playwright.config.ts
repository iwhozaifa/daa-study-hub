import { defineConfig, devices } from '@playwright/test';

// Tests the built static site (out/) exactly as GitHub Pages serves it: under /daa-study-hub.
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npx serve .e2e -l 4321 --no-clipboard',
    url: 'http://localhost:4321/daa-study-hub/',
    reuseExistingServer: !process.env.CI,
  },
});
