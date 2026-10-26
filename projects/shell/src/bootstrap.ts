import { bootstrapApplication } from '@angular/platform-browser';
import { NativeFederationResult } from '@angular-architects/native-federation';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import type { MapaComponentesWeb } from './app/federation/componentes-web';

export const bootstrap = (nf: NativeFederationResult, componentesWeb: MapaComponentesWeb) =>
  bootstrapApplication(App, appConfig(nf, componentesWeb)).catch((err) => console.error(err));