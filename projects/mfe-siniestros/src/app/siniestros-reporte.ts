import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FechaLocalPipe, PortalContext, Sesion } from '@portal/context';
import { ReportesStore } from './reportes.store';

@Component({
  selector: 'siniestros-reporte',
  imports: [ReactiveFormsModule, RouterLink, FechaLocalPipe],
  template: `
    <h2>Reportar un siniestro</h2>

    @if (contexto.polizaActiva(); as poliza) {
      <form [formGroup]="formulario" (ngSubmit)="enviar()">
        <p><strong>Póliza:</strong> {{ poliza.numero }} · {{ poliza.producto }}</p>
        <p><strong>Asegurado:</strong> {{ sesion.usuario()?.nombre ?? 'sin sesión' }}</p>

        <label>
          {{ contexto.mercado().documentoFiscal.nombre }}
          <input
            type="text"
            formControlName="documento"
            [placeholder]="'Ejemplo: ' + contexto.mercado().documentoFiscal.ejemplo"
          />
        </label>
        @if (formulario.controls.documento.invalid && formulario.controls.documento.touched) {
          <p class="error">
            Formato no válido. Ejemplo: {{ contexto.mercado().documentoFiscal.ejemplo }}
          </p>
        }

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
      <table class="responsiva" role="table">
        <thead role="rowgroup">
          <tr role="row">
            <th role="columnheader">Folio</th>
            <th role="columnheader">Póliza</th>
            <th role="columnheader">Documento</th>
            <th role="columnheader">Fecha</th>
            <th role="columnheader">Descripción</th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          @for (reporte of store.reportes(); track reporte.folio) {
            <tr role="row">
              <td role="cell" data-etiqueta="Folio">{{ reporte.folio }}</td>
              <td role="cell" data-etiqueta="Póliza">{{ reporte.poliza }}</td>
              <td role="cell" data-etiqueta="Documento">{{ reporte.documento }}</td>
              <td role="cell" data-etiqueta="Fecha">
                {{ reporte.fecha | fechaLocal: contexto.mercado().locale }}
              </td>
              <td role="cell" data-etiqueta="Descripción">{{ reporte.descripcion }}</td>
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
    .error {
      margin-top: -0.5rem;
      color: #b42318;
      font-size: 0.9rem;
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
    documento: [''],
    fecha: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor() {
    // Cuando cambia el mercado, cambia la regla de validación del documento fiscal
    effect(() => {
      const { patron } = this.contexto.mercado().documentoFiscal;
      const documento = this.formulario.controls.documento;
      documento.setValidators([Validators.required, Validators.pattern(new RegExp(patron, 'i'))]);
      documento.reset('');
    });
  }

  protected enviar() {
    const poliza = this.contexto.polizaActiva();
    if (!poliza || this.formulario.invalid) {
      return;
    }

    const folio = `SIN-${Date.now().toString().slice(-6)}`;
    const { documento, fecha, descripcion } = this.formulario.getRawValue();

    this.store.agregar({
      folio,
      poliza: poliza.numero,
      documento: documento.toUpperCase(),
      fecha,
      descripcion,
    });
    this.ultimoFolio.set(folio);
    this.formulario.reset();
  }
}