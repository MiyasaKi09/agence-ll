// Lecture des « Textes du site » éditables dans Keystatic (singletons).
// On lit au build via le reader Keystatic ; si le fichier n'existe pas encore
// (personne n'a édité), on retombe sur les textes par défaut ci-dessous — le
// site fonctionne donc toujours, et le CMS ne fait que surcharger.
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

// ——— Valeurs par défaut (texte actuel du site) ———
const DEFAULTS = {
  accueil: {
    manifesteTexte:
      'Rénovation énergétique, logement, équipements publics : une pratique sobre, des matières biosourcées, et une attention constante au vivant, du diagnostic au chantier.',
  },
  agence: {
    introParagraphes: [
      "L’Agence L&L est un duo d’architectes installé à Paris, qui travaille entre la capitale et la Normandie. Nous concevons des bâtiments qui partent de l’existant — du bâti, du sol, du climat — pour faire mieux avec moins.",
      "Rénovation énergétique, logement, équipements publics : notre pratique privilégie les matières biosourcées, la juste mesure technique et une attention constante au vivant. De la première esquisse au chantier, nous cherchons des projets utiles, tenus et durables.",
    ],
    savoirFaire: [
      { titre: 'Rénovation énergétique', description: 'Diagnostic, stratégie d’isolation, systèmes (PAC, ventilation), confort d’été.' },
      { titre: 'Logement social', description: 'Programmation, qualité d’usage, coûts maîtrisés, marchés publics.' },
      { titre: 'Équipements publics', description: 'Concours, faisabilité, MOP, concertation.' },
      { titre: 'Construction biosourcée', description: 'Pisé, chaux-chanvre, fibre de bois, réemploi.' },
      { titre: 'Paysage & biodiversité', description: 'Pleine terre, plantation naturaliste, gestion de l’eau.' },
    ],
    equipe: [
      { nom: 'Julien Lenglet', bio: 'Architecte DE — architecture des milieux et paysages (ENSAPLV). Formation initiale en biologie (Sorbonne).' },
      { nom: 'Zoé Lenglet', bio: 'Architecte — HMONP. Conduite de projet, qualité d’exécution.' },
    ],
    territoireTexte:
      'Un corridor de travail qui relie la densité parisienne aux territoires normands — et la possibilité, partout, d’une architecture attentive aux lieux.',
  },
  contact: {
    lede:
      'Maîtrise d’ouvrage publique ou privée, concours, faisabilité, rénovation — écrivez-nous, nous revenons vers vous rapidement.',
  },
};

export async function getAccueil() {
  const d = await reader.singletons.accueil.read();
  return {
    manifesteTexte: d?.manifesteTexte || DEFAULTS.accueil.manifesteTexte,
  };
}

export async function getAgence() {
  const d = await reader.singletons.agence.read();
  return {
    introParagraphes: d?.introParagraphes?.length ? d.introParagraphes : DEFAULTS.agence.introParagraphes,
    savoirFaire: d?.savoirFaire?.length ? d.savoirFaire : DEFAULTS.agence.savoirFaire,
    equipe: d?.equipe?.length ? d.equipe : DEFAULTS.agence.equipe,
    territoireTexte: d?.territoireTexte || DEFAULTS.agence.territoireTexte,
  };
}

export async function getContact() {
  const d = await reader.singletons.contact.read();
  return {
    lede: d?.lede || DEFAULTS.contact.lede,
  };
}
