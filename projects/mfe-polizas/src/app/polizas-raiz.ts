import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MfeBoundary } from '@portal/context';
import { MFE_INFO } from './mfe-info';

@Component({
  selector: 'polizas-raiz',
  imports: [RouterOutlet, MfeBoundary],
  template: `
    <mfe-boundary [nombre]="info.nombre" [version]="info.version" [origen]="info.origen">
      <router-outlet />
    </mfe-boundary>
  `,
})
export class PolizasRaiz {
  protected readonly info = MFE_INFO;
}