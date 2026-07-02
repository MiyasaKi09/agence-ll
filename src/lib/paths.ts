// getStaticPaths partagés entre les routes FR (/…) et EN (/en/…), pour éviter
// toute divergence. Les routes EN réutilisent la page FR comme composant ; seul
// le getStaticPaths est défini dans chaque route, et pointe ici.
import { getCollection } from 'astro:content';

export async function journalStaticPaths() {
  const articles = (await getCollection('journal', ({ data }) => !data.brouillon))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const projets = await getCollection('projets');
  const projetById = new Map(projets.map((p) => [p.id, p]));

  // Tina stocke les références en chemin complet (src/content/projets/<slug>/index.mdx) ;
  // les anciens contenus utilisaient le slug nu. On normalise vers le slug.
  const lieSlug = (v?: string) =>
    v?.replace(/^src\/content\/projets\//, '').replace(/\/index\.mdx$/, '') ?? '';

  return articles.map((entry, i) => {
    const lie = entry.data.projetLie ? projetById.get(lieSlug(entry.data.projetLie)) ?? null : null;
    const projetLie = lie
      ? { id: lie.id, titre: lie.data.titre, lieu: lie.data.lieu, annee: lie.data.annee, numero: lie.data.numero }
      : null;
    const toRef = (e?: (typeof articles)[number]) => (e ? { id: e.id, titre: e.data.titre } : null);
    return {
      params: { id: entry.id },
      props: {
        entry,
        projetLie,
        plusRecent: toRef(articles[i - 1]),
        plusAncien: toRef(articles[i + 1]),
      },
    };
  });
}

export async function projetStaticPaths() {
  const projets = await getCollection('projets', ({ data }) => !data.brouillon);
  return projets.map((entry) => ({ params: { id: entry.id }, props: { entry } }));
}
