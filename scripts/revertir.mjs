import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const REMOTOS = {
  polizas: { puerto: 8081, entrada: 'remoteEntry.json' },
  siniestros: { puerto: 8082, entrada: 'remoteEntry.json' },
  cotizador: { puerto: 8083, entrada: 'mfe-cotizador.js' },
};
const MANIFIESTO = 'hosting/shell/federation.manifest.json';

const [nombre, version] = process.argv.slice(2);
const remoto = REMOTOS[nombre];
if (!remoto || !version) {
  console.error('Uso: npm run revertir <polizas|siniestros|cotizador> <versión>');
  process.exit(1);
}

if (!existsSync(join('hosting', nombre, version))) {
  console.error(`No existe la versión ${version} de ${nombre} en el hosting.`);
  process.exit(1);
}

const manifiesto = JSON.parse(readFileSync(MANIFIESTO, 'utf8'));
manifiesto[nombre] = `http://localhost:${remoto.puerto}/${version}/${remoto.entrada}`;
writeFileSync(MANIFIESTO, JSON.stringify(manifiesto, null, 2) + '\n');

console.log(`✔ El manifiesto ahora apunta a ${nombre} v${version}. No se compiló ni se copió nada.`);