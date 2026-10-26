import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { construir, validar } from './apps.mjs';

const MANIFIESTO = 'hosting/shell/federation.manifest.json';

const [nombre, version] = process.argv.slice(2);
const app = validar(
  nombre,
  version,
  'Uso: npm run publicar <shell|polizas|siniestros|cotizador> <versión>',
);

const esShell = nombre === 'shell';
const destino = esShell ? join('hosting', 'shell') : join('hosting', nombre, version);

if (!esShell && existsSync(destino)) {
  console.error(`La versión ${version} de ${nombre} ya está publicada.`);
  console.error('Las versiones publicadas no se sobrescriben: usa un número nuevo.');
  process.exit(1);
}

const salida = construir(nombre, version);
const manifiestoPrevio = existsSync(MANIFIESTO) ? readFileSync(MANIFIESTO, 'utf8') : null;

if (esShell) {
  rmSync(destino, { recursive: true, force: true });
}
mkdirSync(destino, { recursive: true });
cpSync(salida, destino, { recursive: true });

if (esShell) {
  if (manifiestoPrevio) {
    writeFileSync(MANIFIESTO, manifiestoPrevio);
  }
} else {
  const manifiesto = existsSync(MANIFIESTO) ? JSON.parse(readFileSync(MANIFIESTO, 'utf8')) : {};
  manifiesto[nombre] = `http://localhost:${app.puerto}/${version}/${app.entrada}`;
  writeFileSync(MANIFIESTO, JSON.stringify(manifiesto, null, 2) + '\n');
}

console.log(`\n✔ ${nombre} v${version} publicado en ${destino}`);