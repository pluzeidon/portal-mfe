import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CodigoMercado, MERCADOS, MfeBoundary, PortalContext, Sesion } from '@portal/context';
import { DOMINIOS } from './dominios';
import { SHELL_INFO } from './shell-info';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MfeBoundary],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly contexto = inject(PortalContext);
  protected readonly sesion = inject(Sesion);
  protected readonly info = SHELL_INFO;
  protected readonly menuAbierto = signal(false);
  protected readonly mercados = Object.values(MERCADOS);
  protected readonly menu = computed(() =>
    DOMINIOS.filter((dominio) => this.contexto.dominioDisponible(dominio.clave)),
  );

  private readonly router = inject(Router);

  protected alternarMenu() {
    this.menuAbierto.update((abierto) => !abierto);
  }

  protected cerrarMenu() {
    this.menuAbierto.set(false);
  }

  protected cambiarMercado(codigo: string) {
    this.contexto.cambiarMercado(codigo as CodigoMercado);
    this.cerrarMenu();

    // Si el usuario está en un dominio que no existe en el nuevo mercado, vuelve al inicio
    const dominioActual = this.router.url.split(/[/?#]/)[1];
    if (dominioActual && !this.contexto.dominioDisponible(dominioActual)) {
      this.router.navigateByUrl('/');
    }
  }
}