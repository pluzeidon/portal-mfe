/**
 * Contrato v1 entre el shell y el cotizador.
 * Debe ser idéntico a projects/mfe-cotizador/src/contrato.ts.
 * En producción se publicaría como un paquete de solo tipos compartido por ambos equipos.
 */
export interface ContextoCotizador {
  mercado: { codigo: string; nombre: string; locale: string };
  usuario: { nombre: string } | null;
}

export interface CotizacionGenerada {
  producto: string;
  total: number;
  moneda: string;
  mercado: string;
}