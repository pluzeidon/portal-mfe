import { Pipe, PipeTransform } from '@angular/core';

/** Formatea un importe en SU moneda, con las reglas de escritura del mercado. */
@Pipe({ name: 'importe' })
export class ImportePipe implements PipeTransform {
  transform(valor: number, moneda: string, locale: string): string {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: moneda }).format(valor);
  }
}

/** Formatea una fecha ISO (AAAA-MM-DD) con las reglas del mercado. */
@Pipe({ name: 'fechaLocal' })
export class FechaLocalPipe implements PipeTransform {
  transform(fechaIso: string, locale: string): string {
    const [anio, mes, dia] = fechaIso.split('-').map(Number);
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(anio, mes - 1, dia));
  }
}