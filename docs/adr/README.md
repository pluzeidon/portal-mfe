# Decisiones de arquitectura (ADRs)

Cada ADR registra una decisión: el contexto, las alternativas evaluadas, lo que se decidió y **las consecuencias que se aceptan**. Una decisión no se borra cuando cambia: se marca como reemplazada y se escribe una nueva.

| ADR | Decisión | Estado |
|---|---|---|
| [0001](0001-native-federation.md) | Native Federation v4 en lugar de Module Federation con webpack | Aceptada |
| [0002](0002-host-dinamico-y-origenes-permitidos.md) | Host dinámico con manifiesto filtrado por orígenes permitidos | Aceptada |
| [0003](0003-dependencias-compartidas.md) | Dependencias compartidas como singleton estricto | Aceptada |
| [0004](0004-abstraccion-de-sesion.md) | Abstracción de sesión con Auth0 y modo simulado | Aceptada |
| [0005](0005-comunicacion-entre-dominios.md) | Comunicación entre dominios: contexto con signals y URL | Aceptada |
| [0006](0006-tropicalizacion-por-mercado.md) | Tropicalización por mercado, con `Intl` | Aceptada |
| [0007](0007-diseno-responsivo-como-gobierno.md) | Diseño responsivo como regla de gobierno verificada | Aceptada |
| [0008](0008-micro-frontend-en-react.md) | Micro frontend en otro framework como Web Component | Aceptada |
| [0009](0009-publicacion-inmutable-y-rollback.md) | Publicación inmutable por versiones y rollback por manifiesto | Aceptada |
| [0010](0010-resiliencia-de-carga.md) | Carga resiliente de micro frontends desde el shell | Aceptada |

## Formato

```markdown
# ADR NNNN: Título
- Estado: Propuesta | Aceptada | Reemplazada por NNNN
- Fecha: AAAA-MM-DD

## Contexto
## Decisión
## Alternativas consideradas
## Consecuencias
```
