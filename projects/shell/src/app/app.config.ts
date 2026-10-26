import { ApplicationConfig, InjectionToken, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NativeFederationResult } from '@angular-architects/native-federation';
import { provideSesionAuth0, provideSesionSimulada } from '@portal/context';
import { routes } from './app.routes';
import { CONFIGURACION } from './configuracion';
import { COMPONENTES_WEB, MapaComponentesWeb } from './federation/componentes-web';

export const MODULE_LOADER = new InjectionToken<NativeFederationResult>('MODULE_LOADER');

export const appConfig = (
  nf: NativeFederationResult,
  componentesWeb: MapaComponentesWeb,
): ApplicationConfig => ({
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: MODULE_LOADER, useValue: nf },
    { provide: COMPONENTES_WEB, useValue: componentesWeb },
    provideRouter(routes(nf)),
    CONFIGURACION.modoSesion === 'auth0'
      ? provideSesionAuth0(CONFIGURACION.auth0)
      : provideSesionSimulada(),
  ],
});