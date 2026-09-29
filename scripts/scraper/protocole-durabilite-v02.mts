/**
 * Durabilité — proposition v0.2 (29/09/2026). Estimée par construction :
 * aucune mesure de casse ou d'usure publiée n'a été trouvée (ni TWU, ni USRSA,
 * ni statistiques de cordeurs).
 *
 * Seuls deux liens sont documentés par des sources ouvertes :
 *  - jauge : « Thick string lasts longer than thin string » (Ashaway) ;
 *    « Thicker strings, like 15L or 16 gauge, are generally more durable »
 *    (Solinco, guide des jauges). Qualitatif, sans chiffre.
 *  - boyau naturel moins durable : « Gut and polyester strings are not noted
 *    for their durability » (Cross, Lindsey & Andruczyk 2000) ; « less durable
 *    than synthetics » (LTA). Le polyester est contradictoire (Cross : peu
 *    durable ; LTA : « high durability ») -> non utilisé.
 * Aucun de ces liens n'est quantifié : la sortie est une CLASSE ordinale, pas
 * un indice base 100 (inventer un coefficient serait contraire à la règle 3).
 *
 * Correction avant livraison (29/09/2026) : une première version comparait
 * toutes les familles entre elles et classait 56 % des multifilaments « Plus
 * durable » contre 31 % des polyesters, uniquement parce que les
 * multifilaments sont vendus en jauges plus épaisses. Comme l'écart de
 * durabilité entre matériaux n'est pas documenté de façon concordante, la
 * classe ne vaut plus qu'AU SEIN D'UNE FAMILLE (« plus durable qu'un
 * multifilament plus fin »). Le décalage du boyau devient sans objet et est
 * retiré ; la mention « boyau moins durable que les synthétiques » reste un
 * texte de famille, pas une note.
 * Les seuils de jauge sont une convention déclarée de la version.
 * N'utilise aucune donnée TWU : disponible dans les deux scénarios.
 */
import type { TennisString } from '../../src/data/strings-database.ts';

const CLASSES = ['Moins durable', 'Standard', 'Plus durable'] as const;
const SEUILS = { fin: 1.22, epais: 1.30 }; // mm : <= 1,22 fin ; >= 1,30 épais

export const DURABILITE = {
  description: {
    entrees_html:
      '+ jauge (classe : ≤ 1,22 mm fin, 1,23–1,29 standard, ≥ 1,30 épais) <small>— Ashaway, Solinco : « thicker … more durable » (qualitatif)</small><br>' +
      '<small>Portée : comparaison <b>au sein d’une même famille</b> seulement. Entre familles : polyester vs nylon contradictoire (Cross 2000 / LTA), boyau moins durable (Cross 2000, LTA) donné comme texte de famille. Sortie : classe ordinale, pas de nombre. Profil, texture, enduction : non documentés.</small>',
    seuils_mm: SEUILS,
    classes: CLASSES,
  },
  noter(s: TennisString, gauge: string) {
    if (s.type === 'Hybrid' || gauge.includes('/'))
      return { statut: 'Non publié', raison: 'hybride : deux cordages, aucune règle documentée de combinaison' };
    const g = Number(gauge);
    if (!Number.isFinite(g)) return { statut: 'Non publié', raison: 'jauge absente' };
    const c = g <= SEUILS.fin ? 0 : g >= SEUILS.epais ? 2 : 1;
    return {
      statut: 'Estimée (modèle TSA v0.2)',
      classe: CLASSES[c],
      portee: `au sein de la famille ${s.type}`,
      rang: c,
      confiance: 1,
      entrees: { jaugeMm: g, type: s.type, utiliseTWU: false, provenance: 'jauge et type lus dans le catalogue (sourcing fabricant à confirmer, chantier C4)' },
    };
  },
};
