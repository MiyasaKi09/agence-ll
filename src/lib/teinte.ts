// Logique de teinte par projet (reprise du Claude design « Site Agence L&L »).
// Chaque projet reçoit une palette déterministe (axonométries + placeholders + accent),
// et sur sa fiche, c'est TOUTE la page qui se recolore (fond + accent).
export interface Teinte {
  ph1: string; ph2: string; surface: string; accent: string;
  paper: string; paperDeep: string;
}

export const TEINTES: Teinte[] = [
  { ph1: '#E7DFD0', ph2: '#D8CCB7', surface: '#F4EFE6', accent: '#B86B4B', paper: '#F6F2EB', paperDeep: '#EFE9DE' }, // terre cuite (défaut)
  { ph1: '#E2D2B8', ph2: '#D5C0A0', surface: '#F3EBE0', accent: '#A9603F', paper: '#F5EFE3', paperDeep: '#ECE3D2' }, // terre
  { ph1: '#CDD7BC', ph2: '#BAC8A4', surface: '#ECF0E6', accent: '#5C6E48', paper: '#F0F3EB', paperDeep: '#E5EBDB' }, // mousse
  { ph1: '#CDD8E1', ph2: '#B8C6D2', surface: '#ECEFF3', accent: '#41617A', paper: '#EEF2F4', paperDeep: '#E1E8EC' }, // ardoise
  { ph1: '#E1D4AE', ph2: '#D3C295', surface: '#F3EEDC', accent: '#9A7B3C', paper: '#F6F1E1', paperDeep: '#EDE6D1' }, // sable
];

export function teinteFor(id: string): Teinte {
  const seed = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
  return TEINTES[seed % TEINTES.length];
}

// Variables CSS pour un élément teinté (axonométrie / placeholder).
export function teinteVars(t: Teinte): string {
  return `--ph1:${t.ph1};--ph2:${t.ph2};--surface:${t.surface};--teinte-accent:${t.accent};`;
}

// Variables CSS pour recolorer TOUTE la page (fond + surfaces + accent).
export function teintePageVars(t: Teinte): string {
  return (
    `--paper:${t.paper};--paper-deep:${t.paperDeep};--surface:${t.surface};` +
    `--ph1:${t.ph1};--ph2:${t.ph2};` +
    `--terracotta:${t.accent};--terracotta-deep:${t.accent};--seal:${t.accent};--teinte-accent:${t.accent};`
  );
}
