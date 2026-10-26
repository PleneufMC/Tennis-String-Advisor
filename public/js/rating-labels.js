/**
 * Nature des notes /10 des cordages — surfaces EN (tsa-acquisition, 10/10/2026).
 *
 * Principe décidé par Pierre le 10/10/2026 : « Cordages : garder les notes et les
 * étiqueter partout. » Les notes /10 des cordages sont une appréciation de l'équipe,
 * pas une mesure de laboratoire ; la rigidité (lb/in) est la donnée du cordage que le
 * RCS utilise. Ni les chaînes de testeurs ni Tennis Warehouse ne
 * sont jamais cités comme auteurs de ces notes (charte, F5).
 *
 * Les libellés ci-dessous sont les LIBELLÉS DE RÉFÉRENCE (principe décidé par Pierre le
 * 10/10/2026 ; formulation tranchée par Opus 5.5 le 23/10/2026, délégation de l'orchestrateur ;
 * aucune note /10 n'est une mesure). `npm run audit:string-labels`
 * les compare mot pour mot à sa propre constante de référence : en changer un se fait
 * aux deux endroits.
 *
 * SOURCE UNIQUE des libellés. Ce fichier est chargé tel quel par les pages
 * dynamiques (strings, compare, configurator) ET lu par le générateur des fiches
 * (scripts/en-products/, via require) : fiches statiques et pages dynamiques ne
 * peuvent donc pas diverger. `npm run audit:string-labels` le vérifie.
 *
 * Quatre états, déduits de la fiche :
 *   - aucune note publiée                  -> « Not published »
 *   - note reprise d'un test de revendeur  -> « Rating taken, in whole or in part, from a retailer's published test, not measured »
 *   - notes, cordage harmonisé (18)        -> « Average of the TSA team rating and published tester reviews, not measured »
 *   - autres notes                         -> « TSA team rating, not measured »
 *
 * Quels cordages sont harmonisés, et lesquels portent une note reprise :
 * `public/data/string-rating-basis.json`, produit à chaque build par scripts/en-products/
 * depuis src/data/tester-ratings.ts et src/data/string-ratings-third-party.ts (non
 * versionné, jamais édité). Le catalogue EN (catalog.json, tsa-core) porte la même
 * nature (`rating_basis`, depuis le 23/10/2026) : basculer sur lui supprimera ce chargement.
 * Note de confort recalée sur la rigidité mesurée (D2 du 23/10/2026, src/data/comfort-recalibration.ts) :
 * le libellé porte en plus la mention RECALIBRATED (`label`, `labelOf`), partout où les notes s'affichent ;
 * la liste des fiches recalées arrive par le même fichier (`comfort_recalibrated`). « measured stiffness
 * (TWU) » y qualifie la rigidité, jamais la note : seule exception, exacte, à « measured » sans négation.
 * Si le fichier est injoignable ou d'un format inattendu (liste `third_party` ou
 * `comfort_recalibrated` absente comprise), aucune nature n'est attribuée : toute note porte
 * « Rating not measured », sans nom d'auteur ni mention D2, et l'erreur est journalisée dans la
 * console. Jamais le libellé de l'équipe par défaut : ce serait attribuer à TSA une note reprise
 * d'un tiers (règle 3). Une note n'est jamais affichée sans libellé.
 *
 * Fonctionne dans le navigateur (window.TSARatingLabels) et sous Node (require).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TSARatingLabels = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var LABEL = {
    editorial: 'TSA team rating, not measured',
    harmonised: 'Average of the TSA team rating and published tester reviews, not measured',
    third_party: "Rating taken, in whole or in part, from a retailer's published test, not measured",
    // Repli quand la liste des natures est injoignable : aucune nature attribuée, aucun auteur nommé.
    unknown: 'Rating not measured',
    none: 'Not published'
  };

  // D2 du 23/10/2026 : mention ajoutée au libellé d'un cordage dont la note de confort a été recalée sur la rigidité
  // mesurée. TWU y est la source de la mesure de rigidité, pas des notes.
  var RECALIBRATED = 'comfort rating recalibrated on measured stiffness (TWU)';

  // Mention courte, à placer près des notes ; sans note publiée, elle n'a pas d'objet
  // et n'est pas affichée. Elle n'affirme PAS que la rigidité est « mesurée » : ce n'est
  // pas assuré pour les 181 fiches (certaines n'ont aucune source, TWU mesure chaque
  // jauge séparément ; règle 3, PR #105). Elle dit seulement que la rigidité est la
  // donnée du cordage utilisée par le RCS (elle n'est pas affichée partout : carte du catalogue FR, comparateur).
  // Le moteur EN n'a pas de second filet confort : l'alerte bras n'y lit que l'indice (avis Opus 5.5 du 23/10/2026).
  var NOTE = 'Ratings out of 10 are not measured; each rating shows its basis. The RCS index and the arm alert use stiffness (lb/in) only.';

  // Champs /10 d'un cordage affichés sur les surfaces EN.
  var NOTE_FIELDS = ['control', 'comfort', 'spin', 'power', 'durability'];

  var BASIS_URL = '/data/string-rating-basis.json';

  function hasRating(s) {
    if (!s) return false;
    for (var i = 0; i < NOTE_FIELDS.length; i++) {
      var v = s[NOTE_FIELDS[i]];
      if (v !== null && v !== undefined) return true;
    }
    return false;
  }

  function isMember(ids, id) {
    if (!ids) return false;
    if (typeof ids.has === 'function') return ids.has(id);
    return Array.prototype.indexOf.call(ids, id) !== -1;
  }

  /** 'none' | 'third_party' | 'harmonised' | 'editorial' — identifiants en Set ou tableau. */
  function basisOf(s, harmonisedIds, thirdPartyIds) {
    if (!hasRating(s)) return 'none';
    if (isMember(thirdPartyIds, s.id)) return 'third_party';
    return isMember(harmonisedIds, s.id) ? 'harmonised' : 'editorial';
  }

  // Libellé d'une nature, plus la mention D2 si la note de confort affichée a été recalée.
  function withRecalibration(s, basis, recalibratedIds) {
    var recal = basis !== 'none' && s.comfort !== null && s.comfort !== undefined && isMember(recalibratedIds, s.id);
    return recal ? LABEL[basis] + '; ' + RECALIBRATED : LABEL[basis];
  }

  /** Libellé complet : celui de la nature, plus la mention D2 si la note de confort affichée a été recalée. */
  function labelOf(s, harmonisedIds, thirdPartyIds, recalibratedIds) {
    return withRecalibration(s, basisOf(s, harmonisedIds, thirdPartyIds), recalibratedIds);
  }

  // ---- navigateur : chargement de la liste des cordages harmonisés -------------
  var state = { ready: false, ok: false, ids: null, thirdParty: null, recalibrated: null };
  var pending = null;

  function load() {
    if (!pending) {
      pending = fetch(BASIS_URL)
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function (data) {
          if (!data || !Array.isArray(data.harmonised) || !Array.isArray(data.third_party) || !Array.isArray(data.comfort_recalibrated)) throw new Error('unexpected format');
          state.ids = new Set(data.harmonised);
          state.thirdParty = new Set(data.third_party);
          state.recalibrated = new Set(data.comfort_recalibrated);
          state.ok = true;
          state.ready = true;
          return state;
        })
        .catch(function (err) {
          console.error('TSARatingLabels: ' + BASIS_URL + ' could not be read (' + err.message + '); ratings are labelled "' + LABEL.unknown + '", no basis attributed.');
          state.ids = null;
          state.thirdParty = null;
          state.recalibrated = null;
          state.ok = false;
          state.ready = true;
          return state;
        });
    }
    return pending;
  }

  function basis(s) {
    if (!state.ready) throw new Error('TSARatingLabels.load() must resolve before a string is labelled');
    // Liste injoignable : l'auteur d'une note n'est pas connu, aucune nature n'est attribuée (jamais « équipe » par défaut).
    if (!state.ok) return hasRating(s) ? 'unknown' : 'none';
    return basisOf(s, state.ids, state.thirdParty);
  }

  function label(s) {
    // Liste injoignable : « Rating not measured », sans mention D2 (la liste des fiches recalées vient du même fichier).
    return withRecalibration(s, basis(s), state.ok ? state.recalibrated : null);
  }

  return {
    LABEL: LABEL,
    RECALIBRATED: RECALIBRATED,
    NOTE: NOTE,
    NOTE_FIELDS: NOTE_FIELDS,
    BASIS_URL: BASIS_URL,
    hasRating: hasRating,
    basisOf: basisOf,
    labelOf: labelOf,
    load: load,
    basis: basis,
    label: label
  };
});
