import { ui, defaultLocale, locales, type Locale, type UIKey } from './ui';

// Tant que les pages /en/ ne sont pas créées, on garde l'infra i18n en place
// (chrome déjà traduisible) mais le sélecteur n'offre que les langues « prêtes ».
// Passer à ['fr','en'] une fois l'arbre /en/ généré.
export const readyLocales: readonly Locale[] = ['fr', 'en'];
export const isLocaleReady = (l: Locale) => readyLocales.includes(l);

// Locale courante à partir de l'URL (/en/... => 'en', sinon 'fr').
export function getLocale(url: URL): Locale {
  const seg = url.pathname.split('/')[1];
  return (locales as readonly string[]).includes(seg) ? (seg as Locale) : defaultLocale;
}

// Traducteur lié à une locale : t('nav.journal').
export function useTranslations(locale: Locale) {
  return function t(key: UIKey): string {
    return ui[locale][key] ?? ui[defaultLocale][key] ?? key;
  };
}

// Préfixe un chemin interne avec la locale ('/journal' => '/en/journal' en EN).
// FR (défaut) n'a pas de préfixe.
export function localizePath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  if (path === '/') return `/${locale}/`;
  return `/${locale}${path}`;
}

// Chemin équivalent dans l'autre langue, pour le sélecteur FR·EN.
export function alternatePath(pathname: string, target: Locale): string {
  // retire un éventuel préfixe de locale existant
  const stripped = pathname.replace(new RegExp(`^/(${locales.join('|')})(?=/|$)`), '') || '/';
  if (target === defaultLocale) return stripped;
  return stripped === '/' ? `/${target}/` : `/${target}${stripped}`;
}

export { type Locale } from './ui';
