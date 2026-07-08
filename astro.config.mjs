// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Cambia "site" y "base" si usas otro nombre de repo o dominio.
// Para un repo de proyecto (gloriadrm.github.io/gloria-portfolio) deja base activo.
// Para un repo de usuario (gloriadrm.github.io) pon base: '/'.
export default defineConfig({
  site: 'https://gloriadrm.github.io',
  base: '/gloria-portfolio',
  vite: {
    plugins: [tailwindcss()],
  },
});
