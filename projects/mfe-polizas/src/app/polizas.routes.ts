import { Routes } from '@angular/router';
import { PolizasLista } from './polizas-lista';
import { PolizasRaiz } from './polizas-raiz';

export const POLIZAS_ROUTES: Routes = [
  {
    path: '',
    component: PolizasRaiz,
    children: [{ path: '', component: PolizasLista }],
  },
];