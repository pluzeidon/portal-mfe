import { createRoot, type Root } from 'react-dom/client';
import { Cotizador } from './Cotizador';
import type { ContextoCotizador, CotizacionGenerada } from './contrato';
import { INFO } from './info';

export { INFO };

const ESTILOS = `
  :host {
    display: block;
  }
  .cotizador {
    max-width: 36rem;
  }
  h2 {
    margin-top: 0;
    color: var(--color-primario, #1a4f8b);
  }
  label {
    display: block;
    margin: 0.75rem 0;
  }
  select,
  input {
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-height: var(--alto-tactil, 2.75rem);
    margin-top: 0.25rem;
    padding: 0.5rem;
    border: 1px solid var(--color-borde, #d0d7de);
    border-radius: var(--radio, 0.5rem);
    font: inherit;
  }
  button {
    min-height: var(--alto-tactil, 2.75rem);
    padding: 0 1rem;
    border: 0;
    border-radius: var(--radio, 0.5rem);
    background: var(--color-primario, #1a4f8b);
    color: white;
    font: inherit;
    cursor: pointer;
  }
  .resultado {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.25rem 1rem;
    margin-top: 1rem;
    padding: 1rem;
    border-radius: var(--radio, 0.5rem);
    background: var(--color-resaltado, #e8f0fe);
  }
  .resultado dd {
    margin: 0;
    text-align: right;
  }
  .nota {
    font-size: 0.85rem;
    opacity: 0.75;
  }
`;

class MfeCotizador extends HTMLElement {
  #raiz: Root | null = null;
  #contexto: ContextoCotizador | null = null;

  /** Entrada: el shell asigna el contexto como propiedad */
  set contexto(valor: ContextoCotizador) {
    this.#contexto = valor;
    this.#dibujar();
  }

  get contexto(): ContextoCotizador | null {
    return this.#contexto;
  }

  connectedCallback() {
    const sombra = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
    sombra.innerHTML = `<style>${ESTILOS}</style><div></div>`;
    this.#raiz = createRoot(sombra.querySelector('div')!);
    this.#dibujar();
  }

  disconnectedCallback() {
    this.#raiz?.unmount();
    this.#raiz = null;
  }

  #dibujar() {
    if (!this.#raiz || !this.#contexto) {
      return;
    }
    this.#raiz.render(
      <Cotizador
        contexto={this.#contexto}
        alCotizar={(cotizacion: CotizacionGenerada) =>
          // Salida: el cotizador avisa con un evento estándar del navegador
          this.dispatchEvent(
            new CustomEvent('cotizacion-generada', { detail: cotizacion, bubbles: true, composed: true }),
          )
        }
      />,
    );
  }
}

if (!customElements.get('mfe-cotizador')) {
  customElements.define('mfe-cotizador', MfeCotizador);
}