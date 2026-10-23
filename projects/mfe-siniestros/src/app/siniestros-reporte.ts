import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PortalContext, Sesion } from '@portal/context';
import { ReportesStore } from './reportes.store';

@Component({
  selector: 'siniestros-reporte',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h2>Reportar un siniestro</h2>

    @if (contexto.polizaActiva(); as poliza) {
      <form [formGroup]="formulario" (ngSubmit)="enviar()">
        <p><strong>Póliza:</strong> {{ poliza.numero }} · {{ poliza.producto }}</p>
        <p><strong>Asegurado:</strong> {{ sesion.usuario()?.nombre ?? 'sin sesión' }}</p>

        <label>
          Fecha del siniestro
          <input type="date" formControlName="fecha" />
        </label>

        <label>
          ¿Qué pasó?
          <textarea formControlName="descripcion" rows="3"></textarea>
        </label>

        <button type="submit" [disabled]="formulario.invalid">Enviar reporte</button>
      </form>

      @if (ultimoFolio(); as folio) {
        <p class="confirmacion">Reporte registrado con folio <strong>{{ folio }}</strong>.</p>
      }
    } @else {
      <p>Primero elige una póliza activa en <a routerLink="/polizas">Pólizas</a>.</p>
    }

    @if (store.reportes().length > 0) {
      <h3>Reportes enviados</h3>
      <table>
        <thead>
          <tr>
            <th>Folio</th>
            <th>Póliza</th>
            <th>Fecha</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          @for (reporte of store.reportes(); track reporte.folio) {
            <tr>
              <td>{{ reporte.folio }}</td>
              <td>{{ reporte.poliza }}</td>
              <td>{{ reporte.fecha }}</td>
              <td>{{ reporte.descripcion }}</td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
  styles: `
    label {
      display: block;
      margin: 0.75rem 0;
    }
    input,
    textarea {
      display: block;
      width: 100%;
      max-width: 28rem;
      margin-top: 0.25rem;
    }
    .confirmacion {
      padding: 0.5rem;
      background: var(--color-resaltado, #e8f0fe);
    }
  `,
})
export class SiniestrosReporte {
  protected readonly contexto = inject(PortalContext);
  protected readonly sesion = inject(Sesion);
  protected readonly store = inject(ReportesStore);
  protected readonly ultimoFolio = signal<string | null>(null);

  private readonly fb = inject(FormBuilder);
  protected readonly formulario = this.fb.nonNullable.group({
    fecha: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected enviar() {
    const poliza = this.contexto.polizaActiva();
    if (!poliza || this.formulario.invalid) {
      return;
    }

    const folio = `SIN-${Date.now().toString().slice(-6)}`;
    const { fecha, descripcion } = this.formulario.getRawValue();

    this.store.agregar({ folio, poliza: poliza.numero, fecha, descripcion });
    this.ultimoFolio.set(folio);
    this.formulario.reset();
  }
}