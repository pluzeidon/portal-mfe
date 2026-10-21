import { Component, inject } from '@angular/core';
import { PortalContext, Sesion } from '@portal/context';

@Component({
  selector: 'polizas-lista',
  template: `
    <h2>Mis pólizas</h2>
    <p>Hola, {{ sesion.usuario()?.nombre ?? 'sin sesión' }}.</p>
    <p>Esta pantalla vive en el micro frontend de Pólizas (puerto 4201).</p>
    <p>Contador visto desde Pólizas: {{ contexto.contador() }}</p>
    <button (click)="contexto.incrementar()">Incrementar desde Pólizas</button>
  `,
})
export class PolizasLista {
  protected readonly contexto = inject(PortalContext);
  protected readonly sesion = inject(Sesion);
}