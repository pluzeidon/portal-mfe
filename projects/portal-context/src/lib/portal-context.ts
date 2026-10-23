import { Injectable, signal } from '@angular/core';
import { Poliza } from './poliza';

@Injectable({ providedIn: 'root' })
export class PortalContext {
  private readonly _polizaActiva = signal<Poliza | null>(null);
  readonly polizaActiva = this._polizaActiva.asReadonly();

  seleccionarPoliza(poliza: Poliza) {
    this._polizaActiva.set(poliza);
  }

  limpiarPoliza() {
    this._polizaActiva.set(null);
  }
}