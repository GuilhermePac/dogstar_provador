import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';

// Uses the system Chrome when present (no browser download needed).
const chrome = ['/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const launchOptions = chrome ? { executablePath: chrome, args: ['--no-sandbox'] } : {};

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 45_000,
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4173', acceptDownloads: true, launchOptions },
  webServer: { command: 'npx vite preview --port 4173 --strictPort', url: 'http://localhost:4173', reuseExistingServer: true },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 900 }, launchOptions } },
    { name: 'celular', use: { ...devices['Pixel 7'], launchOptions } },
  ],
});
