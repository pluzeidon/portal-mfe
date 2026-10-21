import { ApplicationConfig, InjectionToken, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NativeFederationResult } from '@angular-architects/native-federation';
import { routes } from './app.routes';

export const MODULE_LOADER = new InjectionToken<NativeFederationResult>('MODULE_LOADER');

export const appConfig = (nf: NativeFederationResult): ApplicationConfig => ({
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: MODULE_LOADER, useValue: nf },
    provideRouter(routes(nf)),
  ],
});