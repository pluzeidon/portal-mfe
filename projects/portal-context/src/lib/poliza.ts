import { CodigoMercado } from './mercado';

export interface Poliza {
  numero: string;
  producto: string;
  mercado: CodigoMercado;
  vigenteHasta: string; // Formato ISO: AAAA-MM-DD
  estatus: 'Vigente' | 'Por renovar';
  primaAnual: number;
  moneda: string; // Código ISO 4217: MXN, USD, COP, EUR
}