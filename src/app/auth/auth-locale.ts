import { isEnglishPath } from '@/lib/i18n/route-map';

/**
 * Vrai si le `callbackUrl` (chemin relatif ou URL absolue) mène à une page anglaise. Module sans 'use client' : les pages
 * serveur de `/auth` l'appellent pour rendre l'anglais dès le rendu serveur (une fonction d'un module client n'y est pas appelable).
 */
export function isEnglishCallback(callbackUrl: string | null | undefined): boolean {
  if (!callbackUrl) return false;
  try {
    return isEnglishPath(new URL(callbackUrl, 'http://localhost').pathname);
  } catch {
    return false;
  }
}
