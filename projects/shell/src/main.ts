import { initFederation, NativeFederationResult } from '@angular-architects/native-federation';

initFederation('federation.manifest.json', {
  hostRemoteEntry: { url: './remoteEntry.json' },
})
  .then((nf: NativeFederationResult) => import('./bootstrap').then((m) => m.bootstrap(nf)))
  .catch((err) => console.error(err));