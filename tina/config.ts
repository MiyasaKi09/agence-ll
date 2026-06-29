import { defineConfig, type Collection } from 'tinacms';

// ── TinaCMS — édition visuelle React-free (cf. docs/tina.md) ──────────────────
// Backend = Tina Cloud (auth + commits Git). Identifiants en variables d'env
// Vercel (PUBLIC_TINA_CLIENT_ID, TINA_TOKEN). En dev local : `tinacms dev`
// lance un serveur GraphQL local (pas besoin du cloud).
const branch =
  process.env.TINA_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  'main';

const slugify = (s: string) =>
  (s || 'sans-titre')
    .toLowerCase()
    .normalize('NFD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Catégories éditoriales — pilotent la recoloration immersive par catégorie
// (cf. src/lib/projets-data.ts) ET les filtres de la grille.
const CATEGORIES = [
  { value: 'renovation', label: 'Rénovation énergétique' },
  { value: 'logements', label: 'Logement social' },
  { value: 'equipements', label: 'Équipement public' },
  { value: 'neuf', label: 'Construction neuve / biosourcé' },
];

// ── Collection « projets » (la seule câblée pour l'instant) ───────────────────
// Fichiers : src/content/projets/<slug>/index.mdx (mêmes fichiers que lit Astro).
const projets: Collection = {
  name: 'projets',
  label: 'Projets',
  path: 'src/content/projets',
  format: 'mdx',
  ui: {
    router: ({ document }) =>
      `/projets/${document._sys.breadcrumbs.slice(0, -1).join('/')}`,
    filename: { slugify: (values) => `${slugify(values?.titre)}/index` },
  },
  fields: [
    { type: 'string', name: 'titre', label: 'Titre', isTitle: true, required: true },
    { type: 'string', name: 'numero', label: 'Numéro', description: 'ex. 001, 012' },
    { type: 'number', name: 'annee', label: 'Année' },
    {
      type: 'string', name: 'categorie', label: 'Catégorie',
      description: 'Pilote la couleur de la page et les filtres.',
      options: CATEGORIES,
    },
    { type: 'string', name: 'programme', label: 'Programme (libellé libre)', description: 'ex. Rénovation énergétique, Surélévation' },
    { type: 'string', name: 'maitrise_ouvrage', label: 'Client / Maîtrise d’ouvrage' },
    { type: 'string', name: 'lieu', label: 'Localisation', description: 'ex. Pantin (93)' },
    {
      type: 'string', name: 'statut', label: 'Statut',
      options: ['concours', 'étude', 'chantier', 'livré'],
    },
    { type: 'string', name: 'surface', label: 'Surface', description: 'ex. 1 240 m²' },
    { type: 'string', name: 'mission', label: 'Mission', description: 'ex. Mission complète' },
    { type: 'string', name: 'equipe', label: 'Équipe / partenaires', description: 'ex. L&L · BET Inex' },
    { type: 'string', name: 'materiaux', label: 'Matériaux', description: 'ex. Ossature bois · Paille' },
    { type: 'string', name: 'resume', label: 'Résumé (accroche 1 phrase)', ui: { component: 'textarea' } },
    {
      type: 'image', name: 'couverture', label: 'Couverture',
      description: 'Image de couverture (facultatif).',
    },
    {
      type: 'object', name: 'galerie', label: 'Galerie', list: true,
      description: 'Toutes les images s’affichent ; cochez « carrousel » pour mettre une image dans le carrousel en tête de fiche.',
      ui: { itemProps: (item) => ({ label: item?.legende || 'Image' }) },
      fields: [
        { type: 'image', name: 'src', label: 'Image', required: true },
        { type: 'string', name: 'alt', label: 'Légende / texte alternatif' },
        { type: 'boolean', name: 'carrousel', label: 'Afficher dans le carrousel' },
      ],
    },
    { type: 'string', name: 'tags', label: 'Tags', list: true },
    { type: 'boolean', name: 'brouillon', label: 'Brouillon (masqué du site)' },
    { type: 'number', name: 'ordre', label: 'Ordre d’affichage' },
    {
      type: 'rich-text', name: 'corps', label: 'Description (corps de la fiche)',
      isBody: true,
      description: 'Texte libre de la fiche (éditeur riche).',
    },
  ],
};

export default defineConfig({
  branch,
  clientId: process.env.PUBLIC_TINA_CLIENT_ID ?? '',
  token: process.env.TINA_TOKEN ?? '',
  build: { outputFolder: 'admin', publicFolder: 'public' },
  // Médias dans le dépôt. NB : pour conserver l'optimisation `astro:assets`,
  // le rendu résout ces chemins en images importées (cf. src/lib/projet-images.ts).
  media: { tina: { mediaRoot: 'uploads', publicFolder: 'public' } },
  schema: { collections: [projets] },
});
