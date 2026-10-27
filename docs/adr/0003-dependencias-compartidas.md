# ADR 0003: Dependencias compartidas como singleton estricto

- Estado: Aceptada
- Fecha: 2026-10-20

## Contexto

Cada micro frontend se compila por separado. Sin compartir dependencias, el usuario descargaría Angular una vez por micro frontend, y cada uno tendría **su propia instancia** de los servicios de la librería común: la sesión o la póliza activa no se verían entre aplicaciones.

## Decisión

- Compartir las dependencias de npm con `fromPackageJson({ singleton: true, strictVersion: true, requiredVersion: 'auto' })`, incluyendo todos los entry points de `@angular/*`.
- Compartir la librería del workspace `@portal/context` con `mappingsFromWorkspace({ singleton: true }).filter(['@portal/*'])`, declarando la intención explícitamente.
- `@portal/context` se mapea en `tsconfig.json` a **su código fuente** (`projects/portal-context/src/public-api.ts`), no a `dist/`.
- Excluir con `skip` lo que no se usa en runtime: los entry points de RxJS para pruebas y red, y las animaciones de Angular, que Angular 22 ya no instala.
- **La configuración de `shared` y `skip` es idéntica en todos los proyectos.**
- **Política de versión única** de Angular en todo el portal.

## Alternativas consideradas

| Alternativa | Por qué se descartó |
|---|---|
| Cada equipo elige su versión de Angular | Varias descargas de Angular, fallos sutiles de compatibilidad y estado duplicado |
| Compilar `@portal/context` como paquete | Obliga a compilar la librería en cada cambio y complica el singleton |

## Consecuencias

- Angular se descarga una sola vez. Verificado en la pestaña Network: un remote agrega solo su código propio.
- Hay una sola instancia de `PortalContext` y de `Sesion`. Verificado con una prueba de contador compartido entre shell y remote.
- La versión única de Angular la garantiza el repositorio: hay un solo `package.json` para todas las aplicaciones.
- `strictVersion` es la red de seguridad en tiempo de ejecución: un remote incompatible nunca usa en silencio otra versión; descarga su propia copia. Para Angular eso significa dos instancias, así que en producción se activaría `strict: { strictExternalCompatibility: true }` en `initFederation` para que el fallo sea explícito, junto con una validación de versiones en el pipeline.
- Los equipos **no** eligen su versión de Angular: la actualización mayor se hace en todo el portal a la vez.
- La excepción controlada para otra tecnología se documenta en el [ADR 0008](0008-micro-frontend-en-react.md).
