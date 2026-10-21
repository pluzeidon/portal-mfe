import { computed, Injectable, makeEnvironmentProviders, signal } from '@angular/core';
import { Sesion, Usuario } from './sesion';

@Injectable()
export class SesionSimulada extends Sesion {
  private readonly _usuario = signal<Usuario | null>(null);
  readonly usuario = this._usuario.asReadonly();
  readonly autenticado = computed(() => this._usuario() !== null);

  estaAutenticado() {
    return Promise.resolve(this.autenticado());
  }

  iniciarSesion() {
    this._usuario.set({ nombre: 'Usuario de prueba', correo: 'prueba@portal.local' });
  }

  cerrarSesion() {
    this._usuario.set(null);
  }
}

export const provideSesionSimulada = () =>
  makeEnvironmentProviders([{ provide: Sesion, useClass: SesionSimulada }]);