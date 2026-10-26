import { initFederation, NativeFederationResult } from '@angular-architects/native-federation';
import type { MapaComponentesWeb } from './app/federation/componentes-web';

const ORIGENES_PERMITIDOS = [
  window.location.origin, // El propio shell, por ejemplo en Azure
  'http://localhost:4201',
  'http://localhost:4202',
  'http://localhost:4203',
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:8083',
];

const esRemoteFederado = (url: string) => url.endsWith('remoteEntry.json');

fetch('federation.manifest.json')
  .then((respuesta) => respuesta.json() as Promise<Record<string, string>>)
  .then(async (manifiesto) => {
    const permitidos = Object.entries(manifiesto).filter(([nombre, url]) => {
      const origen = new URL(url, window.location.href).origin;
      const permitido = ORIGENES_PERMITIDOS.includes(origen);
      if (!permitido) {
        console.warn(`[federación] Se ignoró el remote "${nombre}": su origen ${origen} no está permitido`);
      }
      return permitido;
    });

    // Native Federation solo recibe los remotes que publican un remoteEntry.json
    const federados = Object.fromEntries(permitidos.filter(([, url]) => esRemoteFederado(url)));
    // Los demás son Web Components que el shell importa directamente
    const componentesWeb: MapaComponentesWeb = Object.fromEntries(
      permitidos.filter(([, url]) => !esRemoteFederado(url)),
    );

    const nf: NativeFederationResult = await initFederation(federados, {
      hostRemoteEntry: { url: './remoteEntry.json' },
    });
    const { bootstrap } = await import('./bootstrap');
    await bootstrap(nf, componentesWeb);
  })
  .catch((err) => console.error(err));