import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortalContext, Sesion } from '@portal/context';
import { DOMINIOS } from './dominios';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  template: `
    @if (sesion.usuario(); as usuario) {
      <h1>Hola, {{ usuario.nombre }}</h1>
    } @else {
      <h1>Bienvenido al portal de asegurados</h1>
    }
    <p>
      Estás operando en <strong>{{ contexto.mercado().nombre }}</strong>.
      Estos son los servicios disponibles en tu país.
    </p>

    <div class="tarjetas">
      @for (dominio of tarjetas(); track dominio.clave) {
        <a class="tarjeta" [routerLink]="dominio.ruta">
          <h2>{{ dominio.titulo }}</h2>
          <p>{{ dominio.descripcion }}</p>
        </a>
      }
    </div>
  `,
  styles: `
    .tarjetas {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      gap: 1rem;
      margin-top: 1.5rem;
    }
    .tarjeta {
      display: block;
      padding: 1.25rem;
      border: 1px solid var(--color-borde);
      border-radius: 0.5rem;
      color: inherit;
      text-decoration: none;
    }
    .tarjeta:hover {
      border-color: var(--color-primario);
      background: var(--color-resaltado);
    }
    .tarjeta h2 {
      margin-top: 0;
      font-size: 1.15rem;
      color: var(--color-primario);
    }
  `,
})
export class Inicio {
  protected readonly sesion = inject(Sesion);
  protected readonly contexto = inject(PortalContext);
  protected readonly tarjetas = computed(() =>
    DOMINIOS.filter((dominio) => this.contexto.dominioDisponible(dominio.clave)),
  );
}