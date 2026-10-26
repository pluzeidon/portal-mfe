import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PortalContext } from '@portal/context';

/** Solo deja entrar a un dominio si existe en el mercado actual. */
export const dominioGuard =
  (dominio: string): CanActivateFn =>
  () => {
    const contexto = inject(PortalContext);
    const router = inject(Router);
    return contexto.dominioDisponible(dominio) ? true : router.createUrlTree(['/']);
  };