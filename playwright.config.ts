import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'escritorio',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'celular',
      use: { ...devices['Pixel 7'], channel: 'msedge' },
    },
  ],
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
      command:
        'npm --prefix projects/mfe-cotizador run build && npx http-server projects/mfe-cotizador/dist -p 4203 -c-1 --cors',
      url: 'http://localhost:4203/mfe-cotizador.js',
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