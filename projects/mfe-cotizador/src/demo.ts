import './mfe-cotizador';
import type { ContextoCotizador } from './contrato';

const elemento = document.getElementById('cotizador') as HTMLElement & { contexto: ContextoCotizador };

elemento.contexto = {
  mercado: { codigo: 'MX', nombre: 'México', locale: 'es-MX' },
  usuario: { nombre: 'Usuario en modo aislado' },
};

elemento.addEventListener('cotizacion-generada', (evento) => {
  console.log('Cotización generada:', (evento as CustomEvent).detail);
});