import { CodigoMercado, Poliza } from '@portal/context';

export const POLIZAS_POR_MERCADO: Record<CodigoMercado, Poliza[]> = {
  MX: [
    { numero: 'GMM-2026-0001', producto: 'Gastos Médicos Mayores', mercado: 'MX', vigenteHasta: '2027-03-31', estatus: 'Vigente', primaAnual: 38450, moneda: 'MXN' },
    { numero: 'AUT-2026-0457', producto: 'Auto Amplia', mercado: 'MX', vigenteHasta: '2026-11-15', estatus: 'Por renovar', primaAnual: 14250.5, moneda: 'MXN' },
    { numero: 'VID-2025-1120', producto: 'Vida Individual en dólares', mercado: 'MX', vigenteHasta: '2030-01-01', estatus: 'Vigente', primaAnual: 1850, moneda: 'USD' },
  ],
  CO: [
    { numero: 'SAL-2026-3301', producto: 'Salud Familiar', mercado: 'CO', vigenteHasta: '2027-01-31', estatus: 'Vigente', primaAnual: 4850000, moneda: 'COP' },
    { numero: 'AUT-2026-7712', producto: 'Autos Todo Riesgo', mercado: 'CO', vigenteHasta: '2026-12-10', estatus: 'Por renovar', primaAnual: 2350000, moneda: 'COP' },
  ],
  ES: [
    { numero: 'SAN-2026-0042', producto: 'Seguro de Salud', mercado: 'ES', vigenteHasta: '2027-02-28', estatus: 'Vigente', primaAnual: 1240.8, moneda: 'EUR' },
    { numero: 'HOG-2026-0815', producto: 'Hogar', mercado: 'ES', vigenteHasta: '2027-05-31', estatus: 'Vigente', primaAnual: 315.4, moneda: 'EUR' },
  ],
};