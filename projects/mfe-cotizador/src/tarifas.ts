export interface Producto {
  clave: string;
  nombre: string;
  tasa: number;
}

export interface Tarifa {
  moneda: string;
  sumaSugerida: number;
  impuesto: number;
  productos: Producto[];
}

/** Tarifas e impuestos ficticios por mercado. En producción vendrían de la API del cotizador. */
export const TARIFAS: Record<string, Tarifa> = {
  MX: {
    moneda: 'MXN',
    sumaSugerida: 500000,
    impuesto: 0.16,
    productos: [
      { clave: 'gmm', nombre: 'Gastos Médicos Mayores', tasa: 0.012 },
      { clave: 'auto', nombre: 'Auto Amplia', tasa: 0.035 },
    ],
  },
  CO: {
    moneda: 'COP',
    sumaSugerida: 200000000,
    impuesto: 0.19,
    productos: [
      { clave: 'salud', nombre: 'Salud Familiar', tasa: 0.01 },
      { clave: 'autos', nombre: 'Autos Todo Riesgo', tasa: 0.03 },
    ],
  },
  ES: {
    moneda: 'EUR',
    sumaSugerida: 150000,
    impuesto: 0.08,
    productos: [
      { clave: 'salud', nombre: 'Seguro de Salud', tasa: 0.008 },
      { clave: 'hogar', nombre: 'Hogar', tasa: 0.002 },
    ],
  },
};