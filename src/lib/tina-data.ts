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
