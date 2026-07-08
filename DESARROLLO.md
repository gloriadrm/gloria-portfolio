# Desarrollo

Guía técnica: cómo correr el proyecto en local, añadir contenido nuevo y desplegarlo.

## Contenido editable (sin tocar diseño)

- `src/content/proyectos/*.md` — un archivo por proyecto terminado/en curso. Frontmatter: `title, status (progress|done), statusLabel, problem, description, stack[], competencias[], order`, más los campos de los componentes daisyUI del caso de estudio: `queDescarte[]` y `aprendizajes[]` (acordeones plegables), `mejorasFuturas[]` (lista simple) y `decisionDiff` (objeto `elegido`/`descartado`, cada uno con `titulo` y `detalle`, para el comparador deslizante). El cuerpo markdown es el resto del caso: Dataset, Arquitectura, Decisiones de diseño.
- `src/content/sobre-mi/perfil.md` — frontmatter con `formacion[], experiencia[], competencias[]`; cuerpo markdown es el perfil profesional.
- `src/data/site.json` — nombre, tagline del hero, email, teléfono, LinkedIn, GitHub, ruta del CV.
- `src/data/roadmap.json` — array de "próximos proyectos" (title, problem, stack).

El diseño (layouts, componentes, colores) vive en `src/layouts`, `src/components` y `src/styles/global.css` — no hace falta tocarlo para añadir contenido.

## Añadir un proyecto nuevo

1. Duplica cualquier `.md` en `src/content/proyectos/`, cambia el frontmatter y escribe el caso de estudio.
2. Cuando el proyecto pase de "próximo" a real, bórralo de `src/data/roadmap.json` — aparecerá solo en el home y en el menú Proyectos.
3. Añade capturas como imágenes en `public/assets/` y referéncialas en el markdown con `![alt](/assets/nombre.png)`.

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
