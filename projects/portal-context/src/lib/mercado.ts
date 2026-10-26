export type CodigoMercado = 'MX' | 'CO' | 'ES';

export interface DocumentoFiscal {
  nombre: string;
  patron: string;
  ejemplo: string;
}

export interface Mercado {
  codigo: CodigoMercado;
  nombre: string;
  locale: string;
  documentoFiscal: DocumentoFiscal;
  dominios: readonly string[];
}

/**
 * Configuración por mercado. En producción vendría de un servicio de
 * configuración por entorno; aquí vive en código para la PoC.
 * Los patrones son simplificados: validan el formato, no el dígito verificador.
 */
export const MERCADOS: Record<CodigoMercado, Mercado> = {
  MX: {
    codigo: 'MX',
    nombre: 'México',
    locale: 'es-MX',
    documentoFiscal: { nombre: 'RFC', patron: '^[A-ZÑ&]{3,4}\\d{6}[A-Z0-9]{3}$', ejemplo: 'GODE561231GR8' },
    dominios: ['polizas', 'siniestros'],
  },
  CO: {
    codigo: 'CO',
    nombre: 'Colombia',
    locale: 'es-CO',
    documentoFiscal: { nombre: 'Cédula o NIT', patron: '^\\d{6,10}(-\\d)?$', ejemplo: '1020304050' },
    dominios: ['polizas', 'siniestros'],
  },
  ES: {
    codigo: 'ES',
    nombre: 'España',
    locale: 'es-ES',
    documentoFiscal: { nombre: 'NIF o NIE', patron: '^([XYZ]\\d{7}|\\d{8})[A-Z]$', ejemplo: '12345678Z' },
    dominios: ['polizas'],
  },
};