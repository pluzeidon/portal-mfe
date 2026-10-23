import { Routes } from '@angular/router';
import { SiniestrosRaiz } from './siniestros-raiz';
import { SiniestrosReporte } from './siniestros-reporte';

export const SINIESTROS_ROUTES: Routes = [
  {
    path: '',
    component: SiniestrosRaiz,
    children: [{ path: '', component: SiniestrosReporte }],
  },
];