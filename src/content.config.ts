import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Collection « projets » — un dossier par projet dans src/content/projets/<slug>/index.mdx
// (Astro 5+ : config à la racine de src/, loader glob() explicite, render() au lieu de .render())
const projets = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projets' }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      // numéro de projet — rendu en rouge « manuscrit » (ex. "001", "012")
      numero: z.string(),
      annee: z.coerce.number(),
      lieu: z.string(),
      // programme / typologie : sert de filtre éditorial
      programme: z.string(), // ex. "Logement social", "Rénovation énergétique", "Équipement public"
      statut: z.enum(['concours', 'étude', 'chantier', 'livré']).default('étude'),
      surface: z.string().optional(), // ex. "1 240 m²"
      maitrise_ouvrage: z.string().optional(),
      mission: z.string().optional(),   // ex. "Mission complète", "Concours lauréat"
      equipe: z.string().optional(),    // ex. "L&L · BET Inex"
      materiaux: z.string().optional(), // ex. "Ossature bois · Paille · Triple vitrage"
      // accroche courte (1 phrase) utilisée dans l'index et les listes
      resume: z.string(),
      // Image de couverture — FACULTATIVE pour que le site build sans aucune image.
      // Quand tu en ajoutes une : dépose le fichier à côté de l'index.mdx et référence
      // son chemin relatif (ex. couverture: "./couverture.jpg"). Le schéma valide tout seul.
      couverture: image().optional(),
      galerie: z
        .array(z.object({ src: image(), alt: z.string() }))
        .optional(),
      tags: z.array(z.string()).default([]),
      // brouillon: true => masqué du site (utile pour préparer un projet)
      brouillon: z.boolean().default(false),
      // ordre d'affichage manuel (sinon tri par année décroissante)
      ordre: z.number().optional(),
    }),
});

// Collection « journal » — le fil éditorial de l'agence (retours de chantier,
// partis pris techniques, presse, distinctions). Un dossier par billet :
// src/content/journal/<slug>/index.mdx (images colocalisées comme les projets).
export const RUBRIQUES = ['chantiers', 'reflexions', 'presse', 'distinctions'] as const;

const journal = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/journal' }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      // rubrique éditoriale — pilote le filtrage de l'index
      rubrique: z.enum(RUBRIQUES),
      // date de publication (ISO dans le frontmatter : 2026-05-28)
      date: z.coerce.date(),
      // ex. "4 min" — facultatif, sinon estimé à la lecture du corps
      tempsLecture: z.string().optional(),
      // accroche (sert d'extrait dans les listes ET de chapô en tête d'article)
      extrait: z.string(),
      // signature affichée sous le titre de l'article
      signature: z.string().default("par l'atelier L&L"),
      // image héro — FACULTATIVE (placeholder tramé sinon, comme les projets)
      image: image().optional(),
      // description de la photo attendue (légende du placeholder, ex. "[ pose de bottes de paille ]")
      imageLegende: z.string().optional(),
      // slug d'un projet de la collection « projets » → carte « Projet lié »
      projetLie: z.string().optional(),
      // lien vers le post LinkedIn d'origine quand le billet le prolonge
      linkedInUrl: z.string().url().optional(),
      brouillon: z.boolean().default(false),
    }),
});

export const collections = { projets, journal };
