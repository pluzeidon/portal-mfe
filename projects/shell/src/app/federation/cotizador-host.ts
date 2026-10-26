import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { ImportePipe, MfeBoundary, PortalContext, Sesion } from '@portal/context';
import { cargarComponenteWeb, COMPONENTES_WEB } from './componentes-web';
import { ContextoCotizador, CotizacionGenerada } from './contrato-cotizador';
import { RemotoNoDisponible } from './remoto-no-disponible';

type Estado = 'cargando' | 'listo' | 'error';

@Component({
  selector: 'app-cotizador-host',
  imports: [MfeBoundary, RemotoNoDisponible, ImportePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    @switch (estado()) {
      @case ('cargando') {
        <p>Cargando el cotizador…</p>
      }
      @case ('error') {
        <app-remoto-no-disponible />
      }
      @case ('listo') {
        <mfe-boundary nombre="cotizador" tecnologia="React" [version]="version()" [origen]="origen">
          <mfe-cotizador
            [contexto]="contextoCotizador()"
            (cotizacion-generada)="alRecibirCotizacion($event)"
          ></mfe-cotizador>
        </mfe-boundary>

        @if (ultimaCotizacion(); as cotizacion) {
          <p class="aviso-shell">
            El shell recibió la cotización: {{ cotizacion.producto }} por
            {{ cotizacion.total | importe: cotizacion.moneda : contexto.mercado().locale }}.
          </p>
        }
      }
    }
  `,
  styles: `
    .aviso-shell {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      border-left: 4px solid var(--color-primario);
      background: var(--color-resaltado);
    }
  `,
})
export class CotizadorHost {
  protected readonly contexto = inject(PortalContext);
  private readonly sesion = inject(Sesion);
  private readonly url = inject(COMPONENTES_WEB)['cotizador'];

  protected readonly estado = signal<Estado>('cargando');
  protected readonly version = signal('?');
  protected readonly origen = this.url ? new URL(this.url, window.location.href).origin : '';
  protected readonly ultimaCotizacion = signal<CotizacionGenerada | null>(null);

  /** Entrada para el Web Component: solo lo que dice el contrato, nada de Angular */
  protected readonly contextoCotizador = computed<ContextoCotizador>(() => {
    const mercado = this.contexto.mercado();
    const usuario = this.sesion.usuario();
    return {
      mercado: { codigo: mercado.codigo, nombre: mercado.nombre, locale: mercado.locale },
      usuario: usuario ? { nombre: usuario.nombre } : null,
    };
  });

  constructor() {
    if (!this.url) {
      this.estado.set('error');
      return;
    }
    cargarComponenteWeb(this.url)
      .then((modulo) => {
        this.version.set(modulo.INFO?.version ?? '?');
        this.estado.set('listo');
      })
      .catch((error) => {
        console.error('[mfe:cotizador] No se pudo cargar', error);
        this.estado.set('error');
      });
  }

  /** Salida del Web Component: un evento estándar del navegador */
  protected alRecibirCotizacion(evento: Event) {
    this.ultimaCotizacion.set((evento as CustomEvent<CotizacionGenerada>).detail);
  }
}