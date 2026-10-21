import { Routes } from '@angular/router';
import { NativeFederationResult } from '@angular-architects/native-federation';

export const routes = (nf: NativeFederationResult): Routes => [
  {
    path: 'polizas',
    loadChildren: () =>
      nf
        .loadRemoteModule<{ POLIZAS_ROUTES: Routes }>('polizas', './Routes')
        .then((m) => m.POLIZAS_ROUTES),
  },
];