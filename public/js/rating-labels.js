/**
 * Nature des notes /10 des cordages — surfaces EN (tsa-acquisition, 10/10/2026).
 *
 * Principe décidé par Pierre le 10/10/2026 : « Cordages : garder les notes et les
 * étiqueter partout. » Les notes /10 des cordages sont une appréciation de l'équipe,
 * pas une mesure de laboratoire ; la rigidité (lb/in), indiquée à part, est la donnée
 * du cordage que le RCS utilise. Ni les chaînes de testeurs ni Tennis Warehouse ne
 * sont jamais cités comme auteurs de ces notes (charte, F5).
 *
 * Les libellés ci-dessous sont les LIBELLÉS DE RÉFÉRENCE arrêtés le 10/10/2026 (principe
 * décidé par Pierre ; formulation exacte à valider par lui). `npm run audit:string-labels`
 * les compare mot pour mot à sa propre constante de référence : en changer un se fait
 * aux deux endroits.
 *
 * SOURCE UNIQUE des libellés. Ce fichier est chargé tel quel par les pages
 * dynamiques (strings, compare, configurator) ET lu par le générateur des fiches
 * (scripts/en-products/, via require) : fiches statiques et pages dynamiques ne
 * peuvent donc pas diverger. `npm run audit:string-labels` le vérifie.
 *
 * Trois états, déduits de la fiche :
 *   - aucune note publiée                 -> « Not published »
 *   - notes, cordage non harmonisé        -> « TSA editorial rating »
 *   - notes, cordage harmonisé (18)       -> « TSA editorial rating, harmonised with tester reviews »
 *
 * Quels cordages sont harmonisés : `public/data/string-rating-basis.json`, produit
 * à chaque build par scripts/en-products/ depuis src/data/tester-ratings.ts (non
 * versionné, jamais édité). Le catalogue EN (catalog.json, tsa-core) ne porte pas
 * encore ce drapeau : le jour où il le porte, ce chargement disparaît.
 * Si le fichier est injoignable, les 18 cordages portent le libellé éditorial
 * simple (exact, moins précis) et l'erreur est journalisée dans la console : une
 * note n'est jamais affichée sans libellé.
 *
 * Fonctionne dans le navigateur (window.TSARatingLabels) et sous Node (require).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TSARatingLabels = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var LABEL = {
    editorial: 'TSA editorial rating',
    harmonised: 'TSA editorial rating, harmonised with tester reviews',
    none: 'Not published'
  };

  // Mention courte, à placer près des notes ; sans note publiée, elle n'a pas d'objet
  // et n'est pas affichée. Elle n'affirme PAS que la rigidité est « mesurée » : ce n'est
  // pas assuré pour les 181 fiches (certaines n'ont aucune source, TWU mesure chaque
  // jauge séparément ; règle 3, PR #105). Elle dit seulement que la rigidité, indiquée
  // à part, est la donnée du cordage utilisée par le RCS.
  var NOTE = 'Team assessment, not laboratory-measured. Stiffness (lb/in), shown separately, is the string data the RCS uses.';

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

  /** 'none' | 'editorial' | 'harmonised' — `harmonisedIds` : Set ou tableau d'identifiants. */
  function basisOf(s, harmonisedIds) {
    if (!hasRating(s)) return 'none';
    return isMember(harmonisedIds, s.id) ? 'harmonised' : 'editorial';
  }

  // ---- navigateur : chargement de la liste des cordages harmonisés -------------
  var state = { ready: false, ok: false, ids: null };
  var pending = null;

  function load() {
    if (!pending) {
      pending = fetch(BASIS_URL)
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function (data) {
          if (!data || !Array.isArray(data.harmonised)) throw new Error('unexpected format');
          state.ids = new Set(data.harmonised);
          state.ok = true;
          state.ready = true;
          return state;
        })
        .catch(function (err) {
          console.error('TSARatingLabels: ' + BASIS_URL + ' could not be read (' + err.message + '); harmonised strings get the plain editorial label.');
          state.ids = new Set();
          state.ok = false;
          state.ready = true;
          return state;
        });
    }
    return pending;
  }

  function basis(s) {
    if (!state.ready) throw new Error('TSARatingLabels.load() must resolve before a string is labelled');
    return basisOf(s, state.ids);
  }

  function label(s) {
    return LABEL[basis(s)];
  }

  return {
    LABEL: LABEL,
    NOTE: NOTE,
    NOTE_FIELDS: NOTE_FIELDS,
    BASIS_URL: BASIS_URL,
    hasRating: hasRating,
    basisOf: basisOf,
    load: load,
    basis: basis,
    label: label
  };
});
