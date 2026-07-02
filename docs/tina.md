# TinaCMS — édition visuelle (React-free)

Édition du contenu **au clic sur la page**, en direct, le contenu restant en
**Markdown/MDX committé dans le dépôt**. Admin sur **`/admin`**. Intégration
`@tinacms/astro` (bridge vanilla-JS) : **aucun React n'est embarqué sur les
pages publiques** — elles restent statiques et rapides.

> ✅ **État : câblage complet.** Quatre contenus éditables : **projets**,
> **articles du Journal**, **équipe**, et le **projet vedette** de l'accueil
> (singleton avec référence).

## Démarrage (dev local — aucun identifiant requis)

```bash
npm run dev          # lance le serveur Tina local + Astro
# → site   : http://localhost:4321
# → admin  : http://localhost:4321/admin   (mode local : écrit les fichiers du dépôt)
```

En local, Tina tourne en **mode filesystem** : les enregistrements écrivent
directement les `.mdx` du dépôt (à committer ensuite avec git).

## Production — éditer en ligne (commits Git via Tina Cloud)

Tina Cloud gère l'**authentification** et **commit** chaque enregistrement dans
le dépôt GitHub (le site se reconstruit alors automatiquement).

**À faire une fois :**

1. Sur **app.tina.io** : créer (ou ré-indexer) un projet pointant sur
   `MiyasaKi09/agence-ll`, branche `main`. Récupérer le **Client ID** et créer
   un **Token (read/write)**.
2. Sur **Vercel → Settings → Environment Variables** :
   - `PUBLIC_TINA_CLIENT_ID = …`
   - `TINA_TOKEN = …`
3. Redéployer.

Le build de prod est `tinacms build && astro build` : Tina pousse le schéma +
indexe, puis Astro pré-rend les pages en lisant le contenu. **Sans
`TINA_TOKEN`**, le build retombe sur `tinacms dev -c "astro build"` (contenu
**local**) : le site se construit quand même (aperçu), mais l'édition en ligne
ne **persiste** pas tant que les identifiants cloud ne sont pas posés.

> Rappel : Tina Cloud **indexe** le contenu. Si l'admin affiche
> « Index version … no longer supported », c'est un **ré-index** à lancer
> depuis app.tina.io (indépendant du code).

## Ce qui est éditable

**Projets** — fiche au template fixe, nombre de photos variable :
titre · numéro · année · **catégorie** (select, pilote la couleur de la page et
les filtres) · programme · client (maîtrise d'ouvrage) · localisation · statut ·
surface · mission · équipe · matériaux · résumé · **couverture** · **galerie**
(liste d'images, chacune avec légende + case **« carrousel »**) · tags ·
description (corps en éditeur riche).

- **Carrousel** : seules les images **cochées « carrousel »** alimentent le
  carrousel en tête de fiche (sinon, toute la galerie ; sinon, épreuves).
- **Clic-à-éditer** : titre, programme, statut, lieu, résumé, corps, couverture,
  champs de la fiche technique sont marqués (`tinaField`) et éditables au clic.

**Accueil (réglages)** — le **« Projet à la une »** est une **référence** vers
une entrée de « Projets » : on change la vedette en modifiant cette seule
référence (cliquer le bloc vedette sur l'accueil ouvre le réglage).

**Journal (articles)** — titre · rubrique · date · temps de lecture ·
extrait/chapô · signature · image · **projet lié** (référence vers un projet →
carte « Projet lié ») · lien LinkedIn · corps (éditeur riche). Tout est
éditable au clic sur la page de l'article.

**Équipe** — une entrée par personne : nom · rôle · photo · ordre · bio.
**Ajouter/supprimer une personne = créer/supprimer une entrée** dans l'admin ;
la grille de la page Agence est éditable au clic.

## Images & optimisation

- Media store **dans le dépôt** : uploads dans **`public/uploads`** (tout reste
  en git).
- Les images déjà **colocalisées** dans `src/content/projets/<slug>/` restent
  **optimisées** par `astro:assets` (cf. `src/lib/projet-images.ts`, qui résout
  les chemins Tina vers des images importées quand elles sont sous `src/`).
- Les images uploadées dans `public/uploads` sont servies **telles quelles**
  (pas d'optimisation `astro:assets` — choix « simple + git »).

### Basculer plus tard vers un store externe (Cloudinary / S3 / Tina Cloud)

Si le dépôt devient lourd (photos haute résolution), remplacer le bloc `media`
de `tina/config.ts`. Exemples :

```ts
// Tina Cloud media (images hébergées + optimisables au build via assets.tina.io)
media: { loadCustomStore: async () => (await import('next-tinacms-cloudinary')).TinaCloudCloudinaryMediaStore }
// ou un store S3/Cloudinary dédié — voir https://tina.io/docs/reference/media/overview
```

Penser alors à autoriser le domaine distant dans `astro.config.mjs`
(`image.remotePatterns`) pour conserver l'optimisation `astro:assets`.

## Architecture

- Site **statique** (toutes les pages publiques pré-rendues, zéro React).
- Une seule route à la demande : **`/tina-island/[name]`** (`prerender:false`),
  l'endpoint que le bridge re-fetche pendant l'édition (cf. `src/lib/islands.ts`).
- Région éditable : `src/components/islands/ProjetFiche.astro`, montée dans
  `src/pages/projets/[id].astro` via `<TinaIsland>`.
- Schéma : `tina/config.ts` (mêmes fichiers `.mdx` que les content collections).
