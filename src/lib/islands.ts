// Registre des îlots éditables Tina (édition visuelle React-free).
// Chaque îlot = une région de page que le bridge Tina re-rend à la volée
// pendant l'édition, en re-fetchant l'endpoint /tina-island/<name>.
import type { IslandRegistry } from '@tinacms/astro/experimental';
import ProjetFiche from '../components/islands/ProjetFiche.astro';
import AccueilVedette from '../components/islands/AccueilVedette.astro';
import ArticleCorps from '../components/islands/ArticleCorps.astro';
import EquipeListe from '../components/islands/EquipeListe.astro';
import { getProjet, getAccueil, getArticle, getEquipe } from './tina-data';

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
  accueil: {
    fetch: () => getAccueil(),
    component: AccueilVedette,
    wrapper: { tag: 'div', className: 'vedette-island' },
    propsFromData: (data, params) => {
      const res = data as Awaited<ReturnType<typeof getAccueil>>;
      return { accueil: res?.data?.accueil, lang: params.get('lang') ?? 'fr' };
    },
  },
  article: {
    fetch: (_request, params) => getArticle(params.get('slug') ?? ''),
    component: ArticleCorps,
    wrapper: { tag: 'div', className: 'article-island' },
    propsFromData: (data, params) => {
      const res = data as Awaited<ReturnType<typeof getArticle>>;
      return {
        article: res?.data?.journal,
        slug: params.get('slug') ?? '',
        lang: params.get('lang') ?? 'fr',
      };
    },
  },
  equipe: {
    fetch: () => getEquipe(),
    component: EquipeListe,
    wrapper: { tag: 'div', className: 'equipe-island' },
    propsFromData: (data) => {
      const res = data as Awaited<ReturnType<typeof getEquipe>>;
      const edges = res?.data?.equipeConnection?.edges ?? [];
      return { membres: edges.map((e: any) => e?.node).filter(Boolean) };
    },
  },
};
