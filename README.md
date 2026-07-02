# Agence L&L

Site vitrine de l'Agence L&L — architecture, rénovation énergétique &
construction biosourcée. **Astro** (statique, sans React sur les pages
publiques) + **TinaCMS** (édition visuelle au clic) + **Vercel**.

## Démarrage (dev)

```bash
npm install
npm run dev        # serveur Tina local + Astro → http://localhost:4321
```

- **Site** : http://localhost:4321
- **Admin** : http://localhost:4321/admin — en local, les sauvegardes écrivent
  directement les fichiers du dépôt (`src/content/…`), à committer avec git.

Autres commandes : `npm run build` (build cloud Tina + Astro),
`npm run build:local` (build sans identifiants Tina Cloud),
`npm run preview`, `npm run sync` (types des collections).

## Éditer le contenu (admin `/admin`)

Tout le contenu est en **Markdown/MDX/JSON committé dans le dépôt** — pas de
base de données. Depuis l'admin (et **au clic sur la page** en mode édition) :

- **Projets** : créer/éditer une fiche, uploader des photos dans la **galerie**
  et **cocher « carrousel »** pour choisir celles du carrousel en tête de fiche.
- **Accueil (réglages)** : choisir le **« Projet à la une »** (une référence —
  changer la vedette ne touche pas aux projets).
- **Journal** : créer un article et le **lier à un projet** (référence).
- **Équipe** : ajouter/supprimer une personne (nom, rôle, photo, ordre).

En **production**, l'admin passe par **Tina Cloud** : connexion GitHub, et
**chaque sauvegarde = un commit** sur `main` → redéploiement Vercel automatique.

### Identifiants (une fois, sur Vercel)

Variables d'environnement (Project → Settings → Environment Variables) :

- `PUBLIC_TINA_CLIENT_ID` — Client ID du projet sur [app.tina.io](https://app.tina.io)
- `TINA_TOKEN` — token « content » (read/write) du même projet

Le projet Tina Cloud doit pointer sur ce dépôt avec la **branche `main`
indexée**. Sans identifiants (ou si le cloud est indisponible), le build
retombe automatiquement sur le contenu local : le site se déploie quand même,
seule l'édition en ligne attend.

## Images

- Les uploads de l'admin vont dans **`public/uploads/`** (versionnés en git),
  servis tels quels.
- Les images **colocalisées** dans `src/content/<collection>/<slug>/` sont
  **optimisées** par `astro:assets` (résolution dans `src/lib/projet-images.ts`).

### Basculer vers un store externe (si le dépôt devient lourd)

Quand la photothèque haute résolution pèsera trop en git, remplacer le bloc
`media` de `tina/config.ts` par un store externe (Cloudinary, S3, Tina Cloud
media…) — voir la
[doc médias Tina](https://tina.io/docs/reference/media/overview). Penser à
autoriser le domaine distant dans `astro.config.mjs` (`image.remotePatterns`)
pour conserver l'optimisation. Détails : `docs/tina.md`.

## Architecture (résumé)

- Pages publiques **pré-rendues** (SSG), zéro React embarqué ; effets immersifs
  en CSS + petites îles JS (voir `CLAUDE.md` §14).
- Une seule route serveur : **`/tina-island/[name]`** — l'endpoint que le bridge
  d'édition Tina re-fetche pendant l'édition (invisible pour les visiteurs).
- Schéma CMS : `tina/config.ts` · fetchers : `src/lib/tina-data.ts` · régions
  éditables : `src/components/islands/*.astro`.
- Docs internes : **`CLAUDE.md`** (vision, design system, conventions) et
  **`docs/tina.md`** (CMS en détail).
