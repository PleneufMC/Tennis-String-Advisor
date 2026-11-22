'use client';

/**
 * Textes des pages d'authentification, FR et EN (22/11/2026).
 *
 * Un acheteur de `/en/pricing` sans compte arrive sur `/auth/signin?callbackUrl=/en/pricing` : ces pages le suivent en anglais.
 * Langue : anglais si le `callbackUrl` mène à une page anglaise (`/en/…`), sinon la langue du site (celle de l'en-tête et du pied
 * de page : choix stocké, sinon langue du navigateur). Aucune route, aucun fournisseur, aucun flux NextAuth ne change.
 */
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { isEnglishCallback } from './auth-locale';

export type AuthLocale = 'fr' | 'en';

function useSiteLocale(english: boolean): AuthLocale {
  const { locale } = useLanguage();
  return english ? 'en' : locale;
}

/** Langue d'un formulaire (sous `<Suspense>`) : lit le `callbackUrl` de l'URL. */
export function useAuthLocale(): AuthLocale {
  const searchParams = useSearchParams();
  return useSiteLocale(isEnglishCallback(searchParams.get('callbackUrl')));
}

const FR = {
  homeHref: '/',
  backHome: "← Retour à l'accueil",
  signinTitle: 'Connexion',
  signinSubtitle: 'Accédez à vos configurations et au Premium.',
  signinTerms: "En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.",
  signupTitle: 'Créer un compte',
  signupSubtitle: 'Sauvegardez vos configurations et accédez au Premium.',
  signupTerms: "En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.",
  wrongCredentials: 'E-mail ou mot de passe incorrect.',
  emailForLink: 'Saisissez votre adresse e-mail pour recevoir un lien.',
  redirecting: 'Redirection…',
  google: 'Continuer avec Google',
  or: 'ou',
  email: 'Adresse e-mail',
  emailPlaceholder: 'vous@exemple.com',
  password: 'Mot de passe',
  passwordPlaceholder: 'Votre mot de passe',
  signingIn: 'Connexion…',
  signIn: 'Se connecter',
  sendingLink: 'Envoi du lien…',
  magicLink: 'Recevoir un lien de connexion par e-mail',
  noAccount: 'Pas encore de compte ?',
  createAccount: 'Créer un compte',
  passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères.',
  genericError: 'Une erreur est survenue. Veuillez réessayer.',
  networkError: 'Une erreur réseau est survenue. Veuillez réessayer.',
  name: 'Nom (facultatif)',
  namePlaceholder: 'Votre nom',
  passwordMin: '8 caractères minimum',
  creating: 'Création du compte…',
  createMine: 'Créer mon compte',
  haveAccount: 'Déjà un compte ?',
  // Messages de `POST /api/auth/register`, affichés tels quels en français.
  registerError: (message: string) => message,
  verifyTitle: 'Vérifiez vos e-mails',
  verifyText:
    'Un lien de connexion vient de vous être envoyé. Cliquez dessus pour accéder à votre compte. Pensez à vérifier vos courriers indésirables.',
  errorTitle: 'Connexion impossible',
  errorMessages: {
    // « L'équipe a été notifiée. » retiré le 22/11/2026 : aucun suivi d'erreurs en production (CLAUDE.md §2, point 7).
    Configuration: 'Un problème de configuration empêche la connexion.',
    AccessDenied: "L'accès a été refusé. Vous n'avez pas l'autorisation de vous connecter.",
    Verification: 'Le lien de connexion a expiré ou a déjà été utilisé. Veuillez en demander un nouveau.',
    Default: 'Une erreur est survenue lors de la connexion. Veuillez réessayer.',
  } as Record<string, string>,
  retry: 'Réessayer',
};

export type AuthText = typeof FR;
export type AuthTextKey = { [K in keyof AuthText]: AuthText[K] extends string ? K : never }[keyof AuthText];

// Messages connus de l'API d'inscription (français, côté serveur) et leur traduction ; un message inconnu reste en français.
const REGISTER_ERRORS_EN: Record<string, string> = {
  'Requête invalide.': 'Invalid request.',
  'Adresse e-mail invalide.': 'Invalid email address.',
  'Le mot de passe doit contenir au moins 8 caractères.': 'The password must be at least 8 characters long.',
  'Un compte existe déjà avec cette adresse e-mail.': 'An account already exists with this email address.',
  'Une erreur est survenue. Veuillez réessayer.': 'Something went wrong. Please try again.',
};

const EN: AuthText = {
  homeHref: '/en/',
  backHome: '← Back to home',
  signinTitle: 'Sign in',
  signinSubtitle: 'Access your setups and Premium.',
  signinTerms: 'By signing in, you accept our terms of use and our privacy policy.',
  signupTitle: 'Create an account',
  signupSubtitle: 'Save your setups and access Premium.',
  signupTerms: 'By creating an account, you accept our terms of use and our privacy policy.',
  wrongCredentials: 'Incorrect email or password.',
  emailForLink: 'Enter your email address to receive a link.',
  redirecting: 'Redirecting…',
  google: 'Continue with Google',
  or: 'or',
  email: 'Email address',
  emailPlaceholder: 'you@example.com',
  password: 'Password',
  passwordPlaceholder: 'Your password',
  signingIn: 'Signing in…',
  signIn: 'Sign in',
  sendingLink: 'Sending the link…',
  magicLink: 'Get a sign-in link by email',
  noAccount: 'No account yet?',
  createAccount: 'Create an account',
  passwordTooShort: 'The password must be at least 8 characters long.',
  genericError: 'Something went wrong. Please try again.',
  networkError: 'A network error occurred. Please try again.',
  name: 'Name (optional)',
  namePlaceholder: 'Your name',
  passwordMin: '8 characters minimum',
  creating: 'Creating your account…',
  createMine: 'Create my account',
  haveAccount: 'Already have an account?',
  registerError: (message) => REGISTER_ERRORS_EN[message] ?? message,
  verifyTitle: 'Check your email',
  verifyText: 'A sign-in link has just been sent to you. Click it to access your account. Remember to check your spam folder.',
  errorTitle: 'Unable to sign in',
  errorMessages: {
    Configuration: 'A configuration problem prevents signing in.',
    AccessDenied: 'Access was denied. You are not allowed to sign in.',
    Verification: 'The sign-in link has expired or has already been used. Please request a new one.',
    Default: 'An error occurred while signing in. Please try again.',
  },
  retry: 'Try again',
};

export const AUTH_TEXT: Record<AuthLocale, AuthText> = { fr: FR, en: EN };

/** Texte d'une page serveur : `english` vient du `callbackUrl` lu par la page ; sinon la langue du site, après hydratation. */
export function AuthString({ k, english = false }: { k: AuthTextKey; english?: boolean }) {
  return <>{AUTH_TEXT[useSiteLocale(english)][k]}</>;
}

/** Message de `/auth/error` selon le code NextAuth reçu ; code inconnu = message par défaut. */
export function AuthErrorText({ error }: { error: string }) {
  const messages = AUTH_TEXT[useSiteLocale(false)].errorMessages;
  return <>{Object.prototype.hasOwnProperty.call(messages, error) ? messages[error] : messages.Default}</>;
}

/** « Retour à l'accueil », vers l'accueil de la langue de la page. */
export function AuthHomeLink({ english = false, className }: { english?: boolean; className?: string }) {
  const tx = AUTH_TEXT[useSiteLocale(english)];
  return (
    <Link href={tx.homeHref} className={className}>
      {tx.backHome}
    </Link>
  );
}
