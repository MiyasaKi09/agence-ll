// Dictionnaire d'INTERFACE (FR/EN). Le contenu (prose, articles, projets) n'est
// PAS ici — il reste en français pour l'instant (voir CLAUDE.md §12).
// Ajouter une clé = l'ajouter dans `fr` ET `en`.

export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

export const localeLabel: Record<Locale, string> = { fr: 'FR', en: 'EN' };

export const ui = {
  fr: {
    'skip': 'Aller au contenu',

    'nav.agence': 'Agence',
    'nav.projets': 'Projets',
    'nav.journal': 'Journal',
    'nav.contact': 'Contact',
    'lang.aria': 'Langue — français actif',

    // CTA / boutons
    'cta.lireJournal': 'Lire le journal',
    'cta.voirProjets': 'Voir nos projets',
    'cta.toutVoir': 'Tout voir',
    'cta.tousProjets': 'Tous les projets',
    'cta.ecrire': "Écrire à l'agence",
    'cta.enSavoirPlus': "En savoir plus sur l'agence",
    'cta.envoyer': 'Envoyer',
    'cta.retourAccueil': "← Retour à l'accueil",

    // libellés de sections (interface)
    'home.projetUne': 'Projet à la une',
    'home.auJournal': 'Au journal',
    'home.projetsRecents': 'Projets récents',
    'home.tousProjets': 'Tous les projets',
    'home.voirGrille': 'Voir la grille',
    'home.lagence': "L'agence",
    'agence.duo': 'Le duo',
    'agence.territoire': 'Territoire',
    'journal.eyebrow': 'Le journal',
    'journal.all': 'Tout',
    'journal.empty': "Aucun article dans cette rubrique pour l'instant.",
    'journal.bientot': 'Les premiers billets seront publiés ici très bientôt.',
    'projets.eyebrow': 'Travaux',
    'projets.empty': "Aucun projet publié pour l'instant.",
    'projets.bientot': 'Les premiers projets seront publiés ici très bientôt.',
    'placeholder.photo': '[ photo à venir ]',
    'placeholder.projet': '[ photo du projet — épreuve à venir ]',
    'placeholder.photoTag': 'photo du projet — épreuve à venir',
    'epreuve.aVenir': 'épreuve à venir',

    // article
    'article.back': '← Journal',
    'article.reading': 'de lecture',
    'article.related': 'Projet lié',
    'article.share': 'Partager :',
    'article.copy': 'Copier le lien',
    'article.copied': 'Lien copié',
    'article.alsoLinkedIn': 'Aussi publié sur LinkedIn',
    'article.newer': '← Plus récent',
    'article.older': 'Plus ancien →',

    // fiche projet
    'projet.back': '← Tous les projets',
    'fiche.programme': 'Programme',
    'fiche.lieu': 'Lieu',
    'fiche.annee': 'Année',
    'fiche.surface': 'Surface',
    'fiche.mo': "Maîtrise d'ouvrage",
    'fiche.statut': 'Statut',

    // rubriques (chips Journal)
    'rubrique.chantiers': 'Chantiers',
    'rubrique.reflexions': 'Réflexions',
    'rubrique.presse': 'Presse',
    'rubrique.distinctions': 'Distinctions',

    // statuts projet
    'statut.concours': 'Concours',
    'statut.étude': 'Étude',
    'statut.chantier': 'Chantier',
    'statut.livré': 'Livré',

    // footer
    'footer.tagline': 'Architecture · Rénovation · Vivant',
    'footer.colAgence': 'Agence',
    'footer.manifeste': 'Manifeste',
    'footer.savoirfaire': 'Savoir-faire',
    'footer.equipe': 'Équipe',
    'footer.colSite': 'Le site',
    'footer.colContact': 'Contact',
    'footer.soon': '(à venir)',
    'footer.mentions': 'Mentions légales',
    'footer.rights': 'Architectes DE',

    // formulaire de contact (libellés)
    'form.nom': 'Nom',
    'form.email': 'E-mail',
    'form.organisation': 'Organisation',
    'form.optionnel': '(facultatif)',
    'form.type': 'Type de projet',
    'form.message': 'Message',

    // bandeau « interface seule »
    'i18n.contentNotice': 'Version anglaise : interface traduite, contenu à venir.',
  },

  en: {
    'skip': 'Skip to content',

    'nav.agence': 'Studio',
    'nav.projets': 'Projects',
    'nav.journal': 'Journal',
    'nav.contact': 'Contact',
    'lang.aria': 'Language — English active',

    'cta.lireJournal': 'Read the journal',
    'cta.voirProjets': 'See our projects',
    'cta.toutVoir': 'See all',
    'cta.tousProjets': 'All projects',
    'cta.ecrire': 'Write to the studio',
    'cta.enSavoirPlus': 'More about the studio',
    'cta.envoyer': 'Send',
    'cta.retourAccueil': '← Back to home',

    'home.projetUne': 'Featured project',
    'home.auJournal': 'From the journal',
    'home.projetsRecents': 'Recent projects',
    'home.tousProjets': 'All projects',
    'home.voirGrille': 'See the grid',
    'home.lagence': 'The studio',
    'agence.duo': 'The duo',
    'agence.territoire': 'Territory',
    'journal.eyebrow': 'The journal',
    'journal.all': 'All',
    'journal.empty': 'No article in this section yet.',
    'journal.bientot': 'The first posts will be published here very soon.',
    'projets.eyebrow': 'Work',
    'projets.empty': 'No project published yet.',
    'projets.bientot': 'The first projects will be published here very soon.',
    'placeholder.photo': '[ photo coming ]',
    'placeholder.projet': '[ project photo — proof coming ]',
    'placeholder.photoTag': 'project photo — proof coming',
    'epreuve.aVenir': 'proof coming',

    'article.back': '← Journal',
    'article.reading': 'read',
    'article.related': 'Related project',
    'article.share': 'Share :',
    'article.copy': 'Copy link',
    'article.copied': 'Link copied',
    'article.alsoLinkedIn': 'Also published on LinkedIn',
    'article.newer': '← Newer',
    'article.older': 'Older →',

    'projet.back': '← All projects',
    'fiche.programme': 'Programme',
    'fiche.lieu': 'Location',
    'fiche.annee': 'Year',
    'fiche.surface': 'Area',
    'fiche.mo': 'Client',
    'fiche.statut': 'Status',

    'rubrique.chantiers': 'Construction',
    'rubrique.reflexions': 'Reflections',
    'rubrique.presse': 'Press',
    'rubrique.distinctions': 'Awards',

    'statut.concours': 'Competition',
    'statut.étude': 'Study',
    'statut.chantier': 'On site',
    'statut.livré': 'Delivered',

    'footer.tagline': 'Architecture · Renovation · Living',
    'footer.colAgence': 'Studio',
    'footer.manifeste': 'Manifesto',
    'footer.savoirfaire': 'Expertise',
    'footer.equipe': 'Team',
    'footer.colSite': 'The site',
    'footer.colContact': 'Contact',
    'footer.soon': '(coming)',
    'footer.mentions': 'Legal notice',
    'footer.rights': 'Architects DE',

    'form.nom': 'Name',
    'form.email': 'Email',
    'form.organisation': 'Organisation',
    'form.optionnel': '(optional)',
    'form.type': 'Project type',
    'form.message': 'Message',

    'i18n.contentNotice': 'English version: interface translated, content coming soon.',
  },
} as const;

export type UIKey = keyof (typeof ui)['fr'];
