import { bootstrapApplication } from '@angular/platform-browser';
import { NativeFederationResult } from '@angular-architects/native-federation';
import { appConfig } from './app/app.config';
import { App } from './app/app';

export const bootstrap = (nf: NativeFederationResult) =>
  bootstrapApplication(App, appConfig(nf)).catch((err) => console.error(err));