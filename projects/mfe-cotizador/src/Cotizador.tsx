import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { ContextoCotizador, CotizacionGenerada } from './contrato';
import { TARIFAS } from './tarifas';

interface Props {
  contexto: ContextoCotizador;
  alCotizar: (cotizacion: CotizacionGenerada) => void;
}

interface Resultado {
  producto: string;
  primaNeta: number;
  impuesto: number;
  total: number;
}

export function Cotizador({ contexto, alCotizar }: Props) {
  const { mercado, usuario } = contexto;
  const tarifa = TARIFAS[mercado.codigo] ?? TARIFAS.MX;

  const [producto, setProducto] = useState(tarifa.productos[0].clave);
  const [suma, setSuma] = useState(tarifa.sumaSugerida);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  // Al cambiar de mercado cambian el catálogo y la moneda: la cotización anterior ya no aplica
  useEffect(() => {
    setProducto(tarifa.productos[0].clave);
    setSuma(tarifa.sumaSugerida);
    setResultado(null);
  }, [tarifa]);

  // La misma API Intl que usan los micro frontends de Angular
  const dinero = useMemo(
    () => new Intl.NumberFormat(mercado.locale, { style: 'currency', currency: tarifa.moneda }),
    [mercado.locale, tarifa.moneda],
  );

  function cotizar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const elegido = tarifa.productos.find((p) => p.clave === producto) ?? tarifa.productos[0];
    const primaNeta = Math.round(suma * elegido.tasa * 100) / 100;
    const impuesto = Math.round(primaNeta * tarifa.impuesto * 100) / 100;
    const total = primaNeta + impuesto;

    setResultado({ producto: elegido.nombre, primaNeta, impuesto, total });
    alCotizar({ producto: elegido.nombre, total, moneda: tarifa.moneda, mercado: mercado.codigo });
  }

  return (
    <section className="cotizador">
      <h2>Cotiza tu seguro</h2>
      <p>
        Productos disponibles en {mercado.nombre}
        {usuario ? ` para ${usuario.nombre}` : ''}.
      </p>

      <form onSubmit={cotizar}>
        <label>
          Producto
          <select value={producto} onChange={(e) => setProducto(e.target.value)}>
            {tarifa.productos.map((p) => (
              <option key={p.clave} value={p.clave}>
                {p.nombre}
              </option>
            ))}
          </select>
        </label>

        <label>
          Suma asegurada ({tarifa.moneda})
          <input
            type="number"
            min={1}
            step="any"
            value={suma}
            onChange={(e) => setSuma(Number(e.target.value))}
          />
        </label>

        <button type="submit">Cotizar</button>
      </form>

      {resultado && (
        <dl className="resultado">
          <dt>Producto</dt>
          <dd>{resultado.producto}</dd>
          <dt>Prima neta</dt>
          <dd>{dinero.format(resultado.primaNeta)}</dd>
          <dt>Impuesto (simulado, {Math.round(tarifa.impuesto * 100)} %)</dt>
          <dd>{dinero.format(resultado.impuesto)}</dd>
          <dt>Total</dt>
          <dd>
            <strong>{dinero.format(resultado.total)}</strong>
          </dd>
        </dl>
      )}

      <p className="nota">Tarifas e impuestos simulados para la demostración.</p>
    </section>
  );
}