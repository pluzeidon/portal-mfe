import { initFederation, NativeFederationResult } from '@angular-architects/native-federation';

const ORIGENES_PERMITIDOS = [
  'http://localhost:4201',
  'http://localhost:4202',
  'http://localhost:8081',
  'http://localhost:8082',
];

fetch('federation.manifest.json')
  .then((respuesta) => respuesta.json() as Promise<Record<string, string>>)
  .then((manifiesto) =>
    Object.fromEntries(
      Object.entries(manifiesto).filter(([nombre, url]) => {
        const origen = new URL(url, window.location.href).origin;
        const permitido = ORIGENES_PERMITIDOS.includes(origen);
        if (!permitido) {
          console.warn(`[federación] Se ignoró el remote "${nombre}": su origen ${origen} no está permitido`);
        }
        return permitido;
      }),
    ),
  )
  .then((remotos) => initFederation(remotos, { hostRemoteEntry: { url: './remoteEntry.json' } }))
  .then((nf: NativeFederationResult) => import('./bootstrap').then((m) => m.bootstrap(nf)))
  .catch((err) => console.error(err));