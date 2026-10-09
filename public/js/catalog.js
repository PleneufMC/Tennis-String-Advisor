/**
 * Catalogue des pages EN — lu depuis /data/catalog.json (chantier C3, 09/10/2026).
 *
 * Ce JSON est généré au build depuis src/data/*.ts, qui fait foi : FR et EN
 * affichent le même catalogue et le même RCS. Les tables Supabase `racquets`
 * et `strings` ne sont plus lues par aucune page (contrôle dans audit:ratings).
 *
 * Un champ absent du catalogue vaut null : il s'affiche « Not published »,
 * jamais comblé par une valeur par défaut.
 */
(function () {
  var pending = null;

  function load() {
    if (!pending) {
      pending = fetch('/data/catalog.json')
        .then(function (res) {
          if (!res.ok) throw new Error('catalog.json HTTP ' + res.status);
          return res.json();
        })
        .then(function (data) {
          return { racquets: data.racquets || [], strings: data.strings || [], meta: data.meta || {} };
        })
        .catch(function (err) {
          pending = null; // permet une nouvelle tentative
          throw err;
        });
    }
    return pending;
  }

  function indexById(list) {
    var map = {};
    (list || []).forEach(function (item) { map[item.id] = item; });
    return map;
  }

  // Remplace l'ancienne jointure PostgREST `racquets(*), strings(*)` sur user_setups.
  function attachSetupProducts(setups, catalog) {
    var r = indexById(catalog.racquets);
    var s = indexById(catalog.strings);
    return (setups || []).map(function (setup) {
      return Object.assign({}, setup, {
        racquets: r[setup.racquet_id] || null,
        strings: s[setup.string_id] || null
      });
    });
  }

  function display(value, suffix) {
    return value === null || value === undefined ? 'Not published' : String(value) + (suffix || '');
  }

  window.TSACatalog = { load: load, indexById: indexById, attachSetupProducts: attachSetupProducts, display: display };
})();
