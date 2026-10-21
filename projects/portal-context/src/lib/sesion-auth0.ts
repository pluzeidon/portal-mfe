import { inject, Injectable, makeEnvironmentProviders } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService, provideAuth0 } from '@auth0/auth0-angular';
import { firstValueFrom, map } from 'rxjs';
import { Sesion, Usuario } from './sesion';

@Injectable()
export class SesionAuth0 extends Sesion {
  private readonly auth = inject(AuthService);

  readonly usuario = toSignal(
    this.auth.user$.pipe(
      map((u): Usuario | null =>
        u ? { nombre: u.name ?? u.email ?? 'Usuario', correo: u.email ?? '' } : null,
      ),
    ),
    { initialValue: null },
  );

  readonly autenticado = toSignal(this.auth.isAuthenticated$, { initialValue: false });

  estaAutenticado() {
    return firstValueFrom(this.auth.isAuthenticated$);
  }

  iniciarSesion(urlDestino?: string) {
    this.auth.loginWithRedirect({ appState: { target: urlDestino ?? '/' } });
  }

  cerrarSesion() {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}

export interface ConfiguracionAuth0 {
  domain: string;
  clientId: string;
}

export const provideSesionAuth0 = (config: ConfiguracionAuth0) =>
  makeEnvironmentProviders([
    provideAuth0({
      domain: config.domain,
      clientId: config.clientId,
      authorizationParams: { redirect_uri: window.location.origin },
      useRefreshTokens: true,
      cacheLocation: 'localstorage',
    }),
    { provide: Sesion, useClass: SesionAuth0 },
  ]);