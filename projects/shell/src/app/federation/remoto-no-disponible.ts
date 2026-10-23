import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-remoto-no-disponible',
  imports: [RouterLink],
  template: `
    <section class="aviso">
      <h2>{{ nombre }} no está disponible en este momento</h2>
      <p>Puedes seguir usando el resto del portal mientras se restablece.</p>
      <button (click)="reintentar()">Reintentar</button>
      <a routerLink="/">Ir al inicio</a>
    </section>
  `,
  styles: `
    .aviso {
      max-width: 40rem;
      padding: 1rem 1.5rem;
      border: 1px solid var(--color-borde);
      border-left: 4px solid #b54708;
      background: #fffaeb;
    }
    a {
      margin-left: 1rem;
    }
  `,
})
export class RemotoNoDisponible {
  protected readonly nombre: string =
    inject(ActivatedRoute).snapshot.data['nombre'] ?? 'Este módulo';

  protected reintentar() {
    window.location.reload();
  }
}