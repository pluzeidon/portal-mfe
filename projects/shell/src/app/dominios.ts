export interface Dominio {
  clave: string;
  etiqueta: string;
  ruta: string;
  titulo: string;
  descripcion: string;
}

export const DOMINIOS: Dominio[] = [
  {
    clave: 'polizas',
    etiqueta: 'Pólizas',
    ruta: '/polizas',
    titulo: 'Mis pólizas',
    descripcion: 'Consulta tus coberturas y elige la póliza con la que quieres trabajar.',
  },
  {
    clave: 'siniestros',
    etiqueta: 'Siniestros',
    ruta: '/siniestros',
    titulo: 'Reportar un siniestro',
    descripcion: 'Registra un siniestro sobre tu póliza activa y consulta tus reportes.',
  },
  {
    clave: 'cotizador',
    etiqueta: 'Cotizador',
    ruta: '/cotizador',
    titulo: 'Cotizar un seguro',
    descripcion: 'Calcula una prima estimada con los productos disponibles en tu país.',
  },
];