# ADR 0006: Tropicalización por mercado, con Intl

- Estado: Aceptada
- Fecha: 2026-10-23

## Contexto

El portal debe operar en varios países. Un enfoque común es un selector de país que cambia el símbolo de moneda de los importes; eso **muestra un dato falso**, porque convertir de país no convierte el importe de una póliza.

## Decisión

El **mercado** es un contrato en `@portal/context` que define cuatro cosas:

| Qué define | Ejemplo |
|---|---|
| **Catálogo** | Cada mercado ve sus propias pólizas y productos |
| **Formato** | `locale` (`es-MX`, `es-CO`, `es-ES`) para importes y fechas |
| **Reglas de negocio** | Documento fiscal con su validación: RFC, cédula o NIT, NIF o NIE |
| **Composición** | Qué dominios existen en cada país; el menú, el inicio y los guards se derivan de ahí |

- **La moneda es un dato de cada póliza**, no del mercado. Una póliza en USD vista en México se escribe con formato mexicano, pero sigue en dólares.
- Los formatos usan la **API `Intl` del navegador**, mediante dos pipes (`importe` y `fechaLocal`).
- Las fechas ISO se construyen con año, mes y día, para evitar el corrimiento de un día por zona horaria que provoca `new Date('AAAA-MM-DD')`.
- El mercado se recuerda en `sessionStorage`. Al cambiarlo, se limpia la póliza activa.

## Alternativas consideradas

| Alternativa | Por qué se descartó |
|---|---|
| Pipes `currency` y `date` de Angular | Dependen de `LOCALE_ID`, fijo al arrancar; cambiarlo exige recargar y compartir los datos regionales entre aplicaciones |
| Selector que cambia el símbolo de moneda | Muestra información incorrecta |
| Traducción de textos (i18n) | No aporta a la hipótesis con mercados de habla hispana |

## Consecuencias

- El cambio de mercado se refleja **en caliente** en todos los micro frontends, incluido el de React, que usa la misma API `Intl`.
- Un dominio que no opera en un país desaparece del menú **y** queda bloqueado por un guard: ocultar no basta.
- En producción, el mercado vendría del dominio, del perfil del usuario o del contrato del cliente; el selector es solo para la demo.
- La composición por mercado deja la puerta abierta a **versiones locales de un dominio** (por ejemplo, `siniestros-co`) con un manifiesto por país.
