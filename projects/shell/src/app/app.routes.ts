import { Routes } from '@angular/router';
import { NativeFederationResult } from '@angular-architects/native-federation';
import { sesionGuard } from './sesion.guard';

export const routes = (nf: NativeFederationResult): Routes => [
  {
    path: 'polizas',
    canActivate: [sesionGuard],
    loadChildren: () =>
      nf
        .loadRemoteModule<{ POLIZAS_ROUTES: Routes }>('polizas', './Routes')
        .then((m) => m.POLIZAS_ROUTES),
  },
  {
    path: 'siniestros',
    canActivate: [sesionGuard],
    loadChildren: () =>
      nf
        .loadRemoteModule<{ SINIESTROS_ROUTES: Routes }>('siniestros', './Routes')
        .then((m) => m.SINIESTROS_ROUTES),
  },
];