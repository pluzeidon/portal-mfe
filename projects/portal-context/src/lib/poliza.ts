export interface Poliza {
  numero: string;
  producto: string;
  vigenteHasta: string;
  estatus: 'Vigente' | 'Por renovar';
}