import { execSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** Cómo se construye cada micro frontend, sin importar a dónde se publique */
export const APPS = {
  shell: {
    construir: 'npx ng build shell',
    salida: 'dist/shell',
    info: 'projects/shell/src/app/shell-info.ts',
  },
  polizas: {
    construir: 'npx ng build mfe-polizas',
    salida: 'dist/mfe-polizas',
    info: 'projects/mfe-polizas/src/app/mfe-info.ts',
    puerto: 8081,
    entrada: 'remoteEntry.json',
  },
  siniestros: {
    construir: 'npx ng build mfe-siniestros',
    salida: 'dist/mfe-siniestros',
    info: 'projects/mfe-siniestros/src/app/mfe-info.ts',
    puerto: 8082,
    entrada: 'remoteEntry.json',
  },
  cotizador: {
    construir: 'npm --prefix projects/mfe-cotizador run build',
    salida: 'projects/mfe-cotizador/dist',
    info: 'projects/mfe-cotizador/src/info.ts',
    puerto: 8083,
    entrada: 'mfe-cotizador.js',
  },
};

/** Valida nombre y versión; si no son válidos, muestra el uso y termina */
export function validar(nombre, version, uso) {
  const app = APPS[nombre];
  if (!app || !/^\d+\.\d+\.\d+$/.test(version ?? '')) {
    console.error(uso);
    process.exit(1);
  }
  return app;
}

/** Escribe la versión en el código, compila solo esa aplicación y devuelve la carpeta resultante */
export function construir(nombre, version) {
  const app = APPS[nombre];

  const codigo = readFileSync(app.info, 'utf8').replace(/version: '[^']*'/, `version: '${version}'`);
  writeFileSync(app.info, codigo);

  console.log(`\n▶ Compilando ${nombre} v${version}...\n`);
  rmSync(app.salida, { recursive: true, force: true });
  execSync(app.construir, { stdio: 'inherit' });

  const conBrowser = join(app.salida, 'browser');
  return existsSync(conBrowser) ? conBrowser : app.salida;
}