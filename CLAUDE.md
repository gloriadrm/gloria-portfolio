# CLAUDE.md

# Gloria del Río · Portfolio

Este repositorio contiene el código fuente del portfolio y toda la infraestructura necesaria para documentar, publicar y mantener proyectos técnicos.

Su objetivo es demostrar competencias reales mediante proyectos completos, bien documentados y construidos con criterio de ingeniería.

Este documento define los principios y convenciones permanentes del sistema.

Toda modificación del repositorio debe ser coherente con ellos.

---

# Propósito del repositorio

Este repositorio no contiene el desarrollo de los proyectos.

Cada proyecto dispone de su propio repositorio y puede incorporar un `CLAUDE.md` específico cuando sea necesario para aportar contexto adicional.

Este repositorio tiene como finalidad:

- mantener una forma consistente de presentar los proyectos;
- automatizar la generación de documentación;
- publicar el portfolio;
- evolucionar el sistema de documentación de forma reutilizable.

---

# Filosofía

Este portfolio no pretende mostrar ejercicios aislados.

Cada proyecto debe demostrar:

- capacidad de análisis;
- criterio técnico;
- toma de decisiones;
- calidad de implementación;
- capacidad de comunicación.

El objetivo no es enseñar cuánto código existe, sino explicar por qué el sistema se diseñó de esa manera.

Las decisiones tienen más valor que las tecnologías utilizadas.

---

# Principios

## 1. Solo existen proyectos terminados

No publicar proyectos incompletos.

No mantener tarjetas de "En progreso".

No publicar ideas.

Solo evidencia.

---

## 2. Single Source of Truth

Cada proyecto tiene una única fuente de verdad:

> La memoria técnica.

Todos los demás documentos se generan a partir de ella.

Nunca mantener dos documentos con el mismo contenido.

---

## 3. Una idea, una ubicación

Cada información debe existir únicamente en un lugar.

Ejemplos:

- una decisión técnica no debe repetirse en varias secciones;
- una explicación no debe aparecer tanto en el frontmatter como en el cuerpo;
- un procedimiento no debe copiarse entre varios documentos.

Cuando exista duplicación:

refactorizar.

---

## 4. Separación de responsabilidades

Cada documento tiene una misión concreta.

### technical-case-study

Generar y mantener la memoria técnica.

---

### portfolio-project-page

Generar y mantener la página del portfolio a partir de la memoria técnica.

---

### DESARROLLO.md

Documentar tareas operativas del repositorio.

---

### CLAUDE.md

Definir principios permanentes y convenciones del sistema.

---

## 5. Mejorar el sistema, no solo el proyecto

Cuando una mejora pueda reutilizarse en futuros proyectos:

priorizar una solución general frente a una solución específica.

Evitar excepciones.

El portfolio debe evolucionar como un sistema coherente.

---

# Antes de comenzar cualquier tarea

Antes de realizar modificaciones:

1. Identificar el objetivo solicitado.
2. Determinar si afecta:
   - a un proyecto concreto;
   - al sistema del portfolio;
   - o a ambos.
3. Buscar primero la documentación existente.
4. Reutilizar convenciones ya existentes antes de crear otras nuevas.

No asumir que el contexto empieza desde cero.

---

# Escenarios de partida

Los proyectos no siempre comienzan en el mismo punto.

Existen dos escenarios válidos.

## Escenario 1 · Existe una memoria técnica

El proyecto ya dispone de una memoria técnica finalizada.

La memoria es la fuente de verdad.

En este caso utilizar `portfolio-project-page` para generar o actualizar la página del portfolio.

No reconstruir la memoria salvo que exista una razón justificada.

---

## Escenario 2 · Solo existe el proyecto

El proyecto ya está implementado, pero todavía no dispone de una memoria técnica.

Antes de generar documentación:

- inspeccionar el repositorio;
- revisar el README;
- comprender la arquitectura;
- revisar la documentación existente;
- recuperar todo el contexto disponible.

Una vez comprendido el proyecto:

```text
Proyecto
        ↓
technical-case-study
        ↓
Memoria técnica
        ↓
portfolio-project-page
```

La memoria generada pasa a convertirse en la nueva fuente de verdad del proyecto.

---

# Flujo oficial

Todo proyecto publicado sigue siempre este flujo:

```text
Proyecto terminado
        ↓
technical-case-study
        ↓
portfolio-project-page
        ↓
Publicar
```

Los detalles de implementación de cada fase pertenecen a la skill correspondiente.

---

# Cuándo utilizar cada skill

| Situación | Skill |
|------------|-------|
| Crear una memoria técnica desde un proyecto existente | `technical-case-study` |
| Actualizar una memoria técnica existente | `technical-case-study` |
| Generar la página del portfolio | `portfolio-project-page` |
| Regenerar una página tras modificar la memoria | `portfolio-project-page` |
| Modificar el sistema del portfolio | Actualizar el código y la documentación correspondiente |

---

# Organización del repositorio

## Trabajo privado

```text
proyectos/<slug>/
```

Contiene, entre otros:

- memoria técnica editable (.docx);
- diagramas editables;
- imágenes originales;
- datasets;
- notebooks;
- recursos de trabajo.

No se publica.

---

## Imágenes del portfolio

```text
src/assets/proyectos/<slug>/
```

Contiene únicamente las imágenes utilizadas por el cuerpo Markdown.

Las imágenes deben referenciarse mediante rutas relativas para permitir que Astro:

- optimice los assets;
- gestione correctamente el `base` del despliegue;
- genere formatos optimizados.

---

## Recursos descargables

```text
public/proyectos/<slug>/
```

Actualmente contiene:

- memoria.pdf

La memoria publicada siempre debe generarse a partir del documento Word situado en la carpeta privada del proyecto.

Nunca editar directamente el PDF.

---

## Contenido del portfolio

```text
src/content/proyectos/
```

Cada proyecto se representa mediante un único archivo Markdown.

El archivo contiene:

- frontmatter estructurado;
- cuerpo Markdown.

No generar archivos auxiliares.

---

# Reglas editoriales

La memoria técnica es el documento maestro.

La página del portfolio:

- resume;
- organiza;
- adapta.

Nunca inventa contenido.

---

Cada idea debe vivir únicamente en un sitio.

Información estructurada:

→ frontmatter

Narrativa:

→ cuerpo Markdown

---

No repetir:

- aprendizajes;
- decisiones;
- alternativas;
- mejoras futuras.

Si Astro ya renderiza un campo desde el frontmatter, no volver a escribirlo en el cuerpo.

---

# Principios de ingeniería

Priorizar siempre:

- simplicidad;
- claridad;
- mantenibilidad;
- consistencia.

Evitar:

- duplicación;
- complejidad innecesaria;
- soluciones difíciles de mantener.

Cuando exista una duda entre dos diseños similares:

elegir el más simple.

---

# Cambios en el sistema

Antes de modificar:

- `content.config.ts`;
- layouts;
- componentes;
- content collections;
- estructura del contenido;
- flujo de publicación.

Evaluar siempre el impacto sobre:

- `technical-case-study`;
- `portfolio-project-page`;
- `DESARROLLO.md`.

Mantener todo el ecosistema sincronizado.

---

# Verificación

No asumir que una solución funciona.

Cuando una decisión dependa del comportamiento del framework o de la infraestructura, realizar siempre una comprobación real.

Por ejemplo:

- build completo;
- inspección del HTML generado;
- validación de rutas;
- comprobación del despliegue.

La evidencia tiene prioridad sobre la teoría.

---

# Publicación

Un proyecto solo se considera terminado cuando:

- el código está finalizado;
- el repositorio está limpio;
- existe una memoria técnica;
- la página del portfolio se ha generado automáticamente desde esa memoria;
- el proyecto compila correctamente;
- el portfolio funciona correctamente tras el build.

Los detalles específicos de publicación pertenecen a la definición de cada skill.

---

# Principio de evolución

Cada mejora realizada en este repositorio debe responder al menos a una de estas preguntas:

- ¿Reduce trabajo futuro?
- ¿Reduce duplicación?
- ¿Mejora la consistencia?
- ¿Hace el sistema más reutilizable?
- ¿Simplifica el mantenimiento?

Si la respuesta es "no" para todas ellas, reconsiderar el cambio.

---

# Objetivo final

Construir un portfolio coherente, mantenible y escalable.

Cada nuevo proyecto debe integrarse en el sistema existente sin introducir duplicaciones, inconsistencias ni excepciones.

La prioridad no es publicar más proyectos.

La prioridad es mantener un estándar de calidad consistente en todos ellos.