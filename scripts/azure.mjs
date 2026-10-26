import { execSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const CUENTA = 'caportalmfepoc';
export const ENDPOINT = 'https://caportalmfepoc.z19.web.core.windows.net';

const CONTENEDOR = '$web';
// PoC: todo se revalida en cada carga. En producción, solo el manifiesto,
// los remoteEntry.json y el index.html irían sin caché.
const CACHE = 'no-cache';

/** Ejecuta un comando de la CLI de Azure contra la cuenta de Storage (pensado para Windows) */
function az(argumentos) {
  execSync(`az ${argumentos} --account-name ${CUENTA} --auth-mode key --only-show-errors`, {
    stdio: 'inherit',
  });
}

/** Sube una carpeta completa a $web, dentro de la ruta indicada ('' = raíz) */
export function subirCarpeta(origen, destino) {
  const ruta = destino ? `--destination-path "${destino}"` : '';
  az(
    `storage blob upload-batch --destination "${CONTENEDOR}" --source "${origen}" ${ruta} ` +
      `--content-cache-control "${CACHE}" --overwrite`,
  );
}

/** ¿Ya existe ese archivo publicado? Se pregunta al sitio público, como lo haría un navegador */
export async function existeEnAzure(ruta) {
  const respuesta = await fetch(`${ENDPOINT}/${ruta}`, { method: 'HEAD', cache: 'no-store' });
  return respuesta.ok;
}

/** Lee el manifiesto vigente del sitio; null si todavía no existe */
export async function leerManifiesto() {
  const respuesta = await fetch(`${ENDPOINT}/federation.manifest.json`, { cache: 'no-store' });
  if (!respuesta.ok) {
    return null;
  }
  try {
    return await respuesta.json();
  } catch {
    return null;
  }
}

/** Sube el manifiesto. Es el único archivo que cambia en un rollback */
export function subirManifiesto(manifiesto) {
  const carpeta = mkdtempSync(join(tmpdir(), 'manifiesto-'));
  const archivo = join(carpeta, 'federation.manifest.json');
  writeFileSync(archivo, JSON.stringify(manifiesto, null, 2) + '\n');
  az(
    `storage blob upload --container-name "${CONTENEDOR}" --file "${archivo}" ` +
      `--name federation.manifest.json --content-type application/json ` +
      `--content-cache-control "${CACHE}" --overwrite`,
  );
}