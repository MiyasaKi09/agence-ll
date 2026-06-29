// Registre des îlots éditables Tina (édition visuelle React-free).
// Chaque îlot = une région de page que le bridge Tina re-rend à la volée
// pendant l'édition, en re-fetchant l'endpoint /tina-island/<name>.
import type { IslandRegistry } from '@tinacms/astro/experimental';
import ProjetFiche from '../components/islands/ProjetFiche.astro';
import { getProjet } from './tina-data';

export const islands: IslandRegistry = {
  projet: {
    fetch: (_request, params) => getProjet(params.get('slug') ?? ''),
    component: ProjetFiche,
    // doit correspondre au wrapper côté page (<TinaIsland wrapper={...}>)
    wrapper: { tag: 'div', className: 'fiche-island' },
    propsFromData: (data, params) => {
      const res = data as Awaited<ReturnType<typeof getProjet>>;
      return { projet: res?.data?.projets, slug: params.get('slug') ?? '' };
    },
  },
};
