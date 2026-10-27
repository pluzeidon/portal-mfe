# ADR 0010: Carga resiliente de micro frontends desde el shell

- Estado: Aceptada
- Fecha: 2026-10-22

## Contexto

La federación convierte errores de compilación en **errores en tiempo de ejecución**. Sin protección, si un remote no está disponible el usuario ve una pantalla en blanco y decenas de errores en la consola.

## Decisión

- Toda carga de un micro frontend pasa por un helper del shell:
  - `cargarRemoto` para los remotes de Native Federation;
  - `cargarComponenteWeb` para los Web Components.
- Cada carga compite con un **tiempo límite de 5 segundos** (`Promise.race`).
- Ante cualquier falla (servidor caído, remote no inicializado, tiempo agotado o código con errores) se muestra el componente **`RemotoNoDisponible`**, dentro del portal, con el nombre del dominio, un botón **Reintentar** y un enlace al inicio.
- El aviso **vive en el shell**, porque un remote caído no puede mostrar nada.
- El error se registra en consola con el prefijo `[mfe:<nombre>]`, el punto donde en producción se enviaría a telemetría.
- **Reintentar** recarga la página: el shell registra los remotes una sola vez al arrancar, y Angular guarda en memoria las rutas ya cargadas.

## Alternativas consideradas

| Alternativa | Por qué se descartó |
|---|---|
| Manejo de errores en cada ruta | Duplica la lógica; el helper la concentra en un solo lugar |
| Reintento automático en segundo plano | Más complejo, y un remote caído suele seguir caído unos minutos |

## Consecuencias

- Un dominio caído no afecta a los demás: el encabezado, el menú y los otros dominios siguen operando.
- Si el usuario ya había abierto un dominio antes de la caída, su código sigue en memoria y continúa funcionando.
- Verificado con una prueba de Playwright que intercepta y cancela las peticiones a Siniestros.
- Cambiar el tiempo límite o agregar telemetría se hace en un solo lugar.
