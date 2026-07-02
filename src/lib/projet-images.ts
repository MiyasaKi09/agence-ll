// Résolution des images de contenu en gardant l'optimisation `astro:assets`.
// Tina renvoie les images sous forme de CHAÎNES (chemin). Pour les optimiser,
// on mappe ces chemins vers les imports d'images d'Astro :
//   - images colocalisées dans src/content/<collection>/<slug>/… (modèle actuel)
//   - médias dans src/assets/uploads/… (si on bascule le media store en src)
// Les chemins hors de src/ (ex. /uploads dans public/ — le media store Tina)
// ne sont pas optimisables par astro:assets : on les renvoie tels quels.
import { getImage } from 'astro:assets';

type ImgMod = { default: ImageMetadata };
const local = import.meta.glob<ImgMod>(
  ['/src/content/**/*.{jpg,jpeg,png,webp,avif}', '/src/assets/uploads/**/*.{jpg,jpeg,png,webp,avif}'],
  { eager: true },
);

/** Construit les clés candidates pour retrouver un fichier importé. */
function candidates(dir: string, slug: string, value: string): string[] {
  const v = value.replace(/^\.\//, '');
  return [
    v.startsWith('/') ? `/src${v}` : null,            // ex. /assets/uploads/x.jpg → /src/assets/uploads/x.jpg
    `/src/content/${dir}/${slug}/${v.replace(/^.*\//, '')}`, // nom de fichier colocalisé
    v.startsWith('/src') ? v : null,
  ].filter(Boolean) as string[];
}

export interface ResolvedImage {
  /** URL optimisée (astro:assets) si possible, sinon le chemin brut. */
  src: string;
  width?: number;
  height?: number;
  optimized: boolean;
}

/** Résout une valeur d'image Tina (chaîne) en URL affichable, optimisée si possible. */
export async function resolveContentImage(
  dir: 'projets' | 'journal' | 'equipe',
  slug: string,
  value: string | null | undefined,
  opts: { width?: number } = {},
): Promise<ResolvedImage | null> {
  if (!value) return null;
  for (const key of candidates(dir, slug, value)) {
    const mod = local[key];
    if (mod?.default) {
      const img = await getImage({ src: mod.default, width: opts.width, format: 'webp' });
      return { src: img.src, width: img.attributes.width, height: img.attributes.height, optimized: true };
    }
  }
  // chemin hors de src/ (ex. public/uploads) ou distant : servi tel quel
  return { src: value.startsWith('/') || value.startsWith('http') ? value : `/${value}`, optimized: false };
}

/** Raccourci historique pour les projets. */
export const resolveProjetImage = (
  slug: string,
  value: string | null | undefined,
  opts: { width?: number } = {},
) => resolveContentImage('projets', slug, value, opts);
