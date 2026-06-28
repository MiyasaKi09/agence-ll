// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Remplace par le domaine définitif quand il est posé (sert au sitemap + URLs canoniques)
  site: 'https://agence-ll.fr',

  // Site statique (SSG) : zéro JS par défaut, pages pré-rendues, déployable n'importe où.
  // Passe à `output: 'server'` + un adaptateur (@astrojs/vercel) seulement si un jour
  // tu ajoutes du dynamique (formulaire côté serveur, admin Keystatic en prod, etc.).
  output: 'static',

  integrations: [
    mdx(),
    sitemap(),
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
