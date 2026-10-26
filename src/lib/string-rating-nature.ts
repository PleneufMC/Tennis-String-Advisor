/**
 * Nature des notes /10 d'un cordage — le SEUL endroit où les libellés sont écrits (FR).
 *
 * Principe décidé par Pierre le 10/10/2026 : « Cordages : garder les notes et les
 * étiqueter partout », après le constat de la PR #103 (les notes /10 des cordages ne
 * viennent PAS de Tennis Warehouse : 12 notes sur 1 182 ; l'origine de 1 062 est
 * inconnue ; aucune n'est une mesure). FORMULATION tranchée par Opus 5.5 le 23/10/2026
 * (délégation de l'orchestrateur) : elle se change ici, en un seul endroit, et dans le
 * contrôle 18 de `npm run audit:ratings`, qui la fige. Aucune note /10 n'est une mesure :
 * un libellé ne dit jamais « mesurée » sans négation. Seule exception, exacte : la mention D2
 * (`COMFORT_RECALIBRATED_LABEL`), où « rigidité mesurée (TWU) » qualifie la rigidité, pas la note.
 *
 * Une note qui s'affiche porte donc sa nature, cordage par cordage :
 *
 *   - `editorial`   : note de l'équipe, source non établie ;
 *   - `harmonized`  : moyenne de la note de l'équipe et d'une synthèse d'avis de testeurs
 *                     (18 fiches, `STRING_TESTER_RATINGS`) ;
 *   - `third_party` : au moins une note affichée reprise, en tout ou en partie, d'un test
 *                     publié par un revendeur (`THIRD_PARTY_RATED_STRING_IDS`, liste dérivée
 *                     de la provenance champ par champ et recalculée par le contrôle 18) ;
 *   - `none`        : aucune note publiée (« Non publié »).
 *
 * La liste des 18 vient de `STRING_TESTER_RATINGS` (src/data/tester-ratings.ts), la même
 * source que le générateur des fiches EN (scripts/en-products/) : aucune seconde liste.
 * « Une note » = l'une des cinq notes affichées sur les surfaces (contrôle, confort,
 * effet, puissance, durabilité), comme côté EN.
 *
 * Ni les chaînes de testeurs ni le revendeur ne sont JAMAIS nommés ici ni sur le site. La
 * provenance détaillée champ par champ (fichier de provenance du chantier C4) n'est lue par
 * aucune surface (contrôle 13 bis) : la nature se déduit de la liste des 18 et de la liste
 * dérivée des notes reprises.
 *
 * Aucune note n'est modifiée ici, aucun calcul non plus. Contrôle 18 de `audit:ratings` :
 * toute surface qui affiche une note de cordage porte l'étiquette de ce module.
 */
import type { TennisString } from '@/data/strings-database';
import { STRING_TESTER_RATINGS } from '@/data/tester-ratings';
import { THIRD_PARTY_RATED_STRING_IDS } from '@/data/string-ratings-third-party';
import { COMFORT_RECALIBRATED, COMFORT_RECALIBRATION_RULE } from '@/data/comfort-recalibration';

export type StringRatingNature = 'editorial' | 'harmonized' | 'third_party' | 'none';

/** Les cinq notes /10 affichées pour un cordage (toutes optionnelles depuis l'option A). */
export const STRING_RATING_FIELDS = ['control', 'comfort', 'spin', 'power', 'durability'] as const;

/** Ce dont la nature se déduit : l'identifiant et la présence des notes affichées. */
export type RatedString = Pick<TennisString, 'id' | (typeof STRING_RATING_FIELDS)[number]>;

/** Libellés affichés, tels quels, sur toutes les surfaces françaises. */
export const STRING_RATING_LABELS: Readonly<Record<StringRatingNature, string>> = {
  editorial: "Note de l'équipe TSA, non mesurée",
  harmonized: "Moyenne de la note de l'équipe TSA et d'avis de testeurs publiés, non mesurée",
  third_party: "Note reprise, en tout ou en partie, d'un test publié par un revendeur, non mesurée",
  none: 'Non publié',
};

/**
 * Mention de page, une fois par surface, près des notes : ce que sont ces notes, et ce qu'elles
 * touchent. L'indice RCS ne lit que la rigidité du cordage ; l'alerte bras du configurateur FR lit
 * aussi la note de confort (second filet de `advanced-rcs.ts`) : la mention le dit, sans l'adoucir.
 */
export const STRING_RATINGS_NOTICE =
  "Notes /10 non mesurées : la nature de chaque note est indiquée à côté. L'indice RCS n'utilise que la rigidité (lb/in) ; l'alerte bras peut aussi se déclencher sur la note de confort.";

/** Libellé de la note globale ★ (carte du catalogue) : une valeur dérivée se dit dérivée (règle 3). */
export const STRING_OVERALL_RATING_LABEL =
  'Moyenne de quatre notes non mesurées : performance, contrôle, confort, durabilité';

const THIRD_PARTY = new Set(THIRD_PARTY_RATED_STRING_IDS);

/** `none` : aucune des cinq notes n'est publiée ; `third_party` l'emporte sur `harmonized` (base reprise). */
export function stringRatingNature(string: RatedString): StringRatingNature {
  if (!STRING_RATING_FIELDS.some((field) => string[field] !== undefined)) return 'none';
  if (THIRD_PARTY.has(string.id)) return 'third_party';
  return Object.prototype.hasOwnProperty.call(STRING_TESTER_RATINGS, string.id) ? 'harmonized' : 'editorial';
}

/**
 * Mention ajoutée à l'étiquette d'un cordage dont la note de confort a été recalée sur la rigidité mesurée (D2 du 23/10/2026,
 * `comfort-recalibration.ts`). Elle cite TWU comme source de la MESURE DE RIGIDITÉ, pas des notes : la note reste non mesurée.
 * Contrôles 18 et 22 de `npm run audit:ratings`.
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
