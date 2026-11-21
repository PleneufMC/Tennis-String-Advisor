/**
 * Paramètres d'URL transmis à GA4 : liste blanche.
 *
 * gtag.js renseigne de lui-même `page_location` (URL complète, query comprise)
 * et `page_referrer` (URL de la page précédente) sur CHAQUE événement, y compris
 * ceux qu'il émet seul (scroll, user_engagement, form_start…). Toute donnée
 * passée en paramètre d'URL partait donc chez Google : un formulaire en GET qui
 * recharge la page avec `?email-address=…`, un lien qui porte un nom ou un
 * numéro, un terme de recherche.
 *
 * Le caviardage de GA4 (réglage « Redact data » du flux) remplace bien une
 * adresse e-mail par « (redacted) », mais seulement ce qui a la forme d'une
 * adresse : un nom, un numéro de téléphone ou une adresse doublement encodée
 * passaient en clair (mesuré en exécution le 21/11/2026). C'est en outre un
 * réglage d'interface, qu'un clic désactive. On ne s'y fie pas : seuls les
 * paramètres ci-dessous sortent, et jamais le fragment (#…).
 *
 * Ajouter un paramètre exige qu'un rapport le lise (`reports/`, §2 de
 * CLAUDE.md). Au 21/11/2026, aucun autre n'est lu : A3
 * (`reports/a3-blog-vers-configurateur.md`) ne lit que le CHEMIN de
 * `page_location` et de `page_referrer`.
 */
export const GA4_URL_PARAM_ALLOWLIST = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

const ALLOWED = new Set<string>(GA4_URL_PARAM_ALLOWLIST);

// Même un paramètre autorisé ne sort pas s'il porte une adresse e-mail : un
// lien de campagne mal construit (`utm_source=prenom%40domaine.fr`) suffirait.
const CARRIES_EMAIL = /@|%40/i;

const decode = (s: string): string => {
  try {
    return decodeURIComponent(s.replace(/\+/g, ' '));
  } catch {
    return s;
  }
};

/**
 * URL réduite à ce que GA4 a le droit de recevoir : origine, chemin, et les
 * seuls paramètres de la liste blanche, dans leur ordre et leur encodage
 * d'origine (la valeur d'un utm reste celle que GA4 voyait avant). Ni
 * identifiants de connexion, ni fragment.
 */
export function sanitizeUrlForAnalytics(raw: string, base?: string): string {
  let url: URL;
  try {
    url = new URL(raw, base);
  } catch {
    // Illisible : rien après la query ni le fragment.
    return raw.split(/[?#]/)[0];
  }
  const kept = url.search
    .slice(1)
    .split('&')
    .filter((pair) => {
      if (!pair) return false;
      const eq = pair.indexOf('=');
      const key = decode(eq === -1 ? pair : pair.slice(0, eq));
      const value = eq === -1 ? '' : decode(pair.slice(eq + 1));
      return ALLOWED.has(key) && !CARRIES_EMAIL.test(value);
    });
  const prefix =
    url.protocol === 'http:' || url.protocol === 'https:' ? url.origin : `${url.protocol}//${url.host}`;
  return `${prefix}${url.pathname}${kept.length ? `?${kept.join('&')}` : ''}`;
}

export interface AnalyticsPageContext {
  page_location: string;
  page_referrer?: string;
}

/**
 * Les deux champs que gtag remplirait sinon avec l'URL brute. `page_referrer`
 * est omis quand il n'y a pas de provenance : gtag n'en envoie pas non plus.
 */
export function analyticsPageContext(href: string, referrer: string): AnalyticsPageContext {
  const context: AnalyticsPageContext = { page_location: sanitizeUrlForAnalytics(href) };
  if (referrer) context.page_referrer = sanitizeUrlForAnalytics(referrer);
  return context;
}
