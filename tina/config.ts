import { defineConfig, type Collection } from 'tinacms';

// Branche git ciblée par l'édition (Tina Cloud commite dessus).
// IMPORTANT : on cible TOUJOURS `main` (la seule branche indexée sur TinaCloud).
// On NE prend PAS `VERCEL_GIT_COMMIT_REF` : sur un déploiement de prévisualisation,
// ce serait une branche non indexée → erreur « Branch not found » dans l'admin.
// Surcharge possible via TINA_BRANCH si besoin.
const branch = process.env.TINA_BRANCH || 'main';

// Petit utilitaire : slug propre à partir d'un titre.
const slugify = (s: string) =>
  (s || 'sans-titre')
    .toLowerCase()
    .normalize('NFD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Collection « Projets » — calquée sur src/content.config.ts.
// Fichiers en dossiers : src/content/projets/<slug>/index.mdx (corps = body MDX).
const projets: Collection = {
  name: 'projets',
  label: 'Projets',
  path: 'src/content/projets',
  format: 'mdx',
  ui: {
    // Aperçu du vrai site dans l'éditeur (le slug = nom du dossier).
    router: ({ document }) =>
      `/projets/${document._sys.breadcrumbs.slice(0, -1).join('/')}`,
    // « + Créer » → crée src/content/projets/<slug>/index.mdx
    filename: { slugify: (values) => `${slugify(values?.titre)}/index` },
  },
  fields: [
    { type: 'string', name: 'titre', label: 'Titre', isTitle: true, required: true },
    { type: 'string', name: 'numero', label: 'Numéro (manuscrit rouge)', description: 'ex. 001, 012' },
    { type: 'number', name: 'annee', label: 'Année' },
    { type: 'string', name: 'lieu', label: 'Lieu' },
    { type: 'string', name: 'programme', label: 'Programme', description: 'ex. Logement social, Rénovation énergétique' },
    {
      type: 'string', name: 'statut', label: 'Statut',
      options: ['concours', 'étude', 'chantier', 'livré'],
    },
    { type: 'string', name: 'surface', label: 'Surface', description: 'ex. 1 240 m²' },
    { type: 'string', name: 'maitrise_ouvrage', label: "Maîtrise d'ouvrage" },
    { type: 'string', name: 'mission', label: 'Mission', description: 'ex. Mission complète, Concours lauréat' },
    { type: 'string', name: 'equipe', label: 'Équipe', description: 'ex. L&L · BET Inex' },
    { type: 'string', name: 'materiaux', label: 'Matériaux', description: 'ex. Ossature bois · Paille · Triple vitrage' },
    { type: 'string', name: 'resume', label: 'Résumé (accroche 1 phrase)', ui: { component: 'textarea' } },
    { type: 'string', name: 'tags', label: 'Tags', list: true },
    { type: 'boolean', name: 'brouillon', label: 'Brouillon (masqué du site)' },
    { type: 'number', name: 'ordre', label: 'Ordre d’affichage' },
    { type: 'rich-text', name: 'body', label: 'Corps', isBody: true },
  ],
};

// Collection « Journal » — calquée sur src/content.config.ts.
const journal: Collection = {
  name: 'journal',
  label: 'Journal',
  path: 'src/content/journal',
  format: 'mdx',
  ui: {
    router: ({ document }) =>
      `/journal/${document._sys.breadcrumbs.slice(0, -1).join('/')}`,
    filename: { slugify: (values) => `${slugify(values?.titre)}/index` },
  },
  fields: [
    { type: 'string', name: 'titre', label: 'Titre', isTitle: true, required: true },
    {
      type: 'string', name: 'rubrique', label: 'Rubrique',
      options: ['chantiers', 'reflexions', 'presse', 'distinctions'],
    },
    { type: 'datetime', name: 'date', label: 'Date' },
    { type: 'string', name: 'tempsLecture', label: 'Temps de lecture', description: 'ex. 4 min' },
    { type: 'string', name: 'extrait', label: 'Extrait / chapô', ui: { component: 'textarea' } },
    { type: 'string', name: 'signature', label: 'Signature' },
    { type: 'string', name: 'imageLegende', label: 'Légende du placeholder photo' },
    { type: 'string', name: 'projetLie', label: 'Projet lié (slug)' },
    { type: 'string', name: 'linkedInUrl', label: 'Lien LinkedIn' },
    { type: 'boolean', name: 'brouillon', label: 'Brouillon (masqué du site)' },
    { type: 'rich-text', name: 'body', label: 'Corps', isBody: true },
  ],
};

export default defineConfig({
  branch,
  // Client ID Tina Cloud (public — embarqué dans l'admin, sans risque à committer).
  // Le token, lui, reste un secret côté Vercel (TINA_TOKEN).
  clientId: process.env.PUBLIC_TINA_CLIENT_ID ?? 'c0fd5f51-da60-4533-b8f1-02b2dfb11b4c',
  token: process.env.TINA_TOKEN ?? '',
  build: { outputFolder: 'admin', publicFolder: 'public' },
  media: { tina: { mediaRoot: 'uploads', publicFolder: 'public' } },
  schema: { collections: [projets, journal] },
});
