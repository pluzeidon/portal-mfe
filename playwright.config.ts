import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4200',
    channel: 'msedge',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'npx ng serve mfe-polizas',
      url: 'http://localhost:4201/remoteEntry.json',
      reuseExistingServer: true,
      timeout: 180_000,
    },
    {
      command: 'npx ng serve mfe-siniestros',
      url: 'http://localhost:4202/remoteEntry.json',
      reuseExistingServer: true,
      timeout: 180_000,
    },
    {
      command: 'npx ng serve shell',
      url: 'http://localhost:4200',
      reuseExistingServer: true,
      timeout: 180_000,
    },
  ],
});