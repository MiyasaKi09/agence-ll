// Endpoint d'îlot Tina — rendu à la demande (seule route non-statique).
// Le bridge d'édition re-fetche cette route pour rafraîchir une région éditée
// sans recharger la page. Hors admin, il n'est jamais appelé : les pages
// publiques restent 100 % statiques et sans React.
import type { APIRoute } from 'astro';
import { experimental_createIslandRoute } from '@tinacms/astro/experimental';
import { islands } from '../../lib/islands';

export const prerender = false;
export const ALL: APIRoute = experimental_createIslandRoute(islands);
