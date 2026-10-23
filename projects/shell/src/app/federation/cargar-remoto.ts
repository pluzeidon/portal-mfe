import { Routes } from '@angular/router';
import { NativeFederationResult } from '@angular-architects/native-federation';
import { RemotoNoDisponible } from './remoto-no-disponible';

const TIEMPO_LIMITE_MS = 5000;

export function cargarRemoto(
  nf: NativeFederationResult,
  remoto: string,
  exportName: string,
  nombre: string,
): Promise<Routes> {
  const limite = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Tiempo agotado al cargar ${remoto}`)), TIEMPO_LIMITE_MS),
  );

  return Promise.race([nf.loadRemoteModule<Record<string, Routes>>(remoto, './Routes'), limite])
    .then((modulo) => modulo[exportName])
    .catch((error) => {
      console.error(`[mfe:${remoto}] No se pudo cargar`, error);
      return [{ path: '**', component: RemotoNoDisponible, data: { nombre } }];
    });
}