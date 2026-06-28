import { useStoryblokApi, isEditorRequest } from '@storyblok/astro';
import type { ISbStoryData } from '@storyblok/astro';

// Récupère une story Storyblok par slug.
// - Dans l'éditeur visuel Storyblok (paramètres `_storyblok…` dans l'URL) : version `draft`
//   → on voit les modifications en cours, en direct.
// - Sur le site public : version `published`.
export async function getStory(slug: string, url: URL): Promise<ISbStoryData | null> {
  const api = useStoryblokApi();
  const version = isEditorRequest(url) ? 'draft' : 'published';
  try {
    const { data } = await api.get(`cdn/stories/${slug}`, { version });
    return data.story ?? null;
  } catch {
    return null;
  }
}

// Indique si Storyblok est configuré (jeton présent). Sert à éviter d'appeler
// l'API quand l'environnement n'a pas de jeton (build local sans secrets).
export function storyblokConfigured(): boolean {
  return Boolean(
    import.meta.env.STORYBLOK_PREVIEW_TOKEN || import.meta.env.PUBLIC_STORYBLOK_TOKEN,
  );
}
