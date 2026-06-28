// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Remplace par le domaine définitif quand il est posé (sert au sitemap + URLs canoniques)
  site: 'https://agence-ll.fr',

  // Bilingue : FR par défaut à la racine /, EN sous /en/ (CLAUDE.md §12).
  // Pour l'instant seule l'INTERFACE est traduite ; le contenu (articles, projets,
  // prose) reste en FR sous /en/ en attendant sa traduction.
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false },
  },

  // SSG par défaut : toutes les pages publiques sont pré-rendues (statiques, zéro JS).
  // L'admin Keystatic injecte deux routes en `prerender: false` (/keystatic et
  // /api/keystatic) — elles tournent côté serveur. En Astro 5, `output: 'static'`
  // + un adaptateur autorise ces quelques routes à la demande tout en gardant le
  // reste du site statique. Voir CLAUDE.md §11.
  output: 'static',
  adapter: vercel(),

  integrations: [
    react(),     // requis par l'admin Keystatic
    keystatic(),
    mdx(),
    sitemap({
      // on n'indexe pas l'admin / l'API
      filter: (page) => !page.includes('/keystatic') && !page.includes('/api/'),
    }),
  ],

  // Optimisation d'images intégrée (astro:assets) — sharp est l'optimiseur par défaut.
  image: {
    // Domaines distants autorisés si un jour tu charges des images hébergées ailleurs
    remotePatterns: [{ protocol: 'https' }],
  },

  // Transitions de vue douces entre pages (facultatif, dégradé proprement si non supporté)
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
