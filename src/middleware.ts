import { defineMiddleware } from 'astro:middleware';

// Protège l'admin Keystatic par mot de passe (HTTP Basic Auth).
// Active dès que la variable d'environnement KEYSTATIC_PASSWORD est définie
// (sur Vercel : Project → Settings → Environment Variables). En local sans
// variable, l'admin reste ouvert pour le confort de dev.
//
// On protège /keystatic (l'admin) et /api/keystatic (l'API qui écrit les
// fichiers), SAUF le sous-chemin OAuth GitHub (/api/keystatic/github/*) qui
// doit rester joignable pour la connexion en mode GitHub.
const PROTECT = (path: string) =>
  (path.startsWith('/keystatic') || path.startsWith('/api/keystatic')) &&
  !path.startsWith('/api/keystatic/github');

function getEnv(name: string): string | undefined {
  // process.env en prod (serverless Vercel) ; import.meta.env en fallback
  return (typeof process !== 'undefined' ? process.env?.[name] : undefined) ?? import.meta.env?.[name];
}

export const onRequest = defineMiddleware(async ({ url, request }, next) => {
  if (!PROTECT(url.pathname)) return next();

  const password = getEnv('KEYSTATIC_PASSWORD');
  if (!password) return next(); // pas de mot de passe configuré → ouvert (dev)

  const header = request.headers.get('authorization') ?? '';
  const [scheme, encoded] = header.split(' ');
  let ok = false;
  if (scheme === 'Basic' && encoded) {
    try {
      const [, pass] = atob(encoded).split(':'); // user ignoré, on ne vérifie que le mot de passe
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

  return next();
});
