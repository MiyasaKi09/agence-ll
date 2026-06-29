// Logique de teinte par projet (reprise du Claude design « Site Agence L&L »).
// Chaque projet reçoit une palette déterministe (axonométries + placeholders + accent).
export interface Teinte { ph1: string; ph2: string; surface: string; accent: string }

export const TEINTES: Teinte[] = [
  { ph1: '#E7DFD0', ph2: '#D8CCB7', surface: '#F4EFE6', accent: '#B86B4B' }, // terre cuite (défaut)
  { ph1: '#E2D2B8', ph2: '#D5C0A0', surface: '#F3EBE0', accent: '#B86B4B' }, // terre
  { ph1: '#CDD7BC', ph2: '#BAC8A4', surface: '#ECF0E6', accent: '#5C6E48' }, // mousse
  { ph1: '#CDD8E1', ph2: '#B8C6D2', surface: '#ECEFF3', accent: '#41617A' }, // ardoise
  { ph1: '#E1D4AE', ph2: '#D3C295', surface: '#F3EEDC', accent: '#B86B4B' }, // sable
];

export function teinteFor(id: string): Teinte {
  const seed = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
  return TEINTES[seed % TEINTES.length];
}

// Variables CSS inline pour un élément teinté.
export function teinteVars(t: Teinte): string {
  return `--ph1:${t.ph1};--ph2:${t.ph2};--surface:${t.surface};--teinte-accent:${t.accent};`;
}
