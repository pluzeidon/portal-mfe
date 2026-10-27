# ADR 0002: Host dinámico con manifiesto filtrado por orígenes permitidos

- Estado: Aceptada
- Fecha: 2026-10-20 (filtro de orígenes: 2026-10-22)

## Contexto

Si las ubicaciones de los micro frontends se fijan al compilar el shell, publicar o revertir un dominio obliga a recompilar el shell. Pero un archivo que decide qué código se ejecuta en el portal también es un **punto de ataque**.

## Decisión

- El shell es un **host dinámico**: al arrancar lee `federation.manifest.json`, que asocia cada micro frontend con la URL de su punto de entrada.
- Un **solo manifiesto** contiene todos los micro frontends, sin importar su tecnología. El shell decide cómo cargar cada uno: si la URL termina en `remoteEntry.json`, con Native Federation; si no, como Web Component.
- Antes de inicializar la federación, `main.ts` **descarta las entradas cuyo origen no está en una lista de permitidos**. El propio origen del shell siempre está permitido, lo que soporta el despliegue de un solo origen en Azure.
- En Azure, las URLs del manifiesto son rutas relativas al sitio (`/mfe/polizas/1.0.0/remoteEntry.json`).

## Alternativas consideradas

| Alternativa | Por qué se descartó |
|---|---|
| URLs fijas en el build del shell | Cada publicación de un dominio exige recompilar el shell |
| Registro de micro frontends como servicio | Es la evolución natural, pero excede el alcance de una PoC |

## Consecuencias

- Publicar o revertir un dominio es cambiar **una línea** del manifiesto.
- El manifiesto se vuelve un **activo crítico**: en producción debe protegerse con permisos de escritura restringidos, Content Security Policy e integridad de subrecursos (SRI), que Native Federation v4 soporta.
- La lista de orígenes permitidos vive en el código del shell: agregar un origen nuevo exige republicar el shell, lo cual es intencional.
