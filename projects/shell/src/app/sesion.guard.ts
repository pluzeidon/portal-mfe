import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Sesion } from '@portal/context';

export const sesionGuard: CanActivateFn = async (_ruta, estado) => {
  const sesion = inject(Sesion);
  if (await sesion.estaAutenticado()) {
    return true;
  }
  sesion.iniciarSesion(estado.url);
  return sesion.autenticado();
};