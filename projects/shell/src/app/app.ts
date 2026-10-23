import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MfeBoundary, PortalContext, Sesion } from '@portal/context';
import { SHELL_INFO } from './shell-info';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MfeBoundary],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly contexto = inject(PortalContext);
  protected readonly sesion = inject(Sesion);
  protected readonly info = SHELL_INFO;
}