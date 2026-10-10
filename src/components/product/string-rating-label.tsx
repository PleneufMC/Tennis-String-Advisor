import React from 'react';
import type { CSSProperties } from 'react';
import {
  STRING_RATINGS_NOTICE,
  stringRatingLabel,
  stringRatingNature,
  type RatedString,
} from '@/lib/string-rating-nature';

/**
 * Étiquette de nature des notes /10 d'un cordage (principe décidé par Pierre le 10/10/2026 ;
 * formulation proposée par l'orchestrateur, en attente de sa validation : voir
 * `lib/string-rating-nature`).
 *
 * Aucune couleur ni taille imposées : chaque surface passe son `className` (Tailwind)
 * ou son `style` (variables CSS des pages en styles inline), pour rester lisible dans
 * les deux thèmes. Ni état, ni effet : utilisable dans un composant serveur comme client.
 * Un cordage sans aucune note n'a rien à étiqueter : le composant ne rend rien et les
 * lignes de notes disent « Non publié ». Contrôle 18 de `npm run audit:ratings`.
 */
interface StringRatingLabelProps {
  string: RatedString;
  as?: 'p' | 'span' | 'div';
  className?: string;
  style?: CSSProperties;
}

export function StringRatingLabel({ string, as: Tag = 'p', className, style }: StringRatingLabelProps) {
  const label = stringRatingLabel(string);
  if (label === null) return null;
  return (
    <Tag className={className} style={style} data-rating-nature={stringRatingNature(string)}>
      {label}
    </Tag>
  );
}

/** Mention réutilisable : ce que sont ces notes, et quelle donnée du cordage le RCS utilise. */
export function StringRatingsNotice({
  as: Tag = 'p',
  className,
  style,
}: {
  as?: 'p' | 'span' | 'div';
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Tag className={className} style={style} data-rating-notice="full">
      {STRING_RATINGS_NOTICE}
    </Tag>
  );
}
