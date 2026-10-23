import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const APPS = {
  shell: { proyecto: 'shell', info: 'projects/shell/src/app/shell-info.ts' },
  polizas: { proyecto: 'mfe-polizas', info: 'projects/mfe-polizas/src/app/mfe-info.ts', puerto: 8081 },
  siniestros: { proyecto: 'mfe-siniestros', info: 'projects/mfe-siniestros/src/app/mfe-info.ts', puerto: 8082 },
};
const MANIFIESTO = 'hosting/shell/federation.manifest.json';

// 0. Validar los argumentos
const [nombre, version] = process.argv.slice(2);
const app = APPS[nombre];
if (!app || !/^\d+\.\d+\.\d+$/.test(version ?? '')) {
  console.error('Uso: npm run publicar <shell|polizas|siniestros> <versión>');
  console.error('Ejemplo: npm run publicar polizas 1.1.0');
  process.exit(1);
}

const esShell = nombre === 'shell';
const destino = esShell ? join('hosting', 'shell') : join('hosting', nombre, version);

if (!esShell && existsSync(destino)) {
  console.error(`La versión ${version} de ${nombre} ya está publicada.`);
  console.error('Las versiones publicadas no se sobrescriben: usa un número nuevo.');
  process.exit(1);
}

// 1. Escribir la versión en el código fuente (la que muestra Rayos X)
const codigo = readFileSync(app.info, 'utf8').replace(/version: '[^']*'/, `version: '${version}'`);
writeFileSync(app.info, codigo);

// 2. Compilar solo esta aplicación, en modo producción
console.log(`\n▶ Compilando ${app.proyecto} v${version}...\n`);
rmSync(join('dist', app.proyecto), { recursive: true, force: true });
execSync(`npx ng build ${app.proyecto}`, { stdio: 'inherit' });

// 3. Copiar el resultado al hosting
const conBrowser = join('dist', app.proyecto, 'browser');
const salida = existsSync(conBrowser) ? conBrowser : join('dist', app.proyecto);
const manifiestoPrevio = existsSync(MANIFIESTO) ? readFileSync(MANIFIESTO, 'utf8') : null;

if (esShell) {
  rmSync(destino, { recursive: true, force: true });
}
mkdirSync(destino, { recursive: true });
cpSync(salida, destino, { recursive: true });

// 4. Actualizar el manifiesto
if (esShell) {
  // Al republicar el shell se conserva el manifiesto vigente: las versiones
  // de los remotes no dependen del shell.
  if (manifiestoPrevio) {
    writeFileSync(MANIFIESTO, manifiestoPrevio);
  }
} else {
  const manifiesto = existsSync(MANIFIESTO) ? JSON.parse(readFileSync(MANIFIESTO, 'utf8')) : {};
  manifiesto[nombre] = `http://localhost:${app.puerto}/${version}/remoteEntry.json`;
  writeFileSync(MANIFIESTO, JSON.stringify(manifiesto, null, 2) + '\n');
}

console.log(`\n✔ ${nombre} v${version} publicado en ${destino}`);