import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PortalContext, Sesion } from '@portal/context';
import { POLIZAS } from './polizas.data';

@Component({
  selector: 'polizas-lista',
  template: `
    <h2>Mis pólizas <small>(nueva versión)</small></h2>
    <p>Hola, {{ sesion.usuario()?.nombre ?? 'sin sesión' }}. Estas son tus pólizas.</p>

    <table>
      <thead>
        <tr>
          <th>Número</th>
          <th>Producto</th>
          <th>Vigente hasta</th>
          <th>Estatus</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        @for (poliza of polizas; track poliza.numero) {
          <tr [class.activa]="contexto.polizaActiva()?.numero === poliza.numero">
            <td>{{ poliza.numero }}</td>
            <td>{{ poliza.producto }}</td>
            <td>{{ poliza.vigenteHasta }}</td>
            <td>{{ poliza.estatus }}</td>
            <td>
              @if (contexto.polizaActiva()?.numero === poliza.numero) {
                <button (click)="reportarSiniestro()">Reportar siniestro</button>
              } @else {
                <button (click)="contexto.seleccionarPoliza(poliza)">Usar como póliza activa</button>
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
  protected readonly polizas = POLIZAS;

  protected reportarSiniestro() {
    this.router.navigateByUrl('/siniestros');
  }
}