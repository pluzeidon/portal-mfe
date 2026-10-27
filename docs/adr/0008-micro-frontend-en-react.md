# ADR 0008: Micro frontend en otro framework como Web Component

- Estado: Aceptada
- Fecha: 2026-10-25

## Contexto

Hay situaciones de negocio que llevan a convivir con otro framework: una adquisición, un equipo con otro stack o una migración gradual. Mezclar frameworks **como regla general es un antipatrón**, y el equipo de Angular lo desaconseja. La pregunta es si la arquitectura lo soporta cuando hace falta, y a qué costo.

## Decisión

- El dominio **Cotizador** se construye con **React y Vite**, la herramienta estándar de su ecosistema, con su propio `package.json`.
- Se publica como **Web Component** (`<mfe-cotizador>`), un estándar del navegador. El shell no sabe que adentro hay React.
- **Contrato del navegador, sin frameworks:**
  - Entrada: la propiedad `contexto`, con solo `mercado` (código, nombre y `locale`) y el nombre del usuario. Principio de mínimo privilegio.
  - Salida: el evento `cotizacion-generada` (`bubbles` y `composed`).
- **Shadow DOM** para aislar estilos; los tokens de diseño lo atraviesan como variables CSS.
- Un componente anfitrión en el shell (`CotizadorHost`) carga el módulo con `import()`, traduce el contexto al contrato y reutiliza el aviso de falla del [ADR 0010](0010-resiliencia-de-carga.md).
- El Cotizador aparece en el **mismo manifiesto**, con los mismos guards, el mismo versionado y la etiqueta "React" en Rayos X.
- **React no se comparte**: viaja dentro del micro frontend.

## Alternativas consideradas

| Alternativa | Por qué se descartó |
|---|---|
| Compartir React con federación | Con un solo micro frontend en React, la complejidad no se justifica |
| Pasar objetos de Angular al Web Component | Acopla el contrato a un framework |
| Servidor de desarrollo de Vite dentro del shell | Su recarga en caliente solo funciona en su propia página; se usa `vite build --watch` |

## Consecuencias

- **Costo medible:** el Cotizador pesa 78.56 kB comprimidos, casi todo React, contra unos pocos kB de código propio en los remotes de Angular.
- El contrato existe en **dos copias** (shell y Cotizador): deuda técnica deliberada. Hoy la mitiga una prueba de Playwright que verifica el contrato en las dos direcciones; en producción se publicaría como un paquete de tipos compartido.
- Un equipo nuevo con cualquier framework solo necesita producir un Web Component que respete el contrato.
- Con varios micro frontends en React, convendría compartir React con federación.
