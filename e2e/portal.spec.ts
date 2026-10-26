import { expect, test, type Page } from '@playwright/test';

type Seccion = 'Inicio' | 'Pólizas' | 'Siniestros';

/** Navega con el menú del shell. En celular, abre el menú ☰ si hace falta. */
async function irA(page: Page, seccion: Seccion) {
  await expect(page.getByText('Portal de asegurados', { exact: true })).toBeVisible();

  const enlace = page.getByRole('link', { name: seccion, exact: true });
  if (!(await enlace.isVisible())) {
    await page.getByRole('button', { name: /Menú/ }).click();
  }
  await enlace.click();
}

/** Cambia el país con el selector del shell. En celular, abre el menú si hace falta. */
async function cambiarPais(page: Page, codigo: 'MX' | 'CO' | 'ES') {
  const selector = page.getByLabel('País');
  if (!(await selector.isVisible())) {
    await page.getByRole('button', { name: /Menú/ }).click();
  }
  await selector.selectOption(codigo);
}

test('el usuario elige una póliza en Pólizas y reporta un siniestro en Siniestros', async ({ page }) => {
  await page.goto('/?sesion=simulada');

  await irA(page, 'Pólizas');
  await expect(page.getByRole('heading', { name: /Mis pólizas/ })).toBeVisible();

  const fila = page.getByRole('row', { name: /AUT-2026-0457/ });
  await fila.getByRole('button', { name: 'Usar como póliza activa' }).click();

  await expect(page.getByText('Póliza activa: AUT-2026-0457')).toBeVisible();

  await fila.getByRole('button', { name: 'Reportar siniestro' }).click();
  await expect(page.getByRole('heading', { name: 'Reportar un siniestro' })).toBeVisible();
  await expect(page.getByText('AUT-2026-0457 · Auto Amplia')).toBeVisible();
  await expect(page.locator('main').getByText('Usuario de prueba')).toBeVisible();

  await page.getByLabel('RFC').fill('GODE561231GR8');
  await page.getByLabel('Fecha del siniestro').fill('2026-10-20');
  await page.getByLabel('¿Qué pasó?').fill('Choque leve en el estacionamiento');
  await page.getByRole('button', { name: 'Enviar reporte' }).click();

  await expect(page.getByText(/Reporte registrado con folio SIN-/)).toBeVisible();
});

test('al cambiar de país cambian el catálogo, el formato, las reglas y los dominios', async ({ page }) => {
  await page.goto('/?sesion=simulada');

  await irA(page, 'Pólizas');
  await expect(page.getByRole('row', { name: /AUT-2026-0457/ })).toBeVisible();

  // España: otro catálogo, importes en euros y sin el dominio de Siniestros
  await cambiarPais(page, 'ES');
  await expect(page.getByRole('row', { name: /SAN-2026-0042/ })).toBeVisible();
  await expect(page.getByRole('row', { name: /AUT-2026-0457/ })).toHaveCount(0);
  await expect(page.getByText(/€/).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Siniestros', exact: true })).toHaveCount(0);

  // Colombia: el formulario de Siniestros pide otro documento fiscal
  await cambiarPais(page, 'CO');
  const fila = page.getByRole('row', { name: /SAL-2026-3301/ });
  await fila.getByRole('button', { name: 'Usar como póliza activa' }).click();
  await fila.getByRole('button', { name: 'Reportar siniestro' }).click();
  await expect(page.getByLabel('Cédula o NIT')).toBeVisible();
});

test('si Siniestros no responde, el portal muestra un aviso y Pólizas sigue funcionando', async ({ page }) => {
  await page.route('http://localhost:4202/**', (peticion) => peticion.abort());

  await page.goto('/?sesion=simulada');

  await irA(page, 'Siniestros');
  await expect(
    page.getByRole('heading', { name: 'Siniestros no está disponible en este momento' }),
  ).toBeVisible();

  await irA(page, 'Pólizas');
  await expect(page.getByRole('heading', { name: /Mis pólizas/ })).toBeVisible();
});

test('ninguna pantalla se desborda a lo ancho', async ({ page }) => {
  await page.goto('/?sesion=simulada');

  const pantallas: { seccion: Seccion; titulo: RegExp }[] = [
    { seccion: 'Pólizas', titulo: /Mis pólizas/ },
    { seccion: 'Siniestros', titulo: /Reportar un siniestro/ },
    { seccion: 'Inicio', titulo: /Hola|Bienvenido/ },
  ];

  for (const { seccion, titulo } of pantallas) {
    await irA(page, seccion);
    await expect(page.getByRole('heading', { name: titulo }).first()).toBeVisible();

    const desborda = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(desborda, `La pantalla ${seccion} tiene scroll horizontal`).toBe(false);
  }
});