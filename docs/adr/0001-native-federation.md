# ADR 0001: Native Federation v4 en lugar de Module Federation con webpack

- Estado: Aceptada
- Fecha: 2026-10-20

## Contexto

El ejemplo de referencia (Auth0, 2022) usa Module Federation sobre webpack 5 con Angular 12–13. Desde Angular 17, el CLI compila por defecto con el **ApplicationBuilder basado en esbuild**, que no incluye Module Federation. El proyecto parte de Angular 22.

## Decisión

Usar **Native Federation v4** (`@angular-architects/native-federation`, versión alineada con Angular 22.2), que:

- delega en el ApplicationBuilder y en esbuild del CLI estándar;
- se basa en estándares del navegador: módulos ES e *import maps*;
- conserva el modelo mental de Module Federation: host, remotes, `exposes`, `shared` y `loadRemoteModule`.

Se usa la **API v4**: configuración en `federation.config.mjs`, dependencias con `fromPackageJson`, y el `loadRemoteModule` que devuelve `initFederation`. Las rutas lo reciben como parámetro, y además queda registrado en la inyección de dependencias (`MODULE_LOADER`) para componentes que necesiten cargar un remote fuera del router. El `loadRemoteModule` importado directamente está deprecado en v4.

## Alternativas consideradas

| Alternativa | Por qué se descartó |
|---|---|
| Module Federation con el builder de webpack | Obliga a usar el camino legado del CLI, más lento y sin las optimizaciones actuales |
| Module Federation con Rspack | Sale del flujo estándar del CLI y depende de integraciones de la comunidad |
| Aplicación modular con lazy loading | No permite publicar un dominio sin recompilar el portal, que es la hipótesis a validar |
| iframes | Aislamiento fuerte, pero mala integración visual, de ruteo y de estado |

## Consecuencias

- Se conservan las optimizaciones del CLI y la compatibilidad con SSR e hidratación a futuro.
- Native Federation es un proyecto de la comunidad, no del equipo de Angular, y cambió su API en la v4: la mayoría de los ejemplos en internet son de la v3.
- Librerías antiguas en CommonJS pueden dar problemas al compartirse.
- Existe un puente para cargar remotes de Module Federation en un host de Native Federation, lo que permite migraciones graduales.
