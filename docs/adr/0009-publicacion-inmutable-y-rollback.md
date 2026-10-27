# ADR 0009: Publicación inmutable por versiones y rollback por manifiesto

- Estado: Aceptada
- Fecha: 2026-10-23 (hosting local) · 2026-10-25 (Azure)

## Contexto

Levantar aplicaciones en puertos distintos **no prueba** el despliegue independiente. Hay que demostrar que un dominio se compila y publica sin tocar los demás, y que se puede revertir de forma confiable.

## Decisión

- Cada publicación compila **solo esa aplicación**, en modo producción, con su propia herramienta (Angular CLI o Vite), según la configuración común de `scripts/apps.mjs`.
- Cada versión se publica en una **carpeta propia e inmutable**: los scripts se niegan a sobrescribir una versión existente.
- La publicación actualiza **solo la entrada de ese micro frontend** en el manifiesto. Publicar el shell conserva el manifiesto vigente.
- El **rollback** solo cambia el manifiesto: no compila ni sube código.
- La versión se escribe en el código antes de compilar, para que Rayos X la muestre.
- Dos destinos con el mismo proceso:

| | Hosting local | Azure Storage |
|---|---|---|
| Orígenes | Cuatro puertos, con CORS | **Un solo origen** con rutas `/mfe/<nombre>/<versión>/` |
| Publicar | Copiar a `hosting/` | Subir con la CLI de Azure |
| Manifiesto vigente | Archivo en disco | Se lee **del sitio publicado** |
| Caché | Desactivada en el servidor | `Cache-Control: no-cache` en todos los archivos |

## Alternativas consideradas

| Alternativa | Por qué se descartó |
|---|---|
| Vercel, Render o Static Web Apps | Cada despliegue reemplaza el sitio completo; habría que rediseñar el versionado |
| Sobrescribir la versión publicada | Elimina la posibilidad de un rollback confiable |

## Consecuencias

- Publicar un dominio no recompila el shell ni los demás dominios. Rollback en menos de un segundo.
- Leer el manifiesto del sitio publicado evita desincronizarse al publicar desde dos máquinas.
- Costo en Azure: centavos al mes, o cero dentro de los servicios gratuitos.
- Pendiente para producción: **pipeline de CI/CD** por micro frontend, **identidad administrada** en lugar de la clave de la cuenta de Storage, caché permanente para los archivos con *hash* (solo el manifiesto, los `remoteEntry.json` y el `index.html` sin caché), y CDN.
