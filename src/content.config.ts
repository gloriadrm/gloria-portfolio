import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Un archivo .md por proyecto real (con caso completo). El primero por
// "order" es el que aparece como Proyecto destacado en la home.
const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: z.object({
    title: z.string(),
    status: z.enum(['progress', 'done']),
    statusLabel: z.string(),
    problem: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    competencias: z.array(z.string()).default([]),
    order: z.number().default(0),
    github: z.string().optional(),
    demo: z.string().optional(),
    // Contenido estructurado para los componentes daisyUI del caso de
    // estudio (collapse, diff) — se mantiene fuera del cuerpo markdown
    // porque se renderiza como componente, no como prosa.
    queDescarte: z.array(z.string()).default([]),
    aprendizajes: z.array(z.string()).default([]),
    mejorasFuturas: z.array(z.string()).default([]),
    // Reflexión de cierre de cada caso de estudio: qué harías distinto con
    // lo que sabes ahora. Se muestra como bloque destacado, no como prosa.
    siVolvieraEmpezar: z.array(z.string()).default([]),
    decisionDiff: z.object({
      elegido: z.object({ titulo: z.string(), detalle: z.string() }),
      descartado: z.object({ titulo: z.string(), detalle: z.string() }),
    }).optional(),
  }),
});

// Sobre mí: perfil (cuerpo markdown) + formación/experiencia
// (frontmatter estructurado, porque se renderiza como tarjetas, no prosa).
// Las competencias técnicas no se repiten aquí: ya se muestran en cada
// proyecto, y repetirlas aquí duplicaba el CV sin aportar nada nuevo.
const sobreMi = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sobre-mi' }),
  schema: z.object({
    formacion: z.array(z.object({
      periodo: z.string(),
      titulo: z.string(),
      institucion: z.string(),
    })),
    experiencia: z.array(z.object({
      periodo: z.string(),
      puesto: z.string(),
      empresa: z.string(),
      descripcion: z.string(),
    })),
  }),
});

export const collections = { proyectos, sobreMi };
