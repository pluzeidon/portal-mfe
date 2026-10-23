import { expect, test } from '@playwright/test';

test('el usuario elige una póliza en Pólizas y reporta un siniestro en Siniestros', async ({ page }) => {
  await page.goto('/?sesion=simulada');

  // Pólizas: elegir la póliza activa
  await page.getByRole('link', { name: 'Pólizas' }).click();
  await expect(page.getByRole('heading', { name: /Mis pólizas/ })).toBeVisible();

  const fila = page.getByRole('row', { name: /AUT-2026-0457/ });
  await fila.getByRole('button', { name: 'Usar como póliza activa' }).click();

  // El shell refleja la póliza elegida en otro micro frontend
  await expect(page.getByText('Póliza activa: AUT-2026-0457')).toBeVisible();

  // Siniestros: llega con la póliza y el usuario precargados
  await fila.getByRole('button', { name: 'Reportar siniestro' }).click();
  await expect(page.getByRole('heading', { name: 'Reportar un siniestro' })).toBeVisible();
  await expect(page.getByText('AUT-2026-0457 · Auto Amplia')).toBeVisible();
  await expect(page.locator('main').getByText('Usuario de prueba')).toBeVisible();

  await page.getByLabel('Fecha del siniestro').fill('2026-10-20');
  await page.getByLabel('¿Qué pasó?').fill('Choque leve en el estacionamiento');
  await page.getByRole('button', { name: 'Enviar reporte' }).click();

  await expect(page.getByText(/Reporte registrado con folio SIN-/)).toBeVisible();
});

test('si Siniestros no responde, el portal muestra un aviso y Pólizas sigue funcionando', async ({ page }) => {
  // Simula que el servidor de Siniestros está caído
  await page.route('http://localhost:4202/**', (peticion) => peticion.abort());

  await page.goto('/?sesion=simulada');

  await page.getByRole('link', { name: 'Siniestros' }).click();
  await expect(
    page.getByRole('heading', { name: 'Siniestros no está disponible en este momento' }),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Pólizas' }).click();
  await expect(page.getByRole('heading', { name: /Mis pólizas/ })).toBeVisible();
});