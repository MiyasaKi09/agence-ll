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
  const m = lieu.match(/\((\d{2,3}|2A|2B)\)/i);
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

// — Carte du grand Nord (contour réel simplifié + centroïdes) ————————————————
// Union des régions Normandie · Hauts-de-France · Île-de-France · Grand Est
// (frontières internes annulées), dérivée de france-geojson et simplifiée
// Douglas-Peucker, projetée dans un viewBox 0 0 300 165. DEPT_POS couvre les
// 96 départements dans la même projection : la page ne dessine que les
// pastilles qui tombent dans le cadre — un projet hors zone n'en affiche pas.
export const FRANCE_VIEWBOX = '0 0 300 165';

export const FRANCE_PATH =
  "M158.0,121.7 L147.3,123.1 L146.2,125.5 L147.2,128.0 L140.5,133.4 L139.8,131.7 L137.1,133.7 L129.4,133.7 L131.6,131.8 L131.6,129.0 L128.8,127.6 L128.2,124.8 L123.6,125.8 L122.3,123.8 L121.2,125.8 L115.5,126.3 L116.0,122.9 L114.2,121.0 L114.3,118.7 L110.5,118.3 L110.1,114.3 L104.6,109.4 L104.5,101.5 L101.6,96.9 L96.6,105.0 L90.4,103.7 L90.2,105.6 L83.6,106.8 L81.3,109.2 L81.6,111.8 L85.9,115.7 L85.0,117.9 L86.2,119.5 L80.1,124.8 L81.9,129.8 L79.8,131.2 L77.5,127.8 L73.2,128.0 L71.8,125.3 L69.1,124.8 L68.7,120.1 L66.3,117.6 L55.9,122.4 L55.9,118.9 L53.1,118.7 L53.1,115.5 L51.3,113.9 L47.0,117.5 L42.4,116.3 L38.2,119.3 L37.7,117.4 L35.0,119.6 L32.5,116.8 L20.6,114.8 L15.3,118.5 L13.5,117.2 L11.1,111.0 L17.6,110.8 L16.2,109.7 L16.9,108.3 L14.8,109.8 L13.1,108.3 L9.8,101.7 L11.6,97.2 L11.7,98.9 L11.5,93.0 L13.0,93.3 L11.4,92.5 L11.0,94.2 L10.3,92.5 L9.9,84.3 L11.2,84.2 L9.5,84.7 L7.0,79.5 L8.1,79.2 L4.1,77.4 L1.8,70.5 L3.2,68.2 L2.9,65.7 L0.0,63.8 L0.0,61.9 L9.8,65.2 L14.0,62.8 L20.1,62.8 L21.2,66.9 L18.9,69.8 L23.9,78.2 L29.5,76.4 L50.8,81.5 L54.8,80.8 L61.2,76.0 L67.4,74.6 L61.0,73.3 L59.4,71.2 L63.5,62.0 L74.6,55.8 L92.6,50.5 L99.9,44.6 L103.0,39.4 L107.0,41.0 L102.7,36.5 L103.2,32.8 L105.8,33.2 L103.2,31.2 L104.0,25.0 L106.3,26.2 L103.9,23.3 L104.0,9.8 L109.9,6.0 L119.9,4.4 L120.8,2.5 L121.6,3.7 L121.4,2.0 L132.4,0.0 L135.0,6.4 L133.7,7.7 L134.0,10.8 L137.7,12.6 L139.6,16.4 L143.0,17.9 L144.3,15.2 L150.2,13.5 L153.5,17.5 L154.3,25.4 L163.7,26.7 L165.3,28.5 L165.2,32.5 L166.7,35.4 L167.8,33.3 L172.3,34.3 L176.0,32.9 L179.3,37.5 L181.4,36.8 L179.0,43.0 L181.1,43.0 L182.1,45.8 L179.3,48.2 L181.0,51.1 L188.4,51.9 L195.7,49.3 L195.7,45.3 L199.6,41.5 L201.7,42.9 L198.5,50.5 L201.5,53.2 L200.4,58.4 L204.6,58.1 L209.6,63.0 L212.7,62.8 L214.5,64.7 L213.9,66.6 L217.4,67.3 L218.4,71.7 L227.5,68.8 L235.4,74.0 L241.3,71.0 L250.2,74.7 L251.9,77.7 L250.9,78.5 L253.9,81.6 L256.0,86.8 L258.8,87.4 L258.9,84.6 L261.5,84.1 L264.7,85.6 L265.3,89.1 L266.6,87.2 L272.3,89.0 L276.8,85.9 L282.4,91.8 L291.2,91.6 L300.0,95.7 L287.3,112.8 L285.6,124.5 L280.7,133.9 L280.4,137.8 L282.0,140.5 L278.7,153.0 L281.1,157.5 L275.0,164.9 L268.7,164.4 L269.6,162.1 L267.5,161.7 L266.0,157.5 L263.8,157.2 L265.1,153.5 L264.1,150.9 L259.7,149.1 L252.1,141.8 L248.3,144.5 L245.7,141.1 L240.2,142.4 L238.1,138.2 L232.7,142.2 L232.2,140.3 L229.1,146.0 L225.1,147.4 L225.1,153.5 L217.1,153.8 L215.2,157.7 L212.2,158.4 L212.3,156.3 L210.0,153.7 L208.4,155.2 L205.6,152.4 L203.8,153.5 L203.5,150.0 L202.3,149.3 L204.6,147.4 L201.9,142.9 L199.8,143.5 L200.8,142.0 L198.4,140.9 L198.5,138.9 L192.5,137.9 L191.0,139.0 L191.6,140.8 L184.5,141.0 L183.9,142.6 L181.2,140.5 L181.2,141.9 L178.5,142.6 L172.4,142.7 L172.6,140.1 L170.8,140.0 L171.5,138.5 L167.8,131.8 L165.5,133.0 L164.5,130.8 L162.9,131.0 L164.0,127.1 Z";

/** Centre de chaque département (même projection que FRANCE_PATH). */
export const DEPT_POS: Record<string, { x: number; y: number }> = {'01': { x: 215.0, y: 225.0 }, '02': { x: 162.3, y: 68.9 }, '03': { x: 151.3, y: 211.7 }, '04': { x: 241.4, y: 314.9 }, '05': { x: 242.0, y: 289.7 }, '06': { x: 267.1, y: 322.5 }, '07': { x: 187.8, y: 285.7 }, '08': { x: 194.1, y: 66.4 }, '09': { x: 101.7, y: 368.3 }, '10': { x: 180.0, y: 125.6 }, '11': { x: 128.5, y: 360.1 }, '12': { x: 136.3, y: 307.0 }, '13': { x: 207.3, y: 340.3 }, '14': { x: 46.7, y: 89.7 }, '15': { x: 136.0, y: 272.3 }, '16': { x: 63.4, y: 242.2 }, '17': { x: 38.1, y: 240.0 }, '18': { x: 130.8, y: 181.4 }, '19': { x: 112.7, y: 258.5 }, '21': { x: 198.0, y: 165.2 }, '22': { x: -27.0, y: 119.4 }, '23': { x: 116.9, y: 225.4 }, '24': { x: 79.2, y: 269.8 }, '25': { x: 244.9, y: 176.9 }, '26': { x: 209.5, y: 289.0 }, '27': { x: 86.8, y: 89.1 }, '28': { x: 97.8, y: 121.8 }, '29': { x: -62.1, y: 127.5 }, '2A': { x: 322.2, y: 416.0 }, '2B': { x: 328.7, y: 392.1 }, '30': { x: 180.6, y: 320.0 }, '31': { x: 92.0, y: 348.6 }, '32': { x: 70.7, y: 333.5 }, '33': { x: 40.2, y: 281.8 }, '34': { x: 156.7, y: 338.6 }, '35': { x: 9.3, y: 132.5 }, '36': { x: 103.8, y: 194.4 }, '37': { x: 77.8, y: 172.7 }, '38': { x: 221.6, y: 262.7 }, '39': { x: 225.3, y: 196.6 }, '40': { x: 34.3, y: 321.2 }, '41': { x: 99.5, y: 156.6 }, '42': { x: 180.1, y: 241.8 }, '43': { x: 169.6, y: 268.8 }, '44': { x: 7.9, y: 168.0 }, '45': { x: 126.5, y: 143.3 }, '46': { x: 104.7, y: 291.5 }, '47': { x: 71.0, y: 303.1 }, '48': { x: 160.5, y: 296.3 }, '49': { x: 40.9, y: 166.8 }, '50': { x: 18.2, y: 90.5 }, '51': { x: 182.3, y: 96.5 }, '52': { x: 211.4, y: 134.3 }, '53': { x: 38.0, y: 132.7 }, '54': { x: 239.0, y: 103.8 }, '55': { x: 216.0, y: 94.6 }, '56': { x: -25.2, y: 145.8 }, '57': { x: 253.7, y: 92.5 }, '58': { x: 160.7, y: 179.2 }, '59': { x: 152.2, y: 28.9 }, '60': { x: 128.9, y: 75.7 }, '61': { x: 61.2, y: 111.2 }, '62': { x: 124.8, y: 26.9 }, '63': { x: 149.9, y: 241.8 }, '64': { x: 35.1, y: 353.2 }, '65': { x: 62.3, y: 362.5 }, '66': { x: 131.7, y: 382.8 }, '67': { x: 279.9, y: 109.0 }, '68': { x: 271.7, y: 145.6 }, '69': { x: 194.1, y: 235.3 }, '70': { x: 236.8, y: 155.5 }, '71': { x: 191.3, y: 200.4 }, '72': { x: 64.0, y: 139.5 }, '73': { x: 247.2, y: 253.0 }, '74': { x: 246.8, y: 227.9 }, '75': { x: 126.4, y: 100.7 }, '76': { x: 87.7, y: 64.7 }, '77': { x: 143.9, y: 111.0 }, '78': { x: 111.7, y: 102.5 }, '79': { x: 48.0, y: 204.4 }, '80': { x: 124.5, y: 51.0 }, '81': { x: 121.2, y: 329.3 }, '82': { x: 95.2, y: 315.8 }, '83': { x: 241.4, y: 344.8 }, '84': { x: 210.2, y: 319.9 }, '85': { x: 19.5, y: 199.2 }, '86': { x: 70.9, y: 204.0 }, '87': { x: 93.8, y: 234.3 }, '88': { x: 245.4, y: 130.4 }, '89': { x: 162.4, y: 146.5 }, '90': { x: 261.6, y: 155.9 }, '91': { x: 123.5, y: 115.7 }, '92': { x: 123.6, y: 101.1 }, '93': { x: 130.4, y: 97.9 }, '94': { x: 130.2, y: 104.2 }, '95': { x: 120.2, y: 90.5 }};

export const DEPT_NAMES: Record<string, string> = {
  '01': 'Ain', '02': 'Aisne', '03': 'Allier', '04': 'Alpes-de-Haute-Provence',
  '05': 'Hautes-Alpes', '06': 'Alpes-Maritimes', '07': 'Ardèche', '08': 'Ardennes',
  '09': 'Ariège', '10': 'Aube', '11': 'Aude', '12': 'Aveyron',
  '13': 'Bouches-du-Rhône', '14': 'Calvados', '15': 'Cantal', '16': 'Charente',
  '17': 'Charente-Maritime', '18': 'Cher', '19': 'Corrèze', '21': 'Côte-d’Or',
  '22': 'Côtes-d’Armor', '23': 'Creuse', '24': 'Dordogne', '25': 'Doubs',
  '26': 'Drôme', '27': 'Eure', '28': 'Eure-et-Loir', '29': 'Finistère',
  '2A': 'Corse-du-Sud', '2B': 'Haute-Corse', '30': 'Gard', '31': 'Haute-Garonne',
  '32': 'Gers', '33': 'Gironde', '34': 'Hérault', '35': 'Ille-et-Vilaine',
  '36': 'Indre', '37': 'Indre-et-Loire', '38': 'Isère', '39': 'Jura',
  '40': 'Landes', '41': 'Loir-et-Cher', '42': 'Loire', '43': 'Haute-Loire',
  '44': 'Loire-Atlantique', '45': 'Loiret', '46': 'Lot', '47': 'Lot-et-Garonne',
  '48': 'Lozère', '49': 'Maine-et-Loire', '50': 'Manche', '51': 'Marne',
  '52': 'Haute-Marne', '53': 'Mayenne', '54': 'Meurthe-et-Moselle', '55': 'Meuse',
  '56': 'Morbihan', '57': 'Moselle', '58': 'Nièvre', '59': 'Nord',
  '60': 'Oise', '61': 'Orne', '62': 'Pas-de-Calais', '63': 'Puy-de-Dôme',
  '64': 'Pyrénées-Atlantiques', '65': 'Hautes-Pyrénées', '66': 'Pyrénées-Orientales', '67': 'Bas-Rhin',
  '68': 'Haut-Rhin', '69': 'Rhône', '70': 'Haute-Saône', '71': 'Saône-et-Loire',
  '72': 'Sarthe', '73': 'Savoie', '74': 'Haute-Savoie', '75': 'Paris',
  '76': 'Seine-Maritime', '77': 'Seine-et-Marne', '78': 'Yvelines', '79': 'Deux-Sèvres',
  '80': 'Somme', '81': 'Tarn', '82': 'Tarn-et-Garonne', '83': 'Var',
  '84': 'Vaucluse', '85': 'Vendée', '86': 'Vienne', '87': 'Haute-Vienne',
  '88': 'Vosges', '89': 'Yonne', '90': 'Territoire de Belfort', '91': 'Essonne',
  '92': 'Hauts-de-Seine', '93': 'Seine-Saint-Denis', '94': 'Val-de-Marne', '95': 'Val-d’Oise',
};
