# Desarrollo

Guía técnica: cómo correr el proyecto en local, añadir contenido nuevo y desplegarlo.

## Contenido editable (sin tocar diseño)

- `src/content/proyectos/*.md` — un archivo por proyecto **terminado y publicado**. El portfolio no tiene estados intermedios: si un proyecto está aquí, es que se considera terminado (ver [Definition of Done](#definition-of-done) más abajo). Frontmatter: `title, problem, description, stack[], competencias[], order, github, memoria`, más los campos de los componentes daisyUI del caso de estudio: `queDescarte[]` y `aprendizajes[]` (acordeones plegables), `mejorasFuturas[]` y `siVolvieraEmpezar[]` (listas). El cuerpo markdown es el resto del caso: Dataset, Arquitectura, Decisiones de diseño.
- `src/content/sobre-mi/perfil.md` — frontmatter con `formacion[], experiencia[], competencias[]`; cuerpo markdown es el perfil profesional.
- `src/data/site.json` — nombre, tagline del hero, email, teléfono, LinkedIn, GitHub, ruta del CV.

El diseño (layouts, componentes, colores) vive en `src/layouts`, `src/components` y `src/styles/global.css` — no hace falta tocarlo para añadir contenido.

## Ubicación de los recursos

Cada carpeta tiene una responsabilidad distinta. No mezclar.

**Trabajo privado — `proyectos/<slug>/`** (gitignored, nunca se publica)

Contiene el `.docx` de la memoria, imágenes originales, diagramas editables y cualquier
borrador. Es la carpeta de trabajo antes de curar lo que realmente va a la web.

## Imágenes y animaciones

Convención por defecto — **imágenes estáticas** (PNG, JPG, SVG, WebP no animado):

```text
src/assets/proyectos/<slug>/
```

Referenciadas con ruta relativa: `![alt](../../assets/proyectos/<slug>/nombre.png)`.
Astro las procesa como asset (optimiza a WebP, gestiona el base path del despliegue y
genera formatos derivados). Por eso una ruta absoluta a `public/` no sirve aquí: Astro no
antepone el base path (`/portfolio`) a rutas `/...` escritas en Markdown plano, y la
imagen queda rota en producción (verificado con un build real).

Excepción — **animaciones que Sharp no procesa de forma fiable** (GIF animado, WebP
animado, cualquier asset que deba servirse byte a byte sin reprocesado):

```text
public/proyectos/<slug>/
```

El pipeline de imágenes de Astro (Sharp/libvips) corrompe silenciosamente animaciones
grandes (cientos de fotogramas, ~1280×720 o más) al reprocesarlas: produce un `.webp` que
pasa la validación de `webpmux` pero que Chrome no puede decodificar
(`naturalWidth`/`naturalHeight` a 0). Ocurre incluso si el `.webp` de entrada ya es
válido — Astro lo vuelve a tocar igualmente. Verificado con Playwright contra un build
real (proyecto huella-carbono, 2026-07-14): 2 de 3 animaciones quedaban en blanco.

Estas animaciones se pre-convierten a WebP con `gif2webp` (el codificador de referencia
de libwebp — más robusto que Sharp para este caso) y se referencian en el cuerpo del
`.md` con la ruta completa, incluyendo el base path real del despliegue:

```md
![alt](/portfolio/proyectos/<slug>/nombre.webp)
```

Si el `base` de `astro.config.mjs` cambia, hay que actualizar a mano estas rutas — a
diferencia de `github`/`memoria`, que se resuelven en código vía `resolveLink()` en
`[...slug].astro`. Esta excepción se reserva para assets que lo necesiten y debe
validarse siempre en navegador real (no basta con que el build o el HTML generado se vean
correctos) antes de darla por buena.

**Recursos descargables — `public/proyectos/<slug>/`**

`memoria.pdf` y, cuando aplique, las animaciones grandes de la excepción anterior. La
`memoria` se referencia en el frontmatter como `memoria: "/proyectos/<slug>/memoria.pdf"`
— a diferencia de las imágenes del cuerpo, ese enlace se renderiza desde un componente
`.astro` (`[...slug].astro`), que sí antepone el base path correctamente en código.

## Añadir un proyecto nuevo

El proceso oficial no empieza aquí, sino en la skill `technical-case-study` (ver
`~/.claude/skills/technical-case-study/SKILL.md`, sección "Fase final · Publicación del
proyecto"): esa es la única definición del flujo completo. Resumen:

1. `technical-case-study` genera la memoria técnica final (`.docx` + PDF) y copia el PDF a
   `public/proyectos/<slug>/memoria.pdf` — no se considera terminada hasta que el PDF está
   copiado (ver Definition of Done de esa skill).
2. `portfolio-project-page` genera `src/content/proyectos/<slug>.md` a partir de la
   memoria y copia las imágenes curadas a `src/assets/proyectos/<slug>/`.
3. Completa manualmente `github` en el frontmatter del `.md` generado (`memoria` ya queda
   relleno automáticamente por convención de slug).
4. Comprueba el proyecto contra la Definition of Done de `portfolio-project-page` (enlace
   de GitHub funcional, memoria descargable, build y render verificados) antes de hacer
   push.

## Definition of Done

Un proyecto solo se publica en el portfolio cuando cumple todo esto:

- [ ] Código finalizado y repositorio limpio.
- [ ] README del proyecto actualizado.
- [ ] Memoria técnica (Engineering Case Study) terminada y exportada (PDF o enlace).
- [ ] Página del portfolio generada con `portfolio-project-page`.
- [ ] `github` enlazado en el frontmatter.
- [ ] `memoria` enlazada en el frontmatter.

Si falta cualquiera de estos puntos, el proyecto no está terminado y no debería publicarse.

Esto no depende solo de acordarse: `scripts/check-definition-of-done.mjs` corre antes de
cada `npm run build` y falla si algún proyecto en `src/content/proyectos/` tiene `github`
o `memoria` vacíos — ver más abajo.

## Desarrollo local

Requiere [Node.js](https://nodejs.org/) instalado.

```
npm install
npm run dev       # http://localhost:4321
npm run build     # genera dist/
npm run preview   # sirve dist/ localmente
```

## Publicación (GitHub Pages, automática)

El workflow `.github/workflows/deploy.yml` ya está configurado: cada `git push` a `main` compila y publica en GitHub Pages vía Actions. Solo necesitas activar Pages en el repo (Settings → Pages → Source: GitHub Actions).

Importante: GitHub Pages con cuenta gratuita solo funciona si el repositorio es **público**. Si prefieres mantenerlo privado, despliega en Netlify, Vercel o Cloudflare Pages (sus planes gratuitos sí permiten conectar un repo privado y publican igualmente un sitio público); en ese caso no se usa el workflow de Actions, cada plataforma compila al conectarla.

Si el repositorio no se llama `gloria-portfolio` o el usuario de GitHub no es `gloriadrm`, actualiza en `astro.config.mjs`:

```js
site: 'https://TU-USUARIO.github.io',
base: '/TU-REPOSITORIO',
```

## Tema claro/oscuro

Los colores viven en `src/styles/global.css`, en dos temas daisyUI: `gloria` (claro, por defecto) y `gloria-dark` (oscuro, se activa con el toggle del nav o si el sistema del visitante prefiere modo oscuro). Cambia los valores `--color-*` de cada tema para ajustar la paleta del sitio entero desde un único sitio.
