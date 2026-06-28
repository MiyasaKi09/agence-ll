# CMS Keystatic — éditer le site sans coder

Keystatic est le **CMS git-based** de l'Agence L&L (voir `CLAUDE.md` §11). Il
donne une interface d'admin sur **`/keystatic`** pour créer/éditer les **projets**
et les **articles du Journal**. Tout est réécrit en **fichiers dans le dépôt**
(les mêmes `.mdx` que lit Astro) — **aucune base de données**.

## Ce qu'on peut éditer

- **Projets** (`src/content/projets/<slug>/index.mdx`) : titre, numéro, année,
  lieu, programme, statut, surface, maîtrise d'ouvrage, résumé, couverture,
  galerie, tags, brouillon, ordre, et le corps (éditeur de texte riche).
- **Journal** (`src/content/journal/<slug>/index.mdx`) : titre, rubrique, date,
  temps de lecture, extrait/chapô, signature, image, légende, **projet lié**
  (relation vers un projet), lien LinkedIn, brouillon, et le corps.

> Les images déposées via l'admin sont **colocalisées** à côté de l'`index.mdx`
> de l'entrée. À valider lors du premier upload réel (le format du chemin écrit
> par Keystatic doit être résolu par `image()` d'Astro) — un ajustement d'une
> ligne dans `keystatic.config.ts` (`publicPath`) suffit si besoin.

## Mode local (développement)

Rien à configurer :

```bash
npm run dev
# puis ouvrir http://localhost:4321/keystatic
```

Les modifications écrivent **directement les fichiers locaux**. On les versionne
ensuite avec git (`git add`/`commit`/`push`) comme n'importe quel changement.

## Mode GitHub (production — éditer en ligne depuis le site)

En production, Keystatic passe en **mode GitHub** : Zoé/Julien se connectent
avec GitHub depuis le site déployé, et chaque enregistrement **commit dans le
dépôt** (ou ouvre une PR). C'est ce qui permet « modifier le site directement
sur le site ».

### À faire une fois (par Julien)

1. **Créer une GitHub App.** Le plus simple : déployer le site, ouvrir
   `https://<domaine>/keystatic` — Keystatic propose un **assistant** qui crée
   l'app GitHub et affiche les secrets à copier. (Sinon, manuellement : GitHub →
   Settings → Developer settings → GitHub Apps → New, permission **Contents:
   Read & write** + **Metadata: Read**, callback
   `https://<domaine>/api/keystatic/github/oauth/callback`.)
2. **Poser les variables d'environnement sur Vercel** (Project → Settings →
   Environment Variables) :
   - `PUBLIC_KEYSTATIC_MODE = github`
   - `KEYSTATIC_GITHUB_CLIENT_ID = …`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET = …`
   - `KEYSTATIC_SECRET = …` (chaîne aléatoire longue, ex. `openssl rand -hex 32`)
3. **Redéployer.** Le dépôt cible est déjà renseigné dans `keystatic.config.ts`
   (`MiyasaKi09/agence-ll`).

Tant que `PUBLIC_KEYSTATIC_MODE` n'est pas à `github`, le CMS reste en **mode
local** (le déploiement public fonctionne, l'admin en ligne n'écrit pas).

## Architecture / hébergement

- Le site reste **statique** (toutes les pages publiques sont pré-rendues).
- Seules **deux routes** tournent côté serveur : `/keystatic` (l'admin) et
  `/api/keystatic` (l'API). Elles sont en `prerender: false` et déployées comme
  **fonction serverless** par l'adaptateur `@astrojs/vercel`.
- Aucune base de données. Le contenu vit dans le dépôt Git.
