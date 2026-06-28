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

export const collections = { projets };
