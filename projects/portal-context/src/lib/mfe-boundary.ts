import { Component, computed, inject, input } from '@angular/core';
import { PortalContext } from './portal-context';

const COLORES: Record<string, string> = {
  shell: '#8250df',
  polizas: '#1a7f37',
  siniestros: '#cf222e',
  cotizador: '#9a6700',
};

@Component({
  selector: 'mfe-boundary',
  template: `
    @if (contexto.rayosX()) {
      <span class="etiqueta">
        {{ nombre() }} · v{{ version() }} · {{ tecnologia() }} · {{ origenCorto() }}
      </span>
    }
    <ng-content />
  `,
  styles: `
    :host {
      display: block;
      position: relative;
    }
    :host(.activo) {
      outline: 3px dashed var(--mfe-color);
      outline-offset: -3px;
      padding-top: 1.75rem;
    }
    .etiqueta {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      padding: 0.15rem 0.5rem;
      background: var(--mfe-color);
      color: white;
      font: 600 0.75rem/1.5 monospace;
    }
  `,
  host: {
    '[class.activo]': 'contexto.rayosX()',
    '[style.--mfe-color]': 'color()',
  },
})
export class MfeBoundary {
  readonly nombre = input.required<string>();
  readonly version = input.required<string>();
  readonly origen = input.required<string>();
  readonly tecnologia = input('Angular');

  protected readonly contexto = inject(PortalContext);
  protected readonly color = computed(() => COLORES[this.nombre()] ?? '#57606a');
  protected readonly origenCorto = computed(() => this.origen().replace(/^https?:\/\//, ''));
}