import { Signal } from '@angular/core';

export interface Usuario {
  nombre: string;
  correo: string;
}

export abstract class Sesion {
  abstract readonly usuario: Signal<Usuario | null>;
  abstract readonly autenticado: Signal<boolean>;
  abstract estaAutenticado(): Promise<boolean>;
  abstract iniciarSesion(urlDestino?: string): void;
  abstract cerrarSesion(): void;
}