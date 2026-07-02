// Fetchers TinaCMS (édition visuelle React-free).
// `requestWithMetadata` enveloppe la requête générée pour que l'admin sache
// quel formulaire ouvrir (priority:'primary' = le document de la page).
import { requestWithMetadata } from '@tinacms/astro/data';
import { client } from '../../tina/__generated__/client';

/** Une fiche projet par son slug (= nom du dossier dans src/content/projets). */
export const getProjet = (slug: string) =>
  requestWithMetadata(
    client.queries.projets({ relativePath: `${slug}/index.mdx` }),
    { priority: 'primary' },
  );

/** Liste des projets (pour la grille / les voisins). */
export const getProjetsConnection = () =>
  requestWithMetadata(client.queries.projetsConnection());

/** Réglages de l'accueil (singleton) — dont le projet vedette (référence). */
export const getAccueil = () =>
  requestWithMetadata(
    client.queries.accueil({ relativePath: 'accueil.json' }),
    { priority: 'primary' },
  );

/** Un article du journal par son slug. */
export const getArticle = (slug: string) =>
  requestWithMetadata(
    client.queries.journal({ relativePath: `${slug}/index.mdx` }),
    { priority: 'primary' },
  );

/** L'équipe, triée par ordre d'affichage. */
export const getEquipe = () =>
  requestWithMetadata(client.queries.equipeConnection({ sort: 'ordre' }));

/** Slug d'un document référencé (dossier/index.mdx → dossier ; fichier.md → fichier). */
export function refSlug(ref: any): string {
  const bc: string[] = ref?._sys?.breadcrumbs ?? [];
  if (!bc.length) return '';
  return (bc[bc.length - 1] === 'index' ? bc.slice(0, -1) : bc).join('/');
}
