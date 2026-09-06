# Pensamiento venezolano

Este directorio no será un panteón de próceres intelectuales. La unidad principal de análisis son **los debates**, las ideas, sus contextos, sus críticos, las instituciones que produjeron y lo que ocurrió después.

## El grafo empieza aquí

La migración estructurada vive en [`personas/`](personas/), [`ideas/`](ideas/) y [`debates/`](debates/). Cada ficha tiene un ID estable y metadatos que GitHub Pages descubre automáticamente; las relaciones curadas viven en `data/relations.json` y distinguen relaciones documentadas, inferidas e interpretativas.

### Personas iniciales estructuradas

- [Alberto Adriani](personas/alberto-adriani.md)
- [Arturo Uslar Pietri](personas/arturo-uslar-pietri.md)
- [Juan Pablo Pérez Alfonzo](personas/juan-pablo-perez-alfonzo.md)
- [Rafael Alfonzo Ravard](personas/rafael-alfonzo-ravard.md)
- [Asdrúbal Baptista](personas/asdrubal-baptista.md)
- [Carlos Rangel](personas/carlos-rangel.md)
- [Manuel Caballero](personas/manuel-caballero.md)
- [Maritza Montero](personas/maritza-montero.md)
- [José Manuel Briceño Guerrero](personas/jose-manuel-briceno-guerrero.md)
- [José Ignacio Cabrujas](personas/jose-ignacio-cabrujas.md)
- [Fernando Coronil](personas/fernando-coronil.md)

### Ideas ya convertidas en nodos

- [Sembrar el petróleo](ideas/sembrar-el-petroleo.md)
- [Capitalismo rentístico](ideas/capitalismo-rentistico.md)
- [Estado del disimulo](ideas/estado-del-disimulo.md)
- [Estado mágico](ideas/estado-magico.md)
- [Identidad y autopercepción nacional](ideas/identidad-y-autopercepcion.md)
- [Tres discursos de fondo](ideas/tres-discursos-de-fondo.md)
- [Construcción de capacidades](ideas/construccion-de-capacidades.md)

### Debates iniciales

- [Uslar ↔ Pérez Alfonzo: debate petrolero de 1963](debates/petroleo/uslar-vs-perez-alfonzo-1963.md)
- [Agencia interna ↔ condicionantes externos](debates/agencia-interna-vs-condicionantes-externos.md)

## Regla de trabajo

Para una idea o debate histórico:

```text
qué se dijo
quién lo dijo
contra qué discutía
qué supuestos tenía
qué evidencia usaba
qué criticaron sus contemporáneos
qué ocurrió después
qué sabemos hoy
qué sigue abierto
```

## El objetivo no es una cronología lineal

Queremos reconstruir una red:

```text
IDEA
 ↓
PERSONA ↔ PERSONA
 ↓       ↕
DEBATE  CRÍTICA
 ↓
DECISIÓN
 ↓
INSTITUCIÓN
 ↓
CAPACIDAD
 ↓
RESULTADO
 ↓
EVIDENCIA POSTERIOR
 ↓
¿QUÉ APRENDIMOS?
```

Una arista del grafo no implica causalidad. Cuando una relación sea una lectura nuestra y no una relación histórica directamente documentada, debe decirlo.

## Qué empieza a permitir esta estructura

El mismo tema puede recorrerse de varias maneras. Por ejemplo:

```text
Alberto Adriani
      ↓
Sembrar el petróleo ← Arturo Uslar Pietri
      ↓
debate petrolero de 1963 ↔ Juan Pablo Pérez Alfonzo
      ↓
Capitalismo rentístico ← Asdrúbal Baptista
      ↕
Estado mágico ← Fernando Coronil
```

El diagrama no afirma que todos estos autores formen una única escuela. Muestra preguntas históricas relacionadas que pueden contrastarse mediante sus textos, instituciones, resultados y evidencia posterior.

En otro eje:

```text
Maritza Montero → identidad y autopercepción
                         ↕
                  tres discursos de fondo ← Briceño Guerrero
                         ↕
Estado del disimulo ← Cabrujas
```

Aquí las conexiones deben tratarse con especial cuidado: son en gran medida **diálogos interpretativos construidos por el proyecto**, no relaciones personales ni influencias demostradas salvo que las fuentes lo documenten.

## Personas y líneas todavía por estructurar

Rómulo Betancourt; Ramón J. Velásquez; Germán Carrera Damas; Luis Castro Leiva; D. F. Maza Zavala; Gerver Torres; Allan R. Brewer-Carías; Juan Carlos Rey; Luis Beltrán Prieto Figueroa; Mariano Picón Salas; Miguel Acosta Saignes; Esteban Emilio Mosonyi, y muchas otras voces.

La lista debe ampliarse deliberadamente con mujeres, voces regionales, pensamiento indígena, trabajadores, científicos, educadores, ambientalistas, artistas y constructores institucionales.

## Suma del pensar venezolano

La colección **Suma del pensar venezolano**, de Fundación Empresas Polar, es un antecedente intelectual fundamental. Venezuela Futura no pretende reemplazarla. Puede añadir una capa propia de la era Git:

```text
pensamiento histórico
      ↓
relaciones y controversias
      ↓
evidencia posterior
      ↓
instituciones y resultados
      ↓
opciones actuales
      ↓
escenarios
      ↓
revisión continua
```

## Principio

> **Venezuela también debe poder criticarse a sí misma.**

Pero sin transformar autocrítica en autoflagelación ni responsabilidad interna en negación de condicionantes externos.
