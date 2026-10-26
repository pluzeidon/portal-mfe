import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FechaLocalPipe, ImportePipe, PortalContext, Sesion } from '@portal/context';
import { POLIZAS_POR_MERCADO } from './polizas.data';

@Component({
  selector: 'polizas-lista',
  imports: [ImportePipe, FechaLocalPipe],
  template: `
    <h2>Mis pólizas</h2>
    <p>
      Hola, {{ sesion.usuario()?.nombre ?? 'sin sesión' }}.
      Estas son tus pólizas en {{ contexto.mercado().nombre }}.
    </p>

    <table class="responsiva" role="table">
      <thead role="rowgroup">
        <tr role="row">
          <th role="columnheader">Número</th>
          <th role="columnheader">Producto</th>
          <th role="columnheader">Prima anual</th>
          <th role="columnheader">Vigente hasta</th>
          <th role="columnheader">Estatus</th>
          <th role="columnheader"><span class="solo-lectores">Acciones</span></th>
        </tr>
      </thead>
      <tbody role="rowgroup">
        @for (poliza of polizas(); track poliza.numero) {
          <tr role="row" [class.activa]="contexto.polizaActiva()?.numero === poliza.numero">
            <td role="cell" data-etiqueta="Número">{{ poliza.numero }}</td>
            <td role="cell" data-etiqueta="Producto">{{ poliza.producto }}</td>
            <td role="cell" data-etiqueta="Prima anual">
              {{ poliza.primaAnual | importe: poliza.moneda : contexto.mercado().locale }}
            </td>
            <td role="cell" data-etiqueta="Vigente hasta">
              {{ poliza.vigenteHasta | fechaLocal: contexto.mercado().locale }}
            </td>
            <td role="cell" data-etiqueta="Estatus">{{ poliza.estatus }}</td>
            <td role="cell" class="acciones">
              @if (contexto.polizaActiva()?.numero !== poliza.numero) {
                <button type="button" (click)="contexto.seleccionarPoliza(poliza)">
                  Usar como póliza activa
                </button>
              } @else if (contexto.dominioDisponible('siniestros')) {
                <button type="button" (click)="reportarSiniestro()">Reportar siniestro</button>
              } @else {
                <span>Póliza activa</span>
              }
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    .activa {
      background: var(--color-resaltado, #e8f0fe);
      font-weight: 600;
    }
  `,
})
export class PolizasLista {
  protected readonly contexto = inject(PortalContext);
  protected readonly sesion = inject(Sesion);
  private readonly router = inject(Router);

  protected readonly polizas = computed(() => POLIZAS_POR_MERCADO[this.contexto.mercado().codigo]);

  protected reportarSiniestro() {
    this.router.navigateByUrl('/siniestros');
  }
}