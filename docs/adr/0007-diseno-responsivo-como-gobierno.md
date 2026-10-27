# ADR 0007: Diseño responsivo como regla de gobierno verificada

- Estado: Aceptada
- Fecha: 2026-10-23

## Contexto

El portal debe verse bien en escritorio y en celular. En un portal de micro frontends, si cada equipo decide su propio diseño móvil, el resultado es inconsistente: un dominio cambia a modo celular en un ancho y otro en uno distinto.

## Decisión

- **Un único punto de quiebre** para todo el portal: 40rem (640 px), documentado en los estilos globales del shell.
- **Tokens de diseño** como variables CSS: colores, espaciado, radio y alto táctil mínimo de 2.75rem (44 px).
- **Patrones compartidos** en los estilos globales: tabla responsiva (`class="responsiva"` con `data-etiqueta` por celda, que se convierte en tarjetas en el celular) y controles táctiles.
- **Diseño "primero celular"**: las reglas base son para pantallas chicas y las de escritorio se agregan con `min-width`.
- **Verificación automática**: todas las pruebas de Playwright corren en escritorio y en un Pixel 7 emulado, y una prueba recorre las pantallas para comprobar que **ninguna se desborda a lo ancho**.
- Atributos de accesibilidad básicos: `role` explícitos en tablas, `aria-expanded` en el menú y `lang="es"` en los documentos.

## Alternativas consideradas

| Alternativa | Por qué se descartó |
|---|---|
| Cada equipo define su diseño móvil | Inconsistencia visual entre dominios |
| Revisión manual del diseño | No escala y no detecta regresiones |
| Design system completo como librería | Es la evolución natural, pero excede el alcance de la PoC |

## Consecuencias

- Un equipo puede hacer su pantalla responsiva sin escribir CSS móvil: usa el patrón compartido.
- Las variables CSS **atraviesan el Shadow DOM**, así que el micro frontend en React respeta los mismos tokens.
- Si un equipo rompe el diseño móvil, la prueba de desborde falla e indica qué pantalla.
- Los estilos globales del shell afectan a todos los dominios: cambiarlos es una decisión de plataforma.
