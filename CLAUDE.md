# CLAUDE.md — Agence L&L

> Ce fichier est le **cerveau du projet**. Claude Code le lit à chaque session :
> il fixe la vision, la stack, le système de design et les conventions. Tiens-le
> à jour quand des décisions changent — c'est ce qui évite de tout réexpliquer.

---

## 1. Le projet

Site vitrine de l'**Agence L&L**, jeune agence d'architecture (un duo : Julien &
Zoé Lenglet), installée à **Paris** et travaillant sur un **corridor Paris –
Normandie**.

**Positionnement :** rénovation énergétique · logement social · équipements
publics · marchés publics · construction biosourcée (pisé, chaux-chanvre, fibre
de bois) · biodiversité et attention au vivant.

**Ton voulu :** sérieux et professionnel, mais **artisanal et ambitieux**. Une
agence qui pense l'écologie et la matière. Pas un site « corporate » lisse ; pas
non plus un site « portfolio créatif » gratuit. **Éditorial, soigné, habité.**

**Objectif du site (v1) :** crédibiliser l'agence, exposer la vision et l'approche,
présenter les premiers projets (peu nombreux au départ — c'est normal, le site est
**vision-first** avant d'être project-first), et capter des prises de contact
(maîtrise d'ouvrage publique et privée).

---

## 2. La stack — et pourquoi celle-là

> Julien a l'habitude de **Next.js + Supabase + Vercel + GitHub**. Pour CE site,
> on garde GitHub et Vercel, mais on change le reste. Voici le raisonnement.

**Choix : Astro (SSG) + contenu en dépôt (content collections) + Vercel + GitHub.**

| Brique | Choix | Pourquoi |
|---|---|---|
| Framework | **Astro 5/6** | Conçu pour les sites de contenu. **Zéro JS par défaut** → pages lourdes en images qui chargent vite. Optimisation d'images intégrée (`astro:assets`). Excellent SEO/Lighthouse sans effort. Les « îlots » permettent d'ajouter du React/JS **seulement** là où on en a besoin. |
| Contenu | **Content collections** (Markdown/MDX + Zod) | Les projets sont des fichiers versionnés dans le dépôt. Typés, sûrs, éditables hors-ligne. Aucune base de données à gérer. |
| Hébergement | **Vercel** (déjà connu) — ou Cloudflare Pages | Astro se déploie en statique sur les deux, gratuitement. Vercel par familiarité. |
| Versionnage | **GitHub** | On garde. (Sert aussi de backend au CMS optionnel, voir §11.) |
| Formulaire | **Formspree** (ou Resend via route serveur) | Pas de base requise. Voir §8. |

**Pourquoi PAS Supabase ici.** Supabase (Postgres + auth + temps réel) brille pour
des **applications** : comptes, données utilisateur, requêtes dynamiques. Un site
vitrine n'a rien de tout ça — son « contenu » (projets, vision, équipe) est
mieux géré en **fichiers versionnés** qu'en base. Ajouter Supabase, ce serait gérer
une base, des migrations et une couche de données pour rien. **On le garde dans la
boîte à outils** pour le jour où il y aura une vraie fonctionnalité applicative
(espace client, suivi de chantier…), pas avant.

**Pourquoi PAS Next.js ici.** Next.js marche, et Julien le connaît — mais pour un
pur site de contenu, on se bat contre lui (runtime React envoyé partout, App
Router, etc.). Astro fait la même chose avec **moins de code et de meilleures
perfs**, et la courbe est douce (surtout du HTML + frontmatter). Si un jour le
site doit devenir une app, on réévaluera.

---

## 3. Démarrage

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # build statique dans dist/
npm run preview    # prévisualise le build
npm run check      # vérif TypeScript/Astro
```

> Si une version d'`astro` / d'une intégration coince à l'install, la voie
> canonique reste `npm create astro@latest` (modèle minimal, TypeScript strict)
> puis `npx astro add mdx sitemap`, et on y reverse les fichiers de `src/`.

Après toute modif de schéma de contenu : `npm run sync` (régénère les types).

---

## 4. Architecture

```
agence-ll/
├── CLAUDE.md                 ← ce fichier
├── astro.config.mjs          ← static, MDX, sitemap, site URL
├── src/
│   ├── content.config.ts     ← schéma des collections (Astro 5 : à la RACINE de src/)
│   ├── content/
│   │   └── projets/<slug>/index.mdx   ← un dossier par projet (+ ses images)
│   ├── layouts/
│   │   └── Base.astro        ← <head>, meta/OG, polices, <ClientRouter/>, header + footer
│   ├── lib/
│   │   ├── axono.ts          ← générateur d'axonométrie (massing → SVG) — §14
│   │   ├── projets-data.ts   ← catégorie/dept/massing par projet + palettes + carte IDF — §14
│   │   ├── teinte.ts         ← teinte par catégorie (page + axonométrie) — §14
│   │   ├── tina-data.ts      ← fetchers Tina (requestWithMetadata) — §11
│   │   ├── islands.ts        ← registre des îlots éditables Tina — §11
│   │   └── projet-images.ts  ← chemins d'images Tina → astro:assets — §11
│   ├── components/
│   │   ├── Header.astro      ← nav desktop + menu mobile
│   │   ├── Footer.astro
│   │   ├── Axono.astro       ← axonométrie générée par projet (prend `id` ou `spec`)
│   │   ├── Monogram.astro    ← sceau pieuvre (dispo ; non utilisé par le design validé)
│   │   ├── islands/          ← régions éditables Tina (fiche projet, article, vedette, équipe)
│   │   └── ProjectCard.astro
│   ├── pages/
│   │   ├── index.astro       ← accueil (la « thèse »)
│   │   ├── agence.astro      ← manifeste · savoir-faire · équipe · territoire
│   │   ├── projets/index.astro
│   │   ├── projets/[id].astro ← page projet (param = `id`, pas `slug`, en Astro 5+)
│   │   └── contact.astro
│   └── styles/
│       ├── tokens.css        ← jetons de design (couleur, typo, espace)
│       └── global.css        ← base, prose, accessibilité
├── public/                   ← favicon, images statiques, og-default.jpg
└── design/                   ← accueil-prototype.html : RÉFÉRENCE VISUELLE validée (reproduire fidèlement)
```

**Conventions Astro 5/6 importantes** (déjà appliquées, à respecter) :
- Config de contenu à `src/content.config.ts` (plus dans `src/content/`).
- Loader **explicite** : `glob({ pattern, base })` depuis `astro/loaders`.
- Routes dynamiques : le paramètre est **`id`** (`[id].astro`), plus `slug`.
- Rendu : **`const { Content } = await render(entry)`** (plus `entry.render()`).
- Images : composant **`<Image>`** de `astro:assets` (jamais `<img>` pour le contenu).

---

## 5. Système de design

> ⚠️ **Garde-fou anti-générique.** La palette ci-dessous (papier crème + serif +
> terre cuite) est **proche d'un cliché de design IA**. Elle est légitime **parce
> que c'est l'identité réelle de Julien** (positionnement terre/biosourcé), mais la
> distinctivité NE DOIT PAS reposer sur la palette. Elle vient de la **SIGNATURE** :
> le **sceau / la linogravure « poulpe » L&L**, les **numéros de projet manuscrits
> en rouge**, la **grille éditoriale asymétrique**, les **métadonnées en
> monospace**, et la **photographie de matière** (pisé, chaux-chanvre) en pleine
> page. Si une page se met à ressembler au « crème + serif + terracotta » par
> défaut, **pousse le côté gravure/tampon/encre** (grain, matière, asymétrie) pour
> la singulariser.

**Tout est dans `src/styles/tokens.css`. Dérive chaque couleur et chaque taille de
là — n'invente pas de valeurs en dur.**

**Couleur** (terre · encre · sceau · mousse)
- `--paper #EEEAE1` (plâtre chaulé, un peu plus froid que le cream par défaut)
- `--ink #1C1A17` (encre chaude, **jamais noir pur**)
- `--terracotta #A24B2C` / `--terracotta-deep #7E3A22` (accent principal)
- `--seal #C5392B` (rouge **tampon** — numéros manuscrits, « validations »)
- `--moss #3E4A36` (vert sombre — biodiversité, **accent rare et précieux**)
- `--stone`, `--stone-light` (gris chauds — légendes, filets)

**Typographie** *(alignée sur le design Claude « Site Agence L&L » — cf. `tokens.css`)*
- **Display : Cormorant Garamond** (serif éditorial) — titres, manifeste, noms de
  projet. Registre architectural, contraste maîtrisé.
- **Corps : Hanken Grotesk** — texte courant (grotesque chaud, moins « par défaut »
  qu'Inter).
- **Mono : IBM Plex Mono** — métadonnées : codes projet, années, surfaces, lieux, labels.
- *(Plus de script « manuscrit » : le design retenu n'a pas de numéros à la main ;
  `--font-script` est un alias de Cormorant, conservé pour compatibilité.)*

**Signature — l'élément qu'on retient.** Le **sceau-pieuvre L&L** (linogravure :
tentacules, systèmes vivants — référence personnelle de Julien) est **intégré et
validé** dans `Monogram.astro` (vrai SVG). Trois variantes : `mark` (pieuvre seule —
header/favicon), `plain` (pieuvre + cercles, sans texte — formats moyens), `seal`
(tampon complet avec texte circulaire — hero/grand format). Il apparaît : (a) en
marque dans le header, (b) en **grand sceau** dans le hero, (c) en **tampon** ailleurs.
Julien pourra l'affiner (ou substituer une gravure Affinity), mais **la direction est
arrêtée** — rendu cible dans `design/accueil-prototype.html`.

**Mise en page.** Grille éditoriale, **marges généreuses**, asymétrie assumée.
**Zéro arrondi** (`--radius: 0`). Filets fins **avec parcimonie** (pas le cliché
broadsheet dense). Photographie en **pleine largeur** par endroits, laissée
respirer.

**Mouvement — couche immersive (DÉCISION révisée 29/06/2026).** Le design Claude validé
**assume des effets immersifs**, reproduits fidèlement (voir §14) :
- **Survol immersif** de la grille projets (atténuation des voisins + nom géant plein écran) ;
- **Recoloration de page par catégorie** de projet, avec **transition douce entre pages**
  via les **View Transitions** d'Astro (`<ClientRouter/>`) — navigation type SPA ;
- **Carrousel plein écran** (clavier + flèches au survol des bords) ;
- **Carte de France interactive** (zoom au survol, filtre par département) ;
- **Axonométries générées** par projet (massing → SVG, teintées par catégorie).

Toujours **pas de WebGL/3D, pas de parallaxe, pas de scroll-jacking** : tout est en
CSS + petites îles JS, perf préservée. `prefers-reduced-motion` est respecté
(`global.css` neutralise les transitions ; ClientRouter désactive ses animations) et
le survol immersif est **gardé derrière `(hover: hover)`** (pas sur tactile). **Garde
ces garde-fous.**

**Plancher de qualité (non négociable) :** responsive jusqu'au mobile, focus
clavier visible (`:focus-visible`), contrastes AA, `alt` sur toutes les images,
HTML sémantique.

---

## 6. Conventions de code

- **Composants `.astro`** par défaut ; n'ajoute un îlot React/Svelte que pour un
  besoin **interactif réel** (carrousel, carte, filtre dynamique) — avec
  `client:visible` de préférence.
- **CSS scopé** dans chaque composant (`<style>`). Pas de framework CSS (pas de
  Tailwind) sur ce projet : on tient un système de tokens à la main, c'est voulu.
- **Attention aux spécificités CSS** : évite que `.section` et un sélecteur
  d'élément s'annulent sur les marges/paddings entre sections.
- **Images de contenu : `<Image>`** (`astro:assets`) avec `widths`/`sizes`, jamais
  `<img>`. Renseigne toujours `alt`.
- **Français** pour l'UI et le contenu ; noms de variables/fichiers en anglais
  technique si plus clair.
- **Accessibilité** traitée à la source, pas en rattrapage.

---

## 7. Contenu — modèle « projet »

Schéma dans `src/content.config.ts`. Champs : `titre`, `numero` (rendu manuscrit
rouge), `annee`, `lieu`, `programme`, `statut` (`concours|étude|chantier|livré`),
`surface?`, `maitrise_ouvrage?`, `resume`, `couverture?`, `galerie?`, `tags`,
`brouillon`, `ordre?`.

**Ajouter un projet :**
1. Crée `src/content/projets/<slug>/index.mdx`.
2. Remplis le frontmatter (voir l'exemple `exemple-rehabilitation-thermique/`).
3. Dépose les images **dans le même dossier**, puis renseigne
   `couverture: "./couverture.jpg"` et `galerie: [{ src: "./img1.jpg", alt: "…" }]`.
4. Le corps (sous le frontmatter) est du Markdown/MDX libre.

> `couverture` et `galerie` sont **facultatifs** : sans image, les cartes affichent
> un **placeholder tramé avec le numéro** (volontairement « épreuve à venir »). Le
> site **build donc sans aucune image**.

### 7bis. Contenu — modèle « article » (Journal)

Le site est aussi un **support éditorial** : un fil d'articles (« Journal ») qui
mêle retours de chantier, partis pris techniques, presse et distinctions. C'est la
**logique** retenue de la direction « 01 éditorial » — rendue dans **le style
maison existant** (Fraunces/Hanken/JetBrains Mono, palette papier/terre cuite,
sceau, zéro arrondi), pas dans la palette du prototype.

Collection `journal` dans `src/content.config.ts`. Champs : `titre`, `rubrique`
(`chantiers|reflexions|presse|distinctions`), `date` (ISO), `tempsLecture?`,
`extrait` (sert d'accroche **et** de chapô), `signature`, `image?`, `imageLegende?`
(légende du placeholder), `projetLie?` (slug d'un projet → carte « Projet lié »),
`linkedInUrl?`, `brouillon`.

- **Pages** : `/journal` (index + **filtres par rubrique**, filtrage client + URL
  `?rubrique=…`), `/journal/[id]` (article : chapô, corps MDX, projet lié, barre
  de partage LinkedIn/copier-le-lien, navigation plus récent/plus ancien).
- **Aperçu d'accueil** : section « Au journal » (3 derniers billets).
- **Helpers** : `src/lib/journal.ts` (libellés de rubriques, formats de date).
- **Composant** : `ArticleCard.astro`. Mêmes conventions que les projets (un
  dossier par billet `src/content/journal/<slug>/index.mdx`, images colocalisées,
  build sans aucune image — placeholder tramé + légende monospace `[ … ]`).

---

## 8. Formulaire de contact

Site statique ⇒ il faut un service côté serveur. Deux options :
- **Formspree (le plus simple)** : crée un formulaire, colle l'endpoint dans
  `contact.astro` (constante `FORMSPREE_ENDPOINT`). Zéro backend.
- **Sans tiers (Resend)** : passe `output: 'server'` + adaptateur
  `@astrojs/vercel`, ajoute une **route API** qui envoie l'e-mail via **Resend**
  (clé API en variable d'environnement, **jamais** en dur). Plus de contrôle, un
  poil plus de mise en place.

(On ne stocke pas les soumissions en base pour la v1 — l'e-mail suffit. Si un jour
on veut un historique/CRM, **c'est le seul endroit** où Supabase pourrait revenir.)

---

## 9. Feuille de route (ordre de construction conseillé)

Construis dans cet ordre — le design system d'abord, sinon on rattrape mal.

1. **Fondations** ✅ (en place) — tokens, `Base.astro`, header/footer, global.css,
   schéma de contenu, **sceau-pieuvre intégré (vrai SVG)**, **maquette d'accueil
   validée** dans `design/`.
2. **Accueil** — affiner le hero (la thèse), l'approche, la sélection de projets,
   le CTA. *(Squelette déjà posé dans `index.astro`.)*
3. **Page Agence** — manifeste, savoir-faire, équipe (Julien + Zoé), territoire.
   *(Squelette dans `agence.astro` — étoffer le texte avec Julien.)*
4. **Projets** — index éditorial + page projet (galerie, fiche technique, corps).
   *(En place ; ajouter de vrais projets.)*
5. **Contact** — brancher Formspree **ou** la route Resend ; page mentions légales.
6. **Finitions** — favicon/OG définitifs (depuis le monogramme), `sitemap`,
   `robots.txt`, perfs images, micro-animations au scroll, vérif a11y/contrastes.
7. **CMS TinaCMS** (édition visuelle au clic) — **INTÉGRÉ ✓** (voir §11).
8. **Déploiement** — Vercel + domaine (voir §10).

> **Transversal — bilingue FR/EN (validé).** À câbler **tôt** (ça touche le routage et
> le contenu) : i18n natif d'Astro, `defaultLocale: 'fr'`, FR à la racine `/`, EN sous
> `/en/`. Le sélecteur `FR · EN` est déjà prototypé dans le header. Détails en §12.

**Améliorations perf à connaître :** auto-héberger les polices via `@fontsource`
(plutôt que Google Fonts en `<link>`) pour gagner sur le LCP ; envisager un CDN
d'images seulement si la photothèque devient énorme.

---

## 10. Déploiement

- **Vercel** : connecte le dépôt GitHub → Vercel détecte Astro tout seul → déploie
  à chaque push sur `main`. Renseigne le domaine dans le dashboard **et** dans
  `astro.config.mjs` (`site:`) pour le sitemap/les URLs canoniques.
- **Cloudflare Pages** : alternative gratuite/rapide, build command `npm run build`,
  dossier `dist/`.

---

## 11. CMS — TinaCMS, édition visuelle React-free (INTÉGRÉ ✓)

**Réponse directe à « faut-il Supabase pour gérer le contenu » : toujours non.**
Le CMS est **TinaCMS** avec l'intégration **`@tinacms/astro`** (bridge vanilla-JS,
mai 2026) : édition **au clic sur la page** dans l'admin **`/admin`**, contenu
réécrit en **fichiers Markdown/MDX committés dans le dépôt** (via **Tina Cloud**
en prod : auth GitHub + un commit par sauvegarde). **Aucune base.**
*(Keystatic a été retiré — Tina couvre le besoin avec l'édition visuelle en plus.)*

**Architecture (à respecter) :**
- Pages publiques **statiques et sans React** (le bridge est un no-op hors admin).
  Une seule route à la demande : **`/tina-island/[name]`** (`prerender:false`) —
  l'endpoint que le bridge re-fetche pour re-rendre une région éditée.
- Schéma : **`tina/config.ts`** (collections `projets`, `journal`, `equipe` +
  singleton `accueil` avec **référence `projetVedette`**). Mêmes fichiers que les
  content collections Astro.
- Fetchers : `src/lib/tina-data.ts` (`requestWithMetadata`) ; registre d'îlots :
  `src/lib/islands.ts` ; régions éditables : `src/components/islands/*.astro`
  (`tinaField()` + `<TinaMarkdown>`), montées via `<TinaIsland>` dans les pages.
- Images : media store **`public/uploads`** (git). Les images **colocalisées**
  dans `src/content/**` restent **optimisées** par `astro:assets`
  (`src/lib/projet-images.ts` résout les chemins Tina → imports d'images).
  ⚠️ Les schémas des content collections utilisent **`z.string()`** (pas
  `image()`) pour les champs image — sinon un upload Tina (`/uploads/…`)
  casserait le build.
- Build : **`tinacms build && astro build`** (cloud) avec repli **local**
  (`tinacms dev -c "astro build"`) si identifiants absents/cloud indisponible —
  cf. `vercel.json`. Identifiants : `PUBLIC_TINA_CLIENT_ID` + `TINA_TOKEN`
  (variables d'env Vercel, jamais en dur). Détails : **`docs/tina.md`** + README.
- ⚠️ Tina Cloud **indexe par branche** : `main` doit être indexée sur app.tina.io
  (sinon `ERR_CLOUD_CHECK_FAILED` au build cloud → le repli local prend le relais).

---

## 12. Décisions — tranchées ✅ (28/06/2026)

1. **CMS → OUI → INTÉGRÉ ✓ (révisé 30/06/2026).** **TinaCMS** (git-based via Tina
   Cloud, **édition visuelle au clic**, sans React sur les pages publiques) : admin
   `/admin`, projets + Journal + équipe + projet vedette. Détails §11 et `docs/tina.md`.
   *(Keystatic, un temps intégré, a été retiré au profit de Tina.)*
2. **Bilingue FR/EN → OUI → INFRA EN PLACE (EN à finir).** i18n natif d'Astro câblé
   (`astro.config.mjs` : `defaultLocale:'fr'`, `locales:['fr','en']`,
   `prefixDefaultLocale:false`). Dictionnaire d'**interface** FR/EN dans
   `src/i18n/` ; le chrome (header, footer, cartes) se traduit via
   `Astro.currentLocale`. **Décision : on ne traduit que l'interface pour
   l'instant** (le contenu — prose, articles, projets — reste FR). L'**arbre
   `/en/` existe** (routes EN qui réutilisent les pages FR comme composants ;
   `getStaticPaths` partagés via `src/lib/paths.ts`) et le **sélecteur FR·EN est
   actif** (`readyLocales = ['fr','en']`). Pour ajouter une langue : créer ses
   pages `/xx/` + l'ajouter au dictionnaire `src/i18n/ui.ts` et à `readyLocales`.
3. **« Moment statement » → IMMERSIF (révisé 29/06/2026).** On reproduit **à la
   perfection** le design Claude « Site Agence L&L » et **ses effets immersifs**
   (survol plein écran, recoloration par catégorie + transitions de vue, carrousel,
   carte interactive, axonométries générées). Voir §14. **Toujours pas de
   3D/WebGL/parallaxe** : CSS + petites îles JS, perf + a11y préservées.

---

## 13. À NE PAS faire

- ❌ Laisser le site **collapser vers le look IA « crème + serif + terracotta »**.
  La singularité passe par les **axonométries dessinées** (générées par projet),
  la **recoloration par catégorie**, le **survol immersif**, la **grille éditoriale
  asymétrique**, les **métadonnées en monospace** et la **photo de matière**.
  *(NB : le design Claude validé n'utilise PAS le sceau-pieuvre ; `Monogram.astro`
  reste dispo mais le header/footer portent le mot-marque « Agence L&L ».)*
- ❌ Ajouter **Supabase / une base** pour du contenu statique.
- ❌ Mettre **Tailwind** : on tient un système de tokens à la main (choix assumé).
- ❌ **`<img>`** pour le contenu : toujours `<Image>` (`astro:assets`).
- ❌ Multiplier les animations **gratuites** : les effets immersifs (§14) sont
  **délibérés et tirés du prototype validé** ; n'en ajoute pas d'autres sans raison,
  et garde `prefers-reduced-motion` + le garde-fou `(hover: hover)`.
- ❌ Mettre une **clé API / un secret en dur** (variables d'environnement).
- ❌ Oublier le **plancher d'accessibilité** (focus visible, alt, contrastes, mobile).
- ❌ Redessiner le sceau ailleurs / le coder en dur — **utilise `Monogram.astro`**.
- ❌ S'écarter du **design Claude validé** (`design/Site_Agence_LL` — prototype de
  référence reproduit en §14) sans raison.

---

## 14. Couche immersive — reproduction du design Claude (29/06/2026)

Le prototype Claude « Site Agence L&L » (SPA) a été **reproduit nativement** dans
l'architecture Astro multi-pages. Effets et où ils vivent :

| Effet | Implémentation |
|---|---|
| **Axonométries générées** par projet (massing → SVG, faces L/R, toit, étages, volume accent) | `src/lib/axono.ts` (`axoSvg`) + `src/components/Axono.astro` (prend `id` ou `spec`) |
| **Catégorie + département + massing** par projet | `src/lib/projets-data.ts` (`PROJETS_META`, `catFromText`, `deptFromLieu`) |
| **Palettes par catégorie** (renovation/logements/equipements/neuf + défaut) | `projets-data.ts` (`CAT_THEMES`, `themeForCat`) → `src/lib/teinte.ts` |
| **Recoloration de page** (fond + nav + footer + accent) sur la fiche projet | `teintePageVars()` sur `<body style>` (Base) ; `--paper/--nav-bg/--footer-bg` |
| **Transition de thème entre pages** (effet « la page se recolore ») | **View Transitions** `<ClientRouter/>` (Base) + `transition` sur body/header/footer + `::view-transition-*(root)` 0.5s dans `global.css` |
| **Survol immersif** (atténue les voisins + nom géant plein écran) | `src/pages/projets/index.astro` (overlay `#proj-overlay` + script, **gardé `(hover:hover)` + reduced-motion**) |
| **Carte de France interactive** (contour réel + 96 départements, **zoom au survol/focus** pour sélectionner, filtre par département) | `projets-data.ts` (`FRANCE_PATH`, `DEPT_POS`, `DEPT_NAMES`) + SVG/JS dans `projets/index.astro` |
| **Filtres** catégorie + département + **tri** récent/ancien + reset lieu | script de `projets/index.astro` (état `{cat,dept,sort}`, `style.order` + `display`) |
| **Carrousel plein écran** (compteur, fermer, flèches au survol des bords, clavier Esc/←/→, verrou scroll) | `src/pages/projets/[id].astro` (overlay `#carousel` + script) |
| **Menu mobile** (bouton « Menu » → panneau) | `src/components/Header.astro` |

**Gotchas à respecter (sinon ça casse après navigation ClientRouter) :**
- Tout script d'île s'initialise sur **`astro:page-load`** (pas au simple chargement) —
  les modules ne se ré-exécutent pas à la navigation. Garde anti-double-init via
  `dataset.wired`.
- Les listeners **window** (clavier du carrousel) sont attachés **une seule fois** au
  scope module ; le contrôleur courant est mis à jour par page.
- Le verrou de scroll du carrousel est libéré sur fermeture **et** sur
  `astro:before-swap`.
- Les pages `/en/*` **réutilisent les composants FR** : les scripts et `localizePath`
  fonctionnent tels quels.

Mettre à jour un projet : son massing/catégorie/département vivent dans
`PROJETS_META` (`projets-data.ts`), clé = identifiant de la collection (dossier).
