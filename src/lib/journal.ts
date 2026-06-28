// Helpers du Journal — libellés de rubriques, ordre des filtres, formats de date.
// Module pur (pas d'import astro:content) pour être utilisable côté composant.

export type Rubrique = 'chantiers' | 'reflexions' | 'presse' | 'distinctions';

export const RUBRIQUE_LABELS: Record<Rubrique, string> = {
  chantiers: 'Chantiers',
  reflexions: 'Réflexions',
  presse: 'Presse',
  distinctions: 'Distinctions',
};

// Ordre des chips de filtre sur l'index (« Tout » est ajouté en tête par la page).
export const RUBRIQUE_ORDER: Rubrique[] = ['chantiers', 'reflexions', 'presse', 'distinctions'];

export const rubriqueLabel = (r: string): string =>
  RUBRIQUE_LABELS[r as Rubrique] ?? r;

// Date courte pour les méta de carte : « 28.05.26 »
export function dateCourte(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${p(d.getFullYear() % 100)}`;
}

// Date longue pour l'en-tête d'article : « 28 mai 2026 »
const MOIS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];
export function dateLongue(d: Date): string {
  return `${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`;
}

// Estimation du temps de lecture (~200 mots/min) à partir du texte brut.
export function tempsLecture(texte: string): string {
  const mots = texte.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(mots / 200))} min`;
}
