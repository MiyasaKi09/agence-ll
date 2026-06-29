// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';
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

  // Derrière le proxy Vercel, Astro ne fait confiance à l'en-tête x-forwarded-host
  // (le vrai domaine public) que si l'hôte est listé ici — sinon il retombe sur
  // « localhost », ce qui casse le redirect_uri OAuth de l'admin Keystatic.
  // Ajoute ton domaine final ici quand il sera branché.
  security: {
    allowedDomains: [
      { hostname: 'agence-ll.vercel.app' },
      { hostname: '**.vercel.app' }, // déploiements de prévisualisation
      { hostname: 'agence-ll.fr' },
      { hostname: 'www.agence-ll.fr' },
    ],
  },

  integrations: [
    react(),       // requis par l'admin Keystatic (temporaire)
    keystatic(),   // CMS actuel — sera retiré au profit de Tina (étape suivante)
    tina(),        // TinaCMS — édition visuelle React-free ; admin /admin
    mdx(),
    sitemap({
      // on n'indexe pas les admins / l'API / l'endpoint d'îlot Tina
      filter: (page) =>
        !page.includes('/keystatic') &&
        !page.includes('/admin') &&
        !page.includes('/tina-island') &&
        !page.includes('/api/'),
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

  vite: {
    // Redirige /admin vers l'éditeur Tina en dev ; bundle Tina côté SSR.
    plugins: [tinaAdminDevRedirect()],
    ssr: { noExternal: ['@tinacms/astro', '@tinacms/bridge'] },
  },
});
