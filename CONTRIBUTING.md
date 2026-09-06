# Cómo contribuir

Venezuela Futura trata el repositorio como fuente de verdad y GitHub Pages como una vista generada de ese conocimiento.

## La regla más importante

**No edites `assets/js/site.js` para hacer aparecer una contribución en la web.**

Todo archivo Markdown público del repositorio es descubierto automáticamente durante el build. Tras aprobar y fusionar un Pull Request en `main`, GitHub Actions reconstruye el índice y Pages.

## Contribución mínima

Crear o mejorar un `.md` es suficiente. El generador obtiene el título del primer `#` y crea una ficha navegable.

## Contribución estructurada

Para personas, instituciones, debates, ideas y otros nodos reutilizables, añade front matter:

```yaml
---
id: juan-pablo-perez-alfonzo
type: persona
name: Juan Pablo Pérez Alfonzo
topics:
  - petróleo
  - renta
  - OPEP
summary: Figura central de la política petrolera venezolana del siglo XX.
---
```

`id` debe ser estable y único. Los tipos son abiertos, pero se prefieren: `persona`, `idea`, `institucion`, `debate`, `obra`, `lugar`, `evento`, `dato`, `documento`.

## Relaciones

Las relaciones forman parte de la evidencia del proyecto. No todas significan lo mismo. Deben distinguirse, cuando sea posible, como `documentada`, `inferida`, `interpretativa` o `controvertida`.

Mientras migramos el corpus, las relaciones curadas viven en `data/relations.json`. Las relaciones que apunten a IDs inexistentes hacen fallar la validación del Pull Request.

## Flujo

```text
branch / fork
    ↓
Pull Request
    ↓
validar contenido + relaciones + build
    ↓
revisión humana
    ↓
merge a main
    ↓
GitHub Pages se reconstruye
```

## Fuentes y afirmaciones

Una relación en el grafo no convierte una interpretación en hecho. Las afirmaciones sustantivas deben estar respaldadas en el Markdown correspondiente y deben conservar contexto, fuente, fecha y limitaciones cuando proceda.

El objetivo es que el atlas sea abierto **sin sacrificar trazabilidad ni pluralismo**.
