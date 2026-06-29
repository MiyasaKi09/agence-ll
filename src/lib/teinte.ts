// Logique de teinte par projet (reprise du Claude design « Site Agence L&L »).
// Chaque projet relève d'une CATÉGORIE (rénovation / logements / équipements /
// neuf) qui détermine sa palette : axonométries + placeholders + accent, et sur
// sa fiche c'est TOUTE la page qui se recolore (fond + nav + footer + accent),
// avec une transition douce entre pages (cf. Base.astro + ClientRouter).
import {
  PROJETS_META, themeForCat, DEFAULT_THEME, type Cat, type CatTheme,
} from './projets-data';

export interface Teinte {
  ph1: string; ph2: string; surface: string;
  accent: string; accentDeep: string;
  paper: string; paperDeep: string;
  navBg: string; footerBg: string;
}

function toTeinte(t: CatTheme): Teinte {
  return {
    ph1: t.ph1, ph2: t.ph2, surface: t.surface,
    accent: t.accent, accentDeep: t.accentDeep,
    paper: t.pageBg, paperDeep: t.pageDeep,
    navBg: t.navBg, footerBg: t.footerBg,
  };
}

/** Teinte d'une catégorie. */
export function teinteForCat(cat: Cat): Teinte {
  return toTeinte(themeForCat(cat));
}

/** Teinte d'un projet (par son identifiant de collection). */
export function teinteFor(id: string): Teinte {
  const meta = PROJETS_META[id];
  return toTeinte(meta ? themeForCat(meta.cat) : DEFAULT_THEME);
}

/** Teinte par défaut (pages hors fiche projet). */
export const TEINTE_DEFAULT: Teinte = toTeinte(DEFAULT_THEME);

// Variables CSS pour un élément teinté (axonométrie / placeholder).
export function teinteVars(t: Teinte): string {
  return `--ph1:${t.ph1};--ph2:${t.ph2};--surface:${t.surface};--teinte-accent:${t.accent};`;
}

// Variables CSS pour recolorer TOUTE la page (fond + surfaces + accent + nav +
// footer). Appliquées sur <body> de la fiche projet — la transition .5s du
// fond (global) anime le changement entre deux projets de catégories différentes.
export function teintePageVars(t: Teinte): string {
  return (
    `--paper:${t.paper};--paper-deep:${t.paperDeep};--surface:${t.surface};` +
    `--ph1:${t.ph1};--ph2:${t.ph2};` +
    `--nav-bg:${t.navBg};--footer-bg:${t.footerBg};` +
    `--terracotta:${t.accent};--terracotta-deep:${t.accentDeep};--seal:${t.accent};--teinte-accent:${t.accent};`
  );
}
