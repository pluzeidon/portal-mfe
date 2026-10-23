import { Routes } from '@angular/router';
import { NativeFederationResult } from '@angular-architects/native-federation';
import { sesionGuard } from './sesion.guard';
import { cargarRemoto } from './federation/cargar-remoto';

export const routes = (nf: NativeFederationResult): Routes => [
  {
    path: 'polizas',
    canActivate: [sesionGuard],
    loadChildren: () => cargarRemoto(nf, 'polizas', 'POLIZAS_ROUTES', 'Pólizas'),
  },
  {
    path: 'siniestros',
    canActivate: [sesionGuard],
    loadChildren: () => cargarRemoto(nf, 'siniestros', 'SINIESTROS_ROUTES', 'Siniestros'),
  },
];