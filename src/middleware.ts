import { defineMiddleware } from 'astro:middleware';

// Middleware pour l'admin Keystatic :
//  1) protection par mot de passe (HTTP Basic Auth) ;
//  2) correction de l'origine derrière un proxy (Vercel), sinon Keystatic
//     fabrique un `redirect_uri` en `localhost` lors de la connexion GitHub.
//
// On agit sur /keystatic (l'admin) et /api/keystatic (l'API). Le sous-chemin
// OAuth GitHub (/api/keystatic/github/*) n'est pas protégé par mot de passe
// (sinon la connexion GitHub serait bloquée), mais il bénéficie de la
// correction d'origine.

function getEnv(name: string): string | undefined {
  return (typeof process !== 'undefined' ? process.env?.[name] : undefined) ?? import.meta.env?.[name];
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request } = context;
  const isKeystatic =
    url.pathname.startsWith('/keystatic') || url.pathname.startsWith('/api/keystatic');
  if (!isKeystatic) return next();

  // 1) Mot de passe (sauf le flux OAuth GitHub)
  if (!url.pathname.startsWith('/api/keystatic/github')) {
    const password = getEnv('KEYSTATIC_PASSWORD');
    if (password) {
      const header = request.headers.get('authorization') ?? '';
      const [scheme, encoded] = header.split(' ');
      let ok = false;
      if (scheme === 'Basic' && encoded) {
        try {
          const [, pass] = atob(encoded).split(':'); // user ignoré
          ok = pass === password;
        } catch {
          ok = false;
        }
      }
      if (!ok) {
        return new Response('Accès restreint — mot de passe requis.', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Admin Agence L&L", charset="UTF-8"',
            'Content-Type': 'text/plain; charset=utf-8',
          },
        });
      }
    }
  }

  // (La correction de l'origine derrière Vercel — sinon redirect_uri = localhost —
  // est gérée par `security.allowedDomains` dans astro.config.mjs.)
  return next();
});
