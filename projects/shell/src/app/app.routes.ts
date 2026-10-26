import { Routes } from '@angular/router';
import { NativeFederationResult } from '@angular-architects/native-federation';
import { cargarRemoto } from './federation/cargar-remoto';
import { dominioGuard } from './dominio.guard';
import { Inicio } from './inicio';
import { sesionGuard } from './sesion.guard';

export const routes = (nf: NativeFederationResult): Routes => [
  { path: '', component: Inicio },
  {
    path: 'polizas',
    canActivate: [sesionGuard, dominioGuard('polizas')],
    loadChildren: () => cargarRemoto(nf, 'polizas', 'POLIZAS_ROUTES', 'Pólizas'),
  },
  {
    path: 'siniestros',
    canActivate: [sesionGuard, dominioGuard('siniestros')],
    loadChildren: () => cargarRemoto(nf, 'siniestros', 'SINIESTROS_ROUTES', 'Siniestros'),
  },
  { path: '**', redirectTo: '' },
];