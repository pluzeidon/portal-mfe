import { Injectable, signal } from '@angular/core';

export interface ReporteSiniestro {
  folio: string;
  poliza: string;
  fecha: string;
  descripcion: string;
}

@Injectable({ providedIn: 'root' })
export class ReportesStore {
  private readonly _reportes = signal<ReporteSiniestro[]>([]);
  readonly reportes = this._reportes.asReadonly();

  agregar(reporte: ReporteSiniestro) {
    this._reportes.update((lista) => [reporte, ...lista]);
  }
}