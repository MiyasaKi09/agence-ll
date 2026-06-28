import { config, fields, collection, singleton } from '@keystatic/core';
import { createElement } from 'react';

// CMS git-based (sans base de données) — voir CLAUDE.md §11.
// L'admin vit sur /keystatic. Les modifications sont réécrites en FICHIERS dans
// le dépôt (mêmes fichiers que ceux lus par les content collections d'Astro).
//
// MODE DE STOCKAGE
// - Dev (par défaut) : `local` → lit/écrit le système de fichiers via `npm run dev`.
// - Prod : `github` → édition en ligne depuis le site déployé, commit dans le dépôt.
//   Pour l'activer : créer une GitHub App (faite par Julien), poser les variables
//   d'env sur Vercel (KEYSTATIC_GITHUB_CLIENT_ID, KEYSTATIC_GITHUB_CLIENT_SECRET,
//   KEYSTATIC_SECRET) et PUBLIC_KEYSTATIC_MODE=github. Détails dans docs/keystatic.md.
const storage =
  import.meta.env?.PUBLIC_KEYSTATIC_MODE === 'github'
    ? ({ kind: 'github', repo: 'MiyasaKi09/agence-ll' } as const)
    : ({ kind: 'local' } as const);

export default config({
  storage,
  // Interface d'admin en français (boutons, info-bulles, etc.)
  locale: 'fr-FR',
  ui: {
    brand: {
      name: 'Agence L&L',
      // sceau-pieuvre du site comme marque de l'admin
      mark: () => createElement('img', { src: '/favicon.svg', alt: '', width: 22, height: 22 }),
    },
    navigation: {
      Contenu: ['projets', 'journal'],
      'Textes du site': ['accueil', 'agence', 'contact'],
    },
  },
  collections: {
    // ——— PROJETS ———
    projets: collection({
      label: 'Projets',
      path: 'src/content/projets/*/',
      slugField: 'titre',
      format: { contentField: 'corps' },
      entryLayout: 'content',
      columns: ['titre', 'annee', 'statut'],
      schema: {
        titre: fields.slug({
          name: { label: 'Titre', validation: { isRequired: true } },
        }),
        numero: fields.text({ label: 'Numéro', description: 'ex. 001, 012 (rendu manuscrit rouge)' }),
        annee: fields.integer({ label: 'Année', validation: { isRequired: true } }),
        lieu: fields.text({ label: 'Lieu', description: 'ex. Rouen (76)' }),
        programme: fields.text({ label: 'Programme', description: 'ex. Rénovation énergétique' }),
        statut: fields.select({
          label: 'Statut',
          options: [
            { label: 'Concours', value: 'concours' },
            { label: 'Étude', value: 'étude' },
            { label: 'Chantier', value: 'chantier' },
            { label: 'Livré', value: 'livré' },
          ],
          defaultValue: 'étude',
        }),
        surface: fields.text({ label: 'Surface', description: 'ex. 1 240 m² (facultatif)', validation: { isRequired: false } }),
        maitrise_ouvrage: fields.text({ label: "Maîtrise d'ouvrage", validation: { isRequired: false } }),
        resume: fields.text({ label: 'Résumé', description: 'Accroche d’une phrase', multiline: true }),
        couverture: fields.image({
          label: 'Couverture',
          description: 'Image colocalisée avec le projet (facultatif)',
          validation: { isRequired: false },
        }),
        galerie: fields.array(
          fields.object({
            src: fields.image({ label: 'Image', validation: { isRequired: true } }),
            alt: fields.text({ label: 'Texte alternatif' }),
          }),
          { label: 'Galerie', itemLabel: (props) => props.fields.alt.value || 'Image' },
        ),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value,
        }),
        brouillon: fields.checkbox({ label: 'Brouillon (masqué du site)', defaultValue: false }),
        ordre: fields.integer({ label: 'Ordre d’affichage', validation: { isRequired: false } }),
        corps: fields.mdx({
          label: 'Corps',
          description: 'Texte libre du projet (Markdown/MDX)',
          extension: 'mdx',
        }),
      },
    }),

    // ——— JOURNAL ———
    journal: collection({
      label: 'Journal',
      path: 'src/content/journal/*/',
      slugField: 'titre',
      format: { contentField: 'corps' },
      entryLayout: 'content',
      columns: ['titre', 'rubrique', 'date'],
      schema: {
        titre: fields.slug({
          name: { label: 'Titre', validation: { isRequired: true } },
        }),
        rubrique: fields.select({
          label: 'Rubrique',
          options: [
            { label: 'Chantiers', value: 'chantiers' },
            { label: 'Réflexions', value: 'reflexions' },
            { label: 'Presse', value: 'presse' },
            { label: 'Distinctions', value: 'distinctions' },
          ],
          defaultValue: 'chantiers',
        }),
        date: fields.date({ label: 'Date', validation: { isRequired: true } }),
        tempsLecture: fields.text({ label: 'Temps de lecture', description: 'ex. 4 min (facultatif)', validation: { isRequired: false } }),
        extrait: fields.text({ label: 'Extrait / chapô', description: 'Sert d’accroche ET d’introduction', multiline: true }),
        signature: fields.text({ label: 'Signature', defaultValue: "par l'atelier L&L" }),
        image: fields.image({
          label: 'Image héro',
          description: 'Image colocalisée avec l’article (facultatif)',
          validation: { isRequired: false },
        }),
        imageLegende: fields.text({ label: 'Légende du placeholder', description: 'Décrit la photo attendue, ex. [ pose de bottes de paille ]', validation: { isRequired: false } }),
        projetLie: fields.relationship({
          label: 'Projet lié',
          description: 'Relie l’article à un projet (carte « Projet lié »)',
          collection: 'projets',
        }),
        linkedInUrl: fields.url({ label: 'Lien LinkedIn d’origine', description: 'Quand le billet prolonge un post (facultatif)' }),
        brouillon: fields.checkbox({ label: 'Brouillon (masqué du site)', defaultValue: false }),
        corps: fields.mdx({
          label: 'Corps',
          description: 'Texte de l’article (Markdown/MDX)',
          extension: 'mdx',
        }),
      },
    }),
  },

  // ——— TEXTES DU SITE (éditables) ———
  // Stockés en JSON dans src/content/site/*.json, relus au build via le reader
  // Keystatic (voir src/lib/site.ts). Les courts titres « signature » (avec
  // l'accent terre cuite) restent dans le code ; ici on édite la prose.
  singletons: {
    accueil: singleton({
      label: 'Accueil',
      path: 'src/content/site/accueil',
      format: { data: 'json' },
      schema: {
        manifesteTexte: fields.text({
          label: 'Manifeste (accueil) — texte',
          description: 'Le paragraphe sous le titre du manifeste, sur la page d’accueil.',
          multiline: true,
        }),
      },
    }),

    agence: singleton({
      label: 'Agence',
      path: 'src/content/site/agence',
      format: { data: 'json' },
      schema: {
        introParagraphes: fields.array(
          fields.text({ label: 'Paragraphe', multiline: true }),
          { label: 'Manifeste — paragraphes', itemLabel: (p) => p.value.slice(0, 48) || 'Paragraphe' },
        ),
        savoirFaire: fields.array(
          fields.object({
            titre: fields.text({ label: 'Titre' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Savoir-faire', itemLabel: (p) => p.fields.titre.value || 'Savoir-faire' },
        ),
        equipe: fields.array(
          fields.object({
            nom: fields.text({ label: 'Nom' }),
            bio: fields.text({ label: 'Bio', multiline: true }),
          }),
          { label: 'Équipe', itemLabel: (p) => p.fields.nom.value || 'Membre' },
        ),
        territoireTexte: fields.text({ label: 'Territoire — texte', multiline: true }),
      },
    }),

    contact: singleton({
      label: 'Contact',
      path: 'src/content/site/contact',
      format: { data: 'json' },
      schema: {
        lede: fields.text({ label: 'Contact — accroche', multiline: true }),
      },
    }),
  },
});
