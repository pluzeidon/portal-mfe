import { computed, Injectable, signal } from '@angular/core';
import { CodigoMercado, Mercado, MERCADOS } from './mercado';
import { Poliza } from './poliza';

const CLAVE_MERCADO = 'portal.mercado';

function mercadoInicial(): CodigoMercado {
  try {
    const guardado = sessionStorage.getItem(CLAVE_MERCADO);
    if (guardado && guardado in MERCADOS) {
      return guardado as CodigoMercado;
    }
  } catch {
    // Sin acceso a sessionStorage: se usa el mercado por defecto
  }
  return 'MX';
}

@Injectable({ providedIn: 'root' })
export class PortalContext {
  private readonly _codigoMercado = signal<CodigoMercado>(mercadoInicial());
  readonly mercado = computed<Mercado>(() => MERCADOS[this._codigoMercado()]);

  private readonly _polizaActiva = signal<Poliza | null>(null);
  readonly polizaActiva = this._polizaActiva.asReadonly();

  private readonly _rayosX = signal(false);
  readonly rayosX = this._rayosX.asReadonly();

  cambiarMercado(codigo: CodigoMercado) {
    if (codigo === this._codigoMercado()) {
      return;
    }
    this._codigoMercado.set(codigo);
    // Regla de negocio: una póliza pertenece a un mercado
    this._polizaActiva.set(null);
    try {
      sessionStorage.setItem(CLAVE_MERCADO, codigo);
    } catch {
      // Si no se puede guardar, el cambio solo dura en memoria
    }
  }

  dominioDisponible(dominio: string): boolean {
    return this.mercado().dominios.includes(dominio);
  }

  seleccionarPoliza(poliza: Poliza) {
    this._polizaActiva.set(poliza);
  }

  limpiarPoliza() {
    this._polizaActiva.set(null);
  }

  alternarRayosX() {
    this._rayosX.update((encendido) => !encendido);
  }
}