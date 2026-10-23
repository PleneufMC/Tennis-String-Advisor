/**
 * Nature des notes /10 d'un cordage — le SEUL endroit où les libellés sont écrits (FR).
 *
 * Principe décidé par Pierre le 10/10/2026 : « Cordages : garder les notes et les
 * étiqueter partout », après le constat de la PR #103 (les notes /10 des cordages ne
 * viennent PAS de Tennis Warehouse : 12 notes sur 1 182 ; l'origine de 1 062 est
 * inconnue ; aucune n'est une mesure). La FORMULATION des libellés et de la mention est
 * une proposition de l'orchestrateur, pas encore validée par Pierre : elle se change ici,
 * en un seul endroit (et dans le contrôle 18 de `npm run audit:ratings`, qui la fige).
 *
 * Une note qui s'affiche porte donc sa nature, cordage par cordage :
 *
 *   - `editorial`  : appréciation de l'équipe, source non établie (156 fiches au
 *                    10/10/2026) ;
 *   - `harmonized` : même appréciation, moyennée avec une synthèse d'avis de testeurs
 *                    (18 fiches, `STRING_TESTER_RATINGS`) ;
 *   - `none`       : aucune note publiée (« Non publié »).
 *
 * La liste des 18 vient de `STRING_TESTER_RATINGS` (src/data/tester-ratings.ts), la même
 * source que le générateur des fiches EN (scripts/en-products/) : aucune seconde liste.
 * « Une note » = l'une des cinq notes affichées sur les surfaces (contrôle, confort,
 * effet, puissance, durabilité), comme côté EN.
 *
 * Les chaînes de testeurs ne sont JAMAIS nommées ici ni sur le site : les notes sont
 * une appréciation de l'équipe, pas une citation. La provenance détaillée champ par
 * champ (fichier de provenance du chantier C4) n'est lue par aucune surface (contrôle
 * 13 bis de `npm run audit:ratings`) : la nature se déduit seulement de la liste des 18.
 *
 * Aucune note n'est modifiée ici, aucun calcul non plus. Contrôle 18 de `audit:ratings` :
 * toute surface qui affiche une note de cordage porte l'étiquette de ce module.
 */
import type { TennisString } from '@/data/strings-database';
import { STRING_TESTER_RATINGS } from '@/data/tester-ratings';
import { COMFORT_RECALIBRATED, COMFORT_RECALIBRATION_RULE } from '@/data/comfort-recalibration';

export type StringRatingNature = 'editorial' | 'harmonized' | 'none';

/** Les cinq notes /10 affichées pour un cordage (toutes optionnelles depuis l'option A). */
export const STRING_RATING_FIELDS = ['control', 'comfort', 'spin', 'power', 'durability'] as const;

/** Ce dont la nature se déduit : l'identifiant et la présence des notes affichées. */
export type RatedString = Pick<TennisString, 'id' | (typeof STRING_RATING_FIELDS)[number]>;

/** Libellés affichés, tels quels, sur toutes les surfaces françaises. */
export const STRING_RATING_LABELS: Readonly<Record<StringRatingNature, string>> = {
  editorial: 'Appréciation éditoriale TSA',
  harmonized: 'Appréciation éditoriale TSA, harmonisée avec des avis de testeurs',
  none: 'Non publié',
};

/**
 * Mention réutilisable, près des notes : ce que sont ces notes, et quelle donnée du cordage
 * le RCS utilise. Elle n'affirme PAS que la rigidité est « mesurée » : au 10/10/2026, la
 * mesure TWU n'est documentée fiche par fiche que pour une minorité de cordages, et TWU
 * mesure chaque jauge séparément (chantier C2). Elle dit seulement ce qui est vrai de
 * toutes les fiches : le RCS se calcule à partir de la rigidité, pas des notes.
 */
export const STRING_RATINGS_NOTICE =
  "Appréciation de l'équipe, non mesurée en laboratoire. La rigidité (lb/in) est la donnée du cordage utilisée par le RCS.";

/** `none` : aucune des cinq notes n'est publiée. `harmonized` : l'une des 18 fiches harmonisées. */
export function stringRatingNature(string: RatedString): StringRatingNature {
  if (!STRING_RATING_FIELDS.some((field) => string[field] !== undefined)) return 'none';
  return Object.prototype.hasOwnProperty.call(STRING_TESTER_RATINGS, string.id) ? 'harmonized' : 'editorial';
}

/**
 * Mention ajoutée à l'étiquette d'un cordage dont la note de confort a été recalée sur la rigidité mesurée (D2 du 23/10/2026,
 * `comfort-recalibration.ts`). Elle cite TWU comme source de la MESURE DE RIGIDITÉ, pas des notes : les notes restent une
 * appréciation de l'équipe. Contrôles 18 et 22 de `npm run audit:ratings`.
 */
export const COMFORT_RECALIBRATED_LABEL: string = COMFORT_RECALIBRATION_RULE.label;

/** Vrai si la note de confort de ce cordage a été recalée sur la rigidité mesurée (D2). */
export function isComfortRecalibrated(string: Pick<TennisString, 'id'>): boolean {
  return Object.prototype.hasOwnProperty.call(COMFORT_RECALIBRATED, string.id);
}

/**
 * Étiquette à afficher près des notes de ce cordage, ou `null` s'il n'en a aucune (rien à étiqueter). Note de confort recalée
 * (D2) : l'étiquette porte en plus la mention, partout où les notes s'affichent.
 */
export function stringRatingLabel(string: RatedString): string | null {
  const nature = stringRatingNature(string);
  if (nature === 'none') return null;
  const label = STRING_RATING_LABELS[nature];
  return isComfortRecalibrated(string) ? `${label} ; ${COMFORT_RECALIBRATED_LABEL}` : label;
}

/** Natures distinctes d'une liste de cordages qui portent des notes (`none` écarté). */
export function distinctRatedNatures(strings: readonly RatedString[]): StringRatingNature[] {
  const natures = new Set<StringRatingNature>();
  for (const s of strings) {
    const nature = stringRatingNature(s);
    if (nature !== 'none') natures.add(nature);
  }
  return [...natures];
}
