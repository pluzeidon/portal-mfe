# ADR 0004: Abstracción de sesión con Auth0 y modo simulado

- Estado: Aceptada
- Fecha: 2026-10-20

## Contexto

El usuario debe iniciar sesión una vez y todos los micro frontends deben conocerlo. Si cada micro frontend usara directamente el SDK de un proveedor, cambiar de proveedor (por ejemplo, de Auth0 a Microsoft Entra ID) obligaría a modificar todos los dominios. Además, las pruebas automáticas y la demo no deben depender de un servicio externo.

## Decisión

- `@portal/context` define una **clase abstracta `Sesion`** con signals de solo lectura (`usuario`, `autenticado`) y las operaciones `estaAutenticado`, `iniciarSesion` y `cerrarSesion`.
- Hay dos implementaciones: `SesionAuth0`, sobre `@auth0/auth0-angular` (Authorization Code con PKCE), y `SesionSimulada`.
- **Solo el shell elige la implementación.** Los micro frontends dependen únicamente de `Sesion`.
- El modo simulado se activa con `?sesion=simulada` y se recuerda en `sessionStorage` mientras dure la pestaña.
- Un **guard** en el shell exige sesión antes de descargar el código de un dominio.
- `useRefreshTokens` con `cacheLocation: 'localstorage'`, para que la sesión sobreviva al recargar aunque el navegador bloquee cookies de terceros.

## Alternativas consideradas

| Alternativa | Por qué se descartó |
|---|---|
| Inyectar `AuthService` de Auth0 en cada componente | Acopla todo el portal a un proveedor |
| Cada micro frontend con su propio cliente OIDC | Varios logins y varias fuentes de verdad del usuario |

## Consecuencias

- Cambiar de proveedor es escribir **una implementación nueva** de `Sesion`; ningún micro frontend cambia.
- **El guard es solo experiencia de usuario: la autorización real corresponde al backend.**
- Los tokens en `localStorage` quedan expuestos ante un XSS. Es aceptable en la PoC; en producción se usaría el **patrón BFF** en ASP.NET Core, sin tokens en el navegador.
- El modo simulado activable por URL es exclusivo de la PoC; en producción se excluiría del build.
