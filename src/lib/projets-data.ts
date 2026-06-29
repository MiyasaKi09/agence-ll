// =====================================================================
// Données « immersives » par projet — reprise fidèle du design Claude
// « Site Agence L&L ».
//
// Le contenu éditorial vit dans les content collections (src/content/projets).
// Ici on ne stocke QUE ce que le prototype calcule en JS et qui n'a pas sa
// place dans le frontmatter :
//   • cat    — catégorie qui pilote la teinte de page + les filtres
//   • dept   — code département (carte Île-de-France interactive)
//   • axo    — massing (boîtes) de l'axonométrie générée du projet
//
// Clés = identifiants de la collection (nom du dossier dans content/projets/).
// =====================================================================

export type Cat = 'renovation' | 'logements' | 'equipements' | 'neuf';

/** Une boîte du massing axonométrique (cf. src/lib/axono.ts). */
export interface AxoBox {
  x: number; y: number; z?: number;
  w: number; d: number; h: number;
  /** hauteur de la toiture à deux pentes (sinon toit plat) */
  roof?: number;
  /** nombre de niveaux (trace les nez de dalle) */
  floors?: number;
  /** volume mis en accent (terre cuite) — ex. une surélévation */
  accent?: boolean;
}

export interface ProjetMeta {
  cat: Cat;
  dept: string;
  axo: AxoBox[];
}

// Massing + catégorie + département de chaque projet (déduits du prototype et
// du contenu). Un projet absent d'ici reçoit un fallback (voir metaFor).
export const PROJETS_META: Record<string, ProjetMeta> = {
  'maison-ourcq':                 { cat: 'renovation',  dept: '93', axo: [{ x: 0, y: 0, w: 3, d: 4, h: 4, roof: 2 }] },
  'grange-de-brou':               { cat: 'renovation',  dept: '28', axo: [{ x: 0, y: 0, w: 9, d: 4, h: 2, roof: 3 }] },
  'ecole-des-saules':             { cat: 'equipements', dept: '93', axo: [{ x: 0, y: 0, w: 8, d: 4, h: 3 }, { x: 8, y: 0.8, w: 2.6, d: 2.6, h: 2.4 }] },
  'atelier-vasseur':              { cat: 'renovation',  dept: '93', axo: [{ x: 0, y: 0, w: 3.4, d: 3.4, h: 2.6, roof: 1.3 }] },
  'villa-coteaux':                { cat: 'neuf',         dept: '91', axo: [{ x: 0, y: 0, w: 4, d: 4, h: 3 }, { x: 3.2, y: 0, z: 1.3, w: 3, d: 4, h: 3 }] },
  'logements-magasins-generaux':  { cat: 'logements',   dept: '93', axo: [{ x: 0, y: 0, w: 11, d: 4, h: 6, floors: 4 }] },
  'mediatheque-briqueterie':      { cat: 'equipements', dept: '93', axo: [{ x: 0, y: 0, w: 7, d: 5, h: 5, roof: 2 }, { x: 7, y: 1, w: 3, d: 3, h: 3 }] },
  'surelevation-menilmontant':    { cat: 'logements',   dept: '75', axo: [{ x: 0, y: 0, w: 6, d: 4, h: 5, floors: 3 }, { x: 0.4, y: 0.3, z: 5, w: 5.2, d: 3.4, h: 2.2, accent: true, roof: 1 }] },
  'exemple-rehabilitation-thermique': { cat: 'renovation', dept: '76', axo: [{ x: 0, y: 0, w: 7, d: 4, h: 6, floors: 4 }] },
};

// Déduction de la catégorie quand un projet n'est pas listé ci-dessus
// (mêmes règles que l'ancien filtre de projets/index).
export function catFromText(programme: string, tags: string[] = []): Cat {
  const s = `${programme} ${tags.join(' ')}`.toLowerCase();
  if (s.includes('logement') || s.includes('surélév') || s.includes('surelev')) return 'logements';
  if (s.includes('équipement') || s.includes('equipement') || s.includes('école') || s.includes('ecole') || s.includes('médiathèque') || s.includes('mediatheque')) return 'equipements';
  if (s.includes('rénovation') || s.includes('renovation') || s.includes('réhab') || s.includes('rehab')) return 'renovation';
  return 'neuf';
}

export function deptFromLieu(lieu: string): string {
  const m = lieu.match(/\((\d{2,3})\)/);
  if (m) return m[1];
  if (/paris/i.test(lieu)) return '75';
  return '';
}

/** Métadonnées d'un projet. Une `categorie` explicite (select Tina/frontmatter)
 *  l'emporte sur la déduction ; le massing reste celui de PROJETS_META. */
export function metaFor(
  id: string,
  fallback: { programme: string; tags?: string[]; lieu: string; categorie?: Cat },
): ProjetMeta {
  const explicit = PROJETS_META[id];
  const base: ProjetMeta = explicit ?? {
    cat: catFromText(fallback.programme, fallback.tags),
    dept: deptFromLieu(fallback.lieu),
    axo: [{ x: 0, y: 0, w: 4, d: 4, h: 4, roof: 2 }],
  };
  return fallback.categorie ? { ...base, cat: fallback.categorie } : base;
}

// — Palettes par catégorie (catTheme du prototype) ————————————————————
export interface CatTheme {
  accent: string; accentDeep: string;
  pageBg: string; pageDeep: string; navBg: string; surface: string;
  ph1: string; ph2: string; footerBg: string;
}

export const CAT_THEMES: Record<Cat, CatTheme> = {
  renovation:  { accent: '#B86B4B', accentDeep: '#9A5538', pageBg: '#F3EBE0', pageDeep: '#ECE0CE', navBg: 'rgba(243,235,224,.82)', surface: '#ECE0CE', ph1: '#E2D2B8', ph2: '#D5C0A0', footerBg: '#2A211A' },
  logements:   { accent: '#A6803A', accentDeep: '#866229', pageBg: '#F3EEDC', pageDeep: '#ECE4CC', navBg: 'rgba(243,238,220,.82)', surface: '#ECE4CC', ph1: '#E1D4AE', ph2: '#D3C295', footerBg: '#272316' },
  equipements: { accent: '#41617A', accentDeep: '#314B60', pageBg: '#E9EEF1', pageDeep: '#DEE5EC', navBg: 'rgba(233,238,241,.82)', surface: '#DEE5EC', ph1: '#CDD8E1', ph2: '#B8C6D2', footerBg: '#1C2731' },
  neuf:        { accent: '#5C6E48', accentDeep: '#475537', pageBg: '#ECF0E6', pageDeep: '#DEE4D2', navBg: 'rgba(236,240,230,.82)', surface: '#DEE4D2', ph1: '#CDD7BC', ph2: '#BAC8A4', footerBg: '#222B1B' },
};

/** Palette « par défaut » de page (hors fiche projet) — terre cuite. */
export const DEFAULT_THEME: CatTheme = {
  accent: '#B86B4B', accentDeep: '#9A5538', pageBg: '#F6F2EB', pageDeep: '#EFE9DE',
  navBg: 'rgba(246,242,235,.82)', surface: '#EFE9DE', ph1: '#E7DFD0', ph2: '#D8CCB7', footerBg: '#1A1714',
};

export function themeForCat(cat: Cat): CatTheme {
  return CAT_THEMES[cat] ?? DEFAULT_THEME;
}

// — Carte Île-de-France (mapEl du prototype) ——————————————————————————
/** Contour stylisé de la région (blob). */
export const IDF_BLOB =
  'M86,54 C120,36 168,40 196,58 C232,52 264,82 262,120 C266,160 240,196 198,202 C158,214 116,212 92,192 C60,200 34,176 42,140 C36,108 58,74 86,54 Z';

/** Position de chaque département sur la carte (viewBox 0 0 300 240). */
export const DEPT_POS: Record<string, { x: number; y: number }> = {
  '95': { x: 120, y: 54 }, '78': { x: 55, y: 120 }, '92': { x: 120, y: 122 },
  '75': { x: 150, y: 118 }, '93': { x: 188, y: 90 }, '94': { x: 176, y: 150 },
  '91': { x: 132, y: 196 }, '77': { x: 246, y: 128 }, '28': { x: 30, y: 212 },
};

export const DEPT_NAMES: Record<string, string> = {
  '95': 'Val-d’Oise', '78': 'Yvelines', '92': 'Hauts-de-Seine', '75': 'Paris',
  '93': 'Seine-Saint-Denis', '94': 'Val-de-Marne', '91': 'Essonne',
  '77': 'Seine-et-Marne', '28': 'Eure-et-Loir', '76': 'Seine-Maritime',
};
