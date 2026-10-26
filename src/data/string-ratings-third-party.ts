/**
 * Cordages dont au moins une note /10 affichée (contrôle, confort, effet, puissance, durabilité) est reprise, en tout
 * ou en partie, d'un test publié par un revendeur : codes `tw` ou `harmonisee+tw` du fichier de provenance des notes
 * (chantier C4). Nature `third_party` (avis Opus 5.5 du 23/10/2026, délégation de l'orchestrateur).
 *
 * Liste DÉRIVÉE, jamais choisie : le contrôle 18 de `npm run audit:ratings` la recalcule champ par champ depuis la
 * provenance et échoue au moindre écart, dans un sens comme dans l'autre. Elle existe pour que les surfaces du site
 * n'importent jamais la provenance (contrôle 13 bis : ni revue, ni URL, ni score de revendeur dans une page) ; elle ne
 * porte que des identifiants. Lue par `src/lib/string-rating-nature.ts` et, côté EN, par `scripts/en-products/rating-basis.mjs`.
 */
export const THIRD_PARTY_RATED_STRING_IDS: readonly string[] = ['tecnifibre-triax', 'wilson-nxt'];
