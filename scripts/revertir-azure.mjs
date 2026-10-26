import { APPS } from './apps.mjs';
import { existeEnAzure, leerManifiesto, subirManifiesto } from './azure.mjs';

const [nombre, version] = process.argv.slice(2);
const app = APPS[nombre];
if (!app || nombre === 'shell' || !version) {
  console.error('Uso: npm run revertir:azure <polizas|siniestros|cotizador> <versión>');
  process.exit(1);
}

const entrada = `mfe/${nombre}/${version}/${app.entrada}`;
if (!(await existeEnAzure(entrada))) {
  console.error(`No existe la versión ${version} de ${nombre} en Azure.`);
  process.exit(1);
}

const manifiesto = (await leerManifiesto()) ?? {};
manifiesto[nombre] = `/${entrada}`;
subirManifiesto(manifiesto);

console.log(`✔ El manifiesto de Azure ahora apunta a ${nombre} v${version}. No se compiló ni se subió código.`);