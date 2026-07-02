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

// — Carte de France (contour réel simplifié + centroïdes des départements) ————
// Géométrie dérivée de france-geojson (contour métropole + Corse, simplifié
// Douglas-Peucker) et projetée dans un viewBox 0 0 300 295. Les positions
// couvrent LES 96 DÉPARTEMENTS métropolitains : tout futur projet, où qu'il
// soit, obtient sa pastille automatiquement.
export const FRANCE_VIEWBOX = '0 0 300 295';

export const FRANCE_PATH =
  "M249.2,108.9 L246.1,109.2 L244.0,113.4 L247.7,114.0 L240.6,122.6 L234.6,126.3 L235.1,131.0 L227.9,137.0 L228.9,137.9 L226.9,141.9 L229.2,143.4 L224.7,150.5 L231.8,147.7 L230.6,146.1 L232.0,143.4 L242.4,142.5 L241.7,143.9 L243.7,146.0 L242.2,150.3 L244.4,150.7 L243.9,153.1 L245.2,152.6 L247.4,156.9 L242.7,159.5 L242.5,162.8 L246.5,165.4 L246.5,169.5 L250.4,172.6 L248.2,178.4 L238.7,181.7 L241.2,184.4 L241.3,187.7 L247.0,190.2 L248.1,194.5 L245.7,194.6 L243.4,199.2 L245.4,202.2 L244.1,204.3 L246.7,208.1 L254.0,211.7 L260.8,209.9 L261.4,213.4 L256.9,219.1 L257.6,221.8 L249.8,225.7 L249.4,229.0 L245.7,229.1 L243.5,233.1 L241.2,232.9 L237.8,237.2 L240.2,237.5 L239.1,240.5 L233.6,241.2 L233.2,243.0 L229.8,242.1 L228.7,244.8 L223.9,241.8 L224.5,243.5 L222.0,244.1 L219.1,240.1 L211.8,239.1 L212.5,236.6 L211.3,234.6 L205.8,235.7 L201.8,231.8 L201.1,234.2 L203.0,234.0 L201.7,235.5 L197.6,235.1 L195.5,234.2 L195.4,232.0 L187.6,231.4 L186.3,229.0 L184.0,228.8 L173.6,237.3 L168.9,238.2 L165.1,242.9 L163.4,254.6 L164.0,259.4 L166.5,262.7 L161.8,261.3 L153.1,265.8 L147.4,262.6 L142.3,265.4 L140.7,262.2 L136.4,261.0 L137.6,258.5 L136.5,257.2 L131.4,256.1 L130.3,257.6 L128.6,254.1 L124.6,254.4 L122.8,252.0 L115.0,249.8 L114.2,255.0 L107.7,253.9 L106.4,255.5 L103.9,253.6 L99.9,255.1 L93.7,250.2 L88.4,252.2 L84.5,246.6 L76.3,245.3 L72.9,243.5 L73.7,242.0 L71.9,244.7 L70.1,244.2 L71.2,237.7 L64.1,236.6 L62.8,234.1 L66.7,232.5 L70.0,226.0 L73.9,198.6 L75.3,195.2 L79.2,195.5 L75.8,191.7 L73.8,196.0 L76.1,170.4 L79.5,167.2 L74.4,163.4 L74.2,161.1 L76.5,160.5 L75.8,158.9 L78.0,156.0 L76.6,150.7 L74.3,149.7 L76.9,145.6 L73.2,145.7 L62.3,139.5 L61.4,136.0 L55.5,129.6 L55.2,127.5 L58.8,123.3 L53.3,120.1 L54.9,119.1 L54.9,116.0 L47.0,115.3 L47.9,114.2 L46.8,112.7 L49.4,111.5 L47.9,109.2 L49.6,109.1 L45.2,108.8 L46.7,107.4 L45.7,106.9 L44.3,109.2 L41.4,109.4 L39.3,107.2 L43.1,107.7 L44.0,104.8 L39.8,106.7 L38.0,104.1 L39.1,107.2 L34.9,106.0 L35.8,109.9 L34.7,109.7 L33.1,104.6 L34.7,101.5 L33.3,101.5 L33.0,104.6 L30.0,103.3 L31.7,103.2 L29.9,102.6 L31.7,100.0 L30.3,101.6 L29.4,99.0 L30.1,101.9 L28.1,103.0 L26.2,97.9 L26.3,101.0 L21.8,98.4 L22.0,99.9 L19.6,100.2 L17.1,96.5 L17.1,98.2 L14.5,98.0 L14.2,94.3 L12.9,96.6 L14.3,98.0 L12.1,97.8 L12.8,99.8 L8.8,99.9 L8.6,96.2 L5.4,93.4 L6.4,92.6 L1.1,92.5 L10.3,91.1 L10.9,89.1 L6.9,86.5 L5.0,88.7 L5.3,86.2 L3.5,85.3 L5.5,83.4 L5.4,85.2 L14.6,86.0 L9.6,84.2 L11.1,82.9 L7.1,83.9 L11.0,80.3 L1.6,83.8 L0.0,81.2 L1.9,76.5 L6.1,77.2 L3.8,76.2 L6.6,76.4 L5.3,74.5 L17.2,71.7 L17.5,75.1 L18.3,73.3 L19.7,75.4 L20.4,72.0 L25.5,73.3 L25.3,70.2 L27.0,68.3 L29.2,69.5 L32.8,67.4 L32.9,70.0 L36.0,67.0 L34.9,70.7 L37.3,68.9 L36.6,69.9 L39.0,70.9 L44.2,78.9 L51.8,72.9 L51.4,75.0 L53.2,74.2 L54.0,76.4 L57.4,74.4 L58.4,78.9 L59.4,76.2 L57.8,74.0 L59.7,72.5 L61.7,72.2 L61.2,74.4 L63.3,75.5 L72.0,74.6 L67.4,71.2 L66.5,68.5 L67.7,62.6 L68.8,62.8 L66.8,62.3 L67.4,56.7 L62.4,52.1 L60.8,47.4 L61.6,44.6 L59.6,41.4 L66.5,43.9 L73.8,42.3 L74.5,45.0 L72.9,47.0 L76.5,52.7 L80.4,51.4 L98.4,54.4 L107.3,50.2 L101.6,47.9 L104.5,41.7 L125.2,34.0 L132.6,26.5 L135.4,27.6 L132.4,24.6 L132.7,22.1 L134.5,22.4 L132.7,21.0 L133.3,16.8 L134.9,17.6 L133.2,15.7 L133.3,6.6 L153.4,0.0 L155.2,4.3 L154.5,7.3 L158.5,11.0 L160.9,12.0 L166.1,9.1 L168.4,11.8 L168.9,17.1 L175.6,18.0 L177.8,23.9 L184.3,22.2 L188.2,24.8 L186.5,29.0 L188.6,30.8 L186.6,32.5 L187.9,34.4 L198.3,33.2 L198.3,30.5 L201.0,27.9 L202.6,28.9 L200.3,34.0 L202.4,35.8 L201.6,39.3 L210.4,42.3 L214.4,48.3 L220.8,46.3 L226.5,49.8 L230.6,47.8 L236.9,50.3 L241.0,58.5 L244.9,56.6 L247.2,57.6 L247.6,60.0 L252.6,59.9 L255.8,57.8 L259.8,61.8 L272.1,64.2 L264.1,74.3 L262.1,83.8 L258.6,90.1 L259.5,94.6 L257.2,103.0 L258.7,106.7 L254.6,111.0 L251.6,111.4 Z M296.7,280.2 L296.4,286.7 L294.2,288.2 L296.0,288.3 L294.0,290.2 L293.7,293.7 L290.3,294.4 L290.0,291.8 L283.7,289.1 L286.5,285.3 L281.2,283.8 L284.2,279.1 L280.1,279.1 L279.8,277.0 L283.0,274.4 L279.1,271.5 L278.7,268.7 L281.9,267.8 L278.8,264.8 L281.1,263.3 L282.2,258.4 L288.6,256.5 L290.9,253.7 L294.9,255.0 L295.4,245.8 L297.1,245.2 L300.0,270.0 Z";

/** Centre de chaque département (viewBox 0 0 300 295). */
export const DEPT_POS: Record<string, { x: number; y: number }> = {'01': { x: 212.0, y: 151.5 }, '02': { x: 174.6, y: 46.4 }, '03': { x: 166.8, y: 142.6 }, '04': { x: 230.7, y: 212.0 }, '05': { x: 231.1, y: 195.1 }, '06': { x: 248.9, y: 217.1 }, '07': { x: 192.7, y: 192.4 }, '08': { x: 197.2, y: 44.7 }, '09': { x: 131.6, y: 248.0 }, '10': { x: 187.2, y: 84.5 }, '11': { x: 150.7, y: 242.4 }, '12': { x: 156.2, y: 206.7 }, '13': { x: 206.5, y: 229.1 }, '14': { x: 92.7, y: 60.4 }, '15': { x: 156.0, y: 183.3 }, '16': { x: 104.5, y: 163.0 }, '17': { x: 86.5, y: 161.6 }, '18': { x: 152.3, y: 122.1 }, '19': { x: 139.5, y: 174.0 }, '21': { x: 200.0, y: 111.2 }, '22': { x: 40.4, y: 80.4 }, '23': { x: 142.4, y: 151.8 }, '24': { x: 115.7, y: 181.7 }, '25': { x: 233.2, y: 119.1 }, '26': { x: 208.1, y: 194.6 }, '27': { x: 121.0, y: 60.0 }, '28': { x: 128.8, y: 82.0 }, '29': { x: 15.4, y: 85.9 }, '2A': { x: 288.0, y: 280.1 }, '2B': { x: 292.6, y: 263.9 }, '30': { x: 187.6, y: 215.4 }, '31': { x: 124.8, y: 234.7 }, '32': { x: 109.7, y: 224.5 }, '33': { x: 88.0, y: 189.7 }, '34': { x: 170.6, y: 228.0 }, '35': { x: 66.1, y: 89.2 }, '36': { x: 133.2, y: 130.9 }, '37': { x: 114.7, y: 116.3 }, '38': { x: 216.7, y: 176.8 }, '39': { x: 219.3, y: 132.4 }, '40': { x: 83.8, y: 216.3 }, '41': { x: 130.1, y: 105.4 }, '42': { x: 187.2, y: 162.8 }, '43': { x: 179.8, y: 181.0 }, '44': { x: 65.1, y: 113.1 }, '45': { x: 149.2, y: 96.5 }, '46': { x: 133.8, y: 196.3 }, '47': { x: 109.8, y: 204.0 }, '48': { x: 173.4, y: 199.5 }, '49': { x: 88.5, y: 112.3 }, '50': { x: 72.4, y: 61.0 }, '51': { x: 188.8, y: 64.9 }, '52': { x: 209.4, y: 90.4 }, '53': { x: 86.5, y: 89.3 }, '54': { x: 229.0, y: 69.9 }, '55': { x: 212.7, y: 63.7 }, '56': { x: 41.6, y: 98.2 }, '57': { x: 239.4, y: 62.3 }, '58': { x: 173.4, y: 120.6 }, '59': { x: 167.4, y: 19.4 }, '60': { x: 150.9, y: 51.0 }, '61': { x: 102.9, y: 74.9 }, '62': { x: 148.0, y: 18.1 }, '63': { x: 165.8, y: 162.8 }, '64': { x: 84.4, y: 237.8 }, '65': { x: 103.7, y: 244.0 }, '66': { x: 152.9, y: 257.7 }, '67': { x: 258.0, y: 73.4 }, '68': { x: 252.2, y: 98.0 }, '69': { x: 197.2, y: 158.4 }, '70': { x: 227.4, y: 104.7 }, '71': { x: 195.2, y: 134.9 }, '72': { x: 104.9, y: 93.9 }, '73': { x: 234.9, y: 170.4 }, '74': { x: 234.6, y: 153.4 }, '75': { x: 149.2, y: 67.8 }, '76': { x: 121.7, y: 43.5 }, '77': { x: 161.5, y: 74.7 }, '78': { x: 138.7, y: 69.0 }, '79': { x: 93.6, y: 137.6 }, '80': { x: 147.8, y: 34.3 }, '81': { x: 145.5, y: 221.7 }, '82': { x: 127.0, y: 212.6 }, '83': { x: 230.7, y: 232.1 }, '84': { x: 208.6, y: 215.4 }, '85': { x: 73.3, y: 134.1 }, '86': { x: 109.8, y: 137.3 }, '87': { x: 126.0, y: 157.8 }, '88': { x: 233.5, y: 87.8 }, '89': { x: 174.7, y: 98.6 }, '90': { x: 245.0, y: 105.0 }, '91': { x: 147.1, y: 77.9 }, '92': { x: 147.2, y: 68.0 }, '93': { x: 152.0, y: 65.9 }, '94': { x: 151.8, y: 70.2 }, '95': { x: 144.7, y: 60.9 }};

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
