import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PortalContext {
  readonly contador = signal(0);

  incrementar() {
    this.contador.update((valor) => valor + 1);
  }
}