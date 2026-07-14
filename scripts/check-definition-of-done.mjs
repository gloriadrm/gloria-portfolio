#!/usr/bin/env node
// Se ejecuta como "prebuild" (ver package.json). Falla el build si algún proyecto
// publicado en src/content/proyectos/ no cumple la Definition of Done descrita en
// DESARROLLO.md: no puede faltar `github` ni `memoria`.
//
// Parseo deliberadamente simple (regex sobre el frontmatter) en vez de un parser YAML
// completo: los únicos campos que interesan aquí son valores string de una sola línea.

import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROYECTOS_DIR = join(__dirname, '..', 'src', 'content', 'proyectos');
const REQUIRED_FIELDS = ['github', 'memoria'];

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : '';
}

function readField(frontmatter, field) {
  const match = frontmatter.match(new RegExp(`^${field}:\\s*(.*)$`, 'm'));
  if (!match) return null;
  const value = match[1].trim().replace(/^["']|["']$/g, '');
  return value;
}

function isMissing(value) {
  return !value || value.length === 0 || value.toUpperCase() === 'PENDIENTE';
}

const files = readdirSync(PROYECTOS_DIR).filter((f) => f.endsWith('.md'));
const failures = [];

for (const file of files) {
  const content = readFileSync(join(PROYECTOS_DIR, file), 'utf-8');
  const frontmatter = extractFrontmatter(content);
  const missing = REQUIRED_FIELDS.filter((field) => isMissing(readField(frontmatter, field)));
  if (missing.length > 0) {
    failures.push({ file, missing });
  }
}

if (failures.length > 0) {
  console.error('\n❌ Definition of Done incompleta — build bloqueado.\n');
  for (const { file, missing } of failures) {
    console.error(`  src/content/proyectos/${file}: falta ${missing.join(', ')}`);
  }
  console.error('\nCompleta esos campos en el frontmatter antes de publicar (ver DESARROLLO.md → Definition of Done).\n');
  process.exit(1);
}

console.log(`✔ Definition of Done: ${files.length} proyecto(s) con github y memoria completos.`);
