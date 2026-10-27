# ADR 0005: Comunicación entre dominios con contexto compartido y URL

- Estado: Aceptada
- Fecha: 2026-10-22

## Contexto

La póliza elegida en Pólizas debe llegar a Siniestros, y el encabezado del shell debe mostrarla. La forma de comunicar dominios define cuánto se acoplan los equipos.

## Decisión

En orden de preferencia:

1. **URL** para navegar entre dominios (`/siniestros`). Pólizas sabe que la ruta existe, pero no importa código de Siniestros.
2. **Contexto de plataforma con signals** (`PortalContext` en `@portal/context`) para el estado que más de un dominio necesita: póliza activa, mercado y Rayos X. Cada signal es privado y se expone en solo lectura; solo se modifica por métodos.
3. **Propiedades y eventos del navegador** para micro frontends en otro framework ([ADR 0008](0008-micro-frontend-en-react.md)).

Los **contratos** (tipos como `Poliza` y `Mercado`) viven en la librería compartida. Los **datos** de cada dominio viven en su micro frontend.

**Prohibido:** importar código de otro micro frontend, o crear un store global sin dueño.

## Alternativas consideradas

| Alternativa | Por qué se descartó |
|---|---|
| Store global (por ejemplo, NgRx compartido) | Todos los equipos dependen de su forma y de su ciclo de cambios |
| `CustomEvent` del navegador entre dominios Angular | Pierde el tipado estricto; se reserva para la frontera con otros frameworks |

## Consecuencias

- Tipado estricto y sin manejo de suscripciones entre dominios Angular.
- Las reglas de negocio transversales viven en un solo lugar. Ejemplo: al cambiar de mercado, el contexto limpia la póliza activa, y ningún dominio puede olvidar esa regla.
- La librería compartida es un **contrato**: sus cambios afectan a todos los equipos y deben versionarse y probarse con cuidado.
