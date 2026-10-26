import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { construir, validar } from './apps.mjs';
import { ENDPOINT, existeEnAzure, leerManifiesto, subirCarpeta, subirManifiesto } from './azure.mjs';

const [nombre, version] = process.argv.slice(2);
const app = validar(
  nombre,
  version,
  'Uso: npm run publicar:azure <shell|polizas|siniestros|cotizador> <versión>',
);
const esShell = nombre === 'shell';

// 1. Las versiones publicadas no se sobrescriben
if (!esShell) {
  const entrada = `mfe/${nombre}/${version}/${app.entrada}`;
  if (await existeEnAzure(entrada)) {
    console.error(`La versión ${version} de ${nombre} ya está publicada en Azure.`);
    console.error('Las versiones publicadas no se sobrescriben: usa un número nuevo.');
    process.exit(1);
  }
}

// 2. Compilar solo esta aplicación
const salida = construir(nombre, version);

if (esShell) {
  // 3a. El manifiesto de Azure manda: no se sube el de desarrollo, que apunta a localhost
  rmSync(join(salida, 'federation.manifest.json'), { force: true });
  console.log('\n▶ Subiendo el shell a la raíz del sitio...\n');
  subirCarpeta(salida, '');

  if (!(await leerManifiesto())) {
    subirManifiesto({});
  }
} else {
  // 3b. Subir el remote a su carpeta versionada y actualizar solo su entrada del manifiesto
  const carpeta = `mfe/${nombre}/${version}`;
  console.log(`\n▶ Subiendo ${nombre} a /${carpeta}...\n`);
  subirCarpeta(salida, carpeta);

  const manifiesto = (await leerManifiesto()) ?? {};
  manifiesto[nombre] = `/${carpeta}/${app.entrada}`;
  subirManifiesto(manifiesto);
}

console.log(`\n✔ ${nombre} v${version} publicado en ${ENDPOINT}`);