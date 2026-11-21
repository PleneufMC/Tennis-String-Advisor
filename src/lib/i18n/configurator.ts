/**
 * Textes du configurateur, FR et EN (20/11/2026, demande de Pierre : « Le configurator en anglais doit être le même qu'en
 * français »).
 *
 * UNE SEULE SOURCE DE VÉRITÉ : `src/app/configurator/page.tsx` est rendu tel quel sur `/configurator` (FR) et sur
 * `/en/configurator` (EN). Ce fichier ne porte que des TEXTES : aucun calcul, aucun seuil, aucune condition d'alerte, aucun ordre
 * de tri. Les valeurs FR sont celles du composant avant extraction, à l'identique.
 *
 * Les textes produits par le moteur (`advanced-rcs.ts`, `getStringRecommendation`, libellés de nature des notes, synthèse des
 * testeurs) restent écrits en français par leurs propriétaires (`tsa-core`). En anglais, ils sont TRADUITS ici à l'affichage, motif
 * par motif, avec les nombres du moteur ; un texte qu'aucun motif ne reconnaît s'affiche tel quel, en français : une alerte n'est
 * jamais masquée faute de traduction (règle 2). `npm run audit:configurator-en` vérifie sur la grille du catalogue que chaque
 * texte du moteur trouve sa traduction.
 */
import { usePathname } from 'next/navigation';
import { isEnglishPath } from './route-map';
import { stringRatingNature, isComfortRecalibrated, type RatedString } from '@/lib/string-rating-nature';
import { COMFORT_RECALIBRATION_RULE } from '@/data/comfort-recalibration';
import { formatScore20, type RacquetTesterSynthesis } from '@/lib/racquet-scoring';

export type ConfiguratorLocale = 'fr' | 'en';

/** Langue du configurateur : celle de l'URL (`/en/…` = anglais), jamais la langue stockée du visiteur. */
export function useConfiguratorLocale(): ConfiguratorLocale {
  const pathname = usePathname();
  return isEnglishPath(pathname || '/') ? 'en' : 'fr';
}

const gaugeLabelFr = (gauge: string): string => (gauge === '1.30' ? 'Standard' : gauge < '1.25' ? 'Fin' : 'Medium');
const gaugeLabelEn = (gauge: string): string => (gauge === '1.30' ? 'Standard' : gauge < '1.25' ? 'Thin' : 'Medium');

const FR = {
  homeHref: '/',
  signinHref: '/auth/signin?callbackUrl=/configurator',
  subtitle: 'Système avancé avec journal de cordage professionnel',
  backHome: "← Retour à l'accueil",
  configTitle: 'Configuration et Analyse de Confort',
  configName: 'Nom de la Configuration',
  configNamePlaceholder: 'Ex: Setup Tournoi 2025',
  chooseRacquet: 'Choisir une Raquette',
  racquetPlaceholder: 'Rechercher une raquette (ex: Babolat, Pure Aero, Wilson)...',
  estimated: ' (estime)',
  weight: 'Poids',
  headSize: 'Tamis',
  raUnknown: 'ND',
  testerLine: (t: RacquetTesterSynthesis) =>
    `${t.label} : moyenne ${formatScore20(t.average20)} /20 · ` +
    t.criteria.map((c) => `${c.label.toLowerCase()} ${c.value20}/20`).join(' · '),
  mainString: 'Cordage Principal',
  mainStringPlaceholder: 'Rechercher un cordage (ex: Luxilon, ALU Power, Polyester)...',
  stiffness: 'Raideur',
  control: 'Contrôle',
  comfort: 'Confort',
  notPublished: 'non publié',
  crossString: 'Cordage Travers (Hybride optionnel)',
  crossTip: '💡 Laissez vide pour un cordage uniforme, ou choisissez un autre cordage pour un hybride',
  crossPlaceholder: 'Rechercher un cordage travers (optionnel)...',
  removeCross: 'Retirer le cordage travers',
  gauge: 'Jauge du Calibre',
  mains: 'Principal',
  crosses: 'Travers',
  gaugeLabel: gaugeLabelFr,
  gaugeVeryThin: 'Très fin',
  gaugeThin: 'Fin',
  rateTitle: 'Evaluer votre experience',
  rateGroup: "Note de l'experience, de 1 a 5",
  rateStar: (star: number) => `${star} sur 5`,
  rateHelp: 'Votre satisfaction personnelle',
  notesTitle: 'Notes personnelles',
  notesPlaceholder: 'Sensations, conditions de jeu, météo...',
  liveTitle: '📊 Analyse RCS en Temps Réel',
  mainsOnly: (kg: number) => `Montants seuls (${kg} kg):`,
  crossesOnly: (kg: number) => `Travers seuls (${kg} kg):`,
  rcsIndex: 'Indice RCS:',
  rcsIndexLive: 'Indice RCS',
  compatibility: 'Compatibilité:',
  buySetup: 'Acheter ce setup — liens partenaires',
  advancedTitle: '🔬 Analyse RCS Avancée',
  ratingsBasis: (hybrid: boolean) =>
    `Sous-scores et score global : calculés à partir des notes /10 ${hybrid ? 'des deux cordages' : 'du cordage'}, ajustées par la tension, la jauge et la raquette.`,
  ratingsMain: (hybrid: boolean): string => (hybrid ? 'Cordage principal : ' : 'Notes : '),
  ratingsCross: 'Cordage travers :',
  notAvailable: 'Non disponible',
  notAvailableLower: 'non disponible',
  subScores: { power: 'Puissance', control: 'Contrôle', comfort: 'Confort', spin: 'Spin', durability: 'Durabilité' },
  lockedTitle: 'Sous-scores détaillés & recommandations personnalisées',
  goPremium: 'Passer Premium',
  analyse: '💾 Analyser le Confort',
  save: '📊 Enregistrer dans le Journal',
  saveMissing: 'Veuillez remplir tous les champs requis',
  saveAccountOk: 'Configuration enregistrée dans votre compte avec succès!',
  saveQuota: 'Plan gratuit limité à 3 configurations enregistrées. Passez Premium pour un journal illimité.',
  saveAccountFailed: 'Enregistrée localement (échec de la sauvegarde dans le compte).',
  saveOffline: 'Enregistrée localement (hors ligne).',
  saveLocalOk: 'Configuration enregistrée localement avec succès!',
  saveSuccessMarker: 'succès',
  logTitle: 'Journal de Cordage',
  logSyncedTitle: '✅ Journal synchronisé activé',
  logSyncedText: 'Vos configurations enregistrées sont sauvegardées dans votre compte et accessibles depuis tous vos appareils.',
  logView: '📚 Voir mon journal de cordage',
  logLockedTitle: '🔒 Journal synchronisé',
  logLockedText: 'Connectez-vous pour sauvegarder vos configurations dans votre compte et les retrouver sur tous vos appareils.',
  logPerks: [
    '✓ Historique de configurations dans votre compte',
    '✓ Synchronisation entre tous vos appareils',
    '✓ Notes et évaluations conservées',
  ],
  logSignin: 'Se connecter pour activer',
  currentConfig: 'Configuration en cours',
  noRacquet: 'Aucune raquette sélectionnée',
  noString: 'Aucun cordage',
  previewIndex: (rcs: number, compat: string) => `Indice RCS: ${rcs} | Compatibilité: ${compat}%`,
  guideTitle: 'ℹ️ Recommandations Confort (RCS)',
  armComfort: 'Confort Bras:',
  selectConfig: 'Sélectionnez une config',
  bandComfortable: 'Palier Confortable:',
  bandComfortableRange: 'RCS de 20 à 25',
  bandStandard: 'Palier Standard:',
  bandStandardRange: 'RCS de 25 à 30',
  tennisElbow: 'Tennis Elbow:',
  tennisElbowText: 'Prudence dès 32 (alerte si bras sensible déclaré), risque à partir de 35',
  savedCount: 'Configurations sauvées',
  avgRcs: 'RCS moyen',
  recent: 'Configurations récentes',
  noSaved: 'Aucune configuration sauvée',
  // Textes du moteur et des fiches : affichés tels quels en français.
  engine: (text: string) => text,
  stringLevel: (level: string, description: string) => ({ level, description }),
  ratingLabel: (_s: RatedString): string | null => null,
  ratingsNotice: null as string | null,
};

export type ConfiguratorText = typeof FR;

// ---------------------------------------------------------------------------------------------------------------------------
// Anglais : traduction, à l'affichage, des textes du moteur (advanced-rcs.ts) et des paliers (getStringRecommendation).
// ---------------------------------------------------------------------------------------------------------------------------

const PROFILE_EN: Record<string, string> = { 'bras sensible déclaré': 'sensitive arm declared', 'profil standard': 'standard profile' };
const CONSULT_FR = 'Douleur persistante : consultez un professionnel de santé.';
const CONSULT_EN = 'Persistent pain: see a health professional.';

/** Motifs des textes du moteur, du plus spécifique au plus général ; chaque nombre vient du texte du moteur. */
const ENGINE_EN: Array<[RegExp, (...m: string[]) => string]> = [
  // Alerte bras, indice au seuil ou au-delà.
  [
    new RegExp(
      "^Alerte bras : indice (\\d+), seuil d'alerte de (\\d+) (atteint|dépassé) \\((bras sensible déclaré|profil standard)\\), " +
        "seuil fixé par le site pour le risque de tennis elbow\\. Il faut (\\d+) points? d'indice de moins pour repasser sous (\\d+) : " +
        '1 kg de tension en moins retire 0,5 point, un cordage moins rigide aux montants( \\(un multifilament ou un boyau, par exemple\\))? ' +
        "l'abaisse aussi\\. " + CONSULT_FR.replace(/[.()]/g, '\\$&') + '$'
    ),
    (rcs, seuil, verb, profile, points, under, poly) =>
      `Arm alert: index ${rcs}, alert threshold of ${seuil} ${verb === 'atteint' ? 'reached' : 'exceeded'} (${PROFILE_EN[profile]}), ` +
      `a threshold set by the site for the risk of tennis elbow. ` +
      `The index must drop by ${points} point${Number(points) > 1 ? 's' : ''} to get back under ${under}: ` +
      `1 kg less tension removes 0.5 point, and a less stiff string in the mains` +
      `${poly ? ' (a multifilament or a natural gut, for example)' : ''} lowers it too. ${CONSULT_EN}`,
  ],
  // Alerte bras, second seuil « confort » (indice sous le seuil).
  [
    new RegExp(
      '^Alerte bras : note de confort calculée du montage sous (\\d+) sur 100( avant arrondi, affichée (\\d+))? ' +
        "\\((bras sensible déclaré|profil standard)\\), second seuil d'alerte fixé par le site pour le risque de tennis elbow ; " +
        "elle part de la note de confort de l'équipe, non mesurée, et l'indice \\((\\d+)\\) reste sous le seuil de (\\d+)\\. " +
        'Une tension plus basse ou un cordage mieux noté en confort relève cette note\\. ' + CONSULT_FR.replace(/[.()]/g, '\\$&') + '$'
    ),
    (limit, rounded, shown, profile, rcs, seuil) =>
      `Arm alert: the setup's calculated comfort rating is below ${limit} out of 100` +
      `${rounded ? ` before rounding, shown as ${shown}` : ''} (${PROFILE_EN[profile]}), ` +
      `a second alert threshold set by the site for the risk of tennis elbow; ` +
      `it starts from the TSA team's comfort rating, not measured, and the index (${rcs}) stays under the threshold of ${seuil}. ` +
      `A lower tension or a string with a better comfort rating raises this rating. ${CONSULT_EN}`,
  ],
  // Mention d'estimation d'un hybride (setupFirmnessIndex).
  [/^estimation pour un hybride, au-dessus des montants seuls \((\d+)\) et des travers seuls \((\d+)\)$/,
    (m, c) => `estimate for a hybrid, above the mains alone (${m}) and the crosses alone (${c})`],
  [/^estimation pour un hybride, montants seuls et travers seuls à (\d+)$/, (v) => `estimate for a hybrid, mains alone and crosses alone at ${v}`],
  [/^estimation pour un hybride, entre (\d+) et (\d+)$/, (lo, hi) => `estimate for a hybrid, between ${lo} and ${hi}`],
  // Recommandations.
  [/^Tension élevée \((\d+) kg\) : excellent contrôle mais peu de puissance\. Descendre vers 24 kg gagnerait en confort et en tolérance\.$/,
    (t) => `High tension (${t} kg): excellent control but little power. Going down towards 24 kg would add comfort and forgiveness.`],
  [/^Tension basse \((\d+) kg\) : beaucoup de puissance et de confort, mais le contrôle peut manquer\. Monter d'1 kg resserrerait la précision\.$/,
    (t) => `Low tension (${t} kg): plenty of power and comfort, but control may fall short. Going up 1 kg would tighten precision.`],
  [/^Profil débutant : un cordage souple \(multifilament\) à tension modérée serait plus indulgent et plus confortable qu'un polyester rigide\.$/,
    () => 'Beginner profile: a soft string (multifilament) at moderate tension would be more forgiving and more comfortable than a stiff polyester.'],
  [/^Profil expert : vous pourriez gagner en contrôle avec un cordage plus rigide ou \+1 kg de tension\.$/,
    () => 'Expert profile: you could gain control with a stiffer string or +1 kg of tension.'],
  [/^Jeu de fond de court : un polyester texturé en jauge fine \(1\.20–1\.25\) maximiserait le lift\.$/,
    () => 'Baseline game: a textured polyester in a thin gauge (1.20–1.25) would maximise topspin.'],
  [/^Faible durabilité : si vous cassez souvent, optez pour une jauge plus épaisse \(1\.30\+\) ou un polyester\.$/,
    () => 'Low durability: if you break strings often, go for a thicker gauge (1.30+) or a polyester.'],
  [/^Configuration cohérente : aucun ajustement majeur recommandé\.$/, () => 'Consistent setup: no major adjustment recommended.'],
  // Synthèse.
  [/^Excellent équilibre puissance \/ contrôle \/ confort pour ce profil\.$/, () => 'Excellent power / control / comfort balance for this profile.'],
  [/^Bon compromis global, quelques ajustements possibles\.$/, () => 'Good overall compromise, a few adjustments possible.'],
  [/^Configuration correcte mais perfectible selon vos priorités\.$/, () => 'Decent setup, which can be improved depending on your priorities.'],
  [/^Configuration déséquilibrée : voir les recommandations ci-dessous\.$/, () => 'Unbalanced setup: see the recommendations below.'],
  [/^Analyse détaillée non disponible : les notes de ce cordage ne sont pas publiées\.$/,
    () => "Detailed analysis not available: this string's ratings are not published."],
];

/** Traduit un texte du moteur ; `null` si aucun motif ne le reconnaît (l'appelant affiche alors l'original). */
export function translateEngineText(text: string): string | null {
  for (const [re, fn] of ENGINE_EN) {
    const m = re.exec(text);
    if (m) return fn(...m.slice(1).map((x) => x ?? ''));
  }
  return null;
}

/** Paliers de `getStringRecommendation`, lus par leur libellé FR (aucun seuil recopié ici). */
const STRING_LEVEL_EN: Record<string, { level: string; description: string }> = {
  'Très Confortable': { level: 'Very Comfortable', description: 'Very soft setup, very low firmness index' },
  Confortable: { level: 'Comfortable', description: 'Good balance between comfort and performance' },
  Standard: { level: 'Standard', description: 'Balanced setup with good control' },
  Ferme: { level: 'Firm', description: 'Stiff setup that favours control' },
  'Très Ferme': { level: 'Very Firm', description: 'Very stiff setup, maximum control' },
};

/** Nature des notes /10 d'un cordage, en anglais (mêmes natures que `string-rating-nature.ts`, libellés de `rating-labels.js`). */
const RATING_NATURE_EN = {
  editorial: 'TSA team rating, not measured',
  harmonized: 'Average of the TSA team rating and published tester reviews, not measured',
  third_party: "Rating taken, in whole or in part, from a retailer's published test, not measured",
} as const;

/** Critères de la synthèse des testeurs (codes de `racquet-tester-ratings.ts`), en anglais. */
const TESTER_CRITERIA_EN: Record<string, string> = {
  PUI: 'Power', PEN: 'Penetration', PRE: 'Precision', CST: 'Consistency', TOL: 'Forgiveness', STA: 'Stability',
  MAN: 'Manoeuvrability', EFF: 'Spin', PLA: 'Flat hitting', TOU: 'Touch', CNF: 'Comfort', SER: 'Serve', VOL: 'Volley',
  RET: 'Return', DEF: 'Defence', POL: 'Versatility', ACC: 'Accessibility', ORI: 'Out-of-the-box playability',
  PER: 'Customisation', MAR: 'Positioning',
};

const formatScore20En = (value: number) => value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 });

const EN: ConfiguratorText = {
  homeHref: '/en/',
  signinHref: '/auth/signin?callbackUrl=/en/configurator',
  subtitle: 'Advanced system with a professional stringing log',
  backHome: '← Back to home',
  configTitle: 'Setup and Comfort Analysis',
  configName: 'Setup Name',
  configNamePlaceholder: 'E.g. Tournament setup 2025',
  chooseRacquet: 'Choose a Racquet',
  racquetPlaceholder: 'Search for a racquet (e.g. Babolat, Pure Aero, Wilson)...',
  estimated: ' (estimated)',
  weight: 'Weight',
  headSize: 'Head size',
  raUnknown: 'N/A',
  testerLine: (t) =>
    `Tester reviews (summary): average ${formatScore20En(t.average20)}/20 · ` +
    t.criteria.map((c) => `${(TESTER_CRITERIA_EN[c.key] ?? c.label).toLowerCase()} ${c.value20}/20`).join(' · '),
  mainString: 'Main String',
  mainStringPlaceholder: 'Search for a string (e.g. Luxilon, ALU Power, Polyester)...',
  stiffness: 'Stiffness',
  control: 'Control',
  comfort: 'Comfort',
  notPublished: 'not published',
  crossString: 'Cross String (optional hybrid)',
  crossTip: '💡 Leave empty to use one string throughout, or pick another string for a hybrid',
  crossPlaceholder: 'Search for a cross string (optional)...',
  removeCross: 'Remove the cross string',
  gauge: 'String Gauge',
  mains: 'Mains',
  crosses: 'Crosses',
  gaugeLabel: gaugeLabelEn,
  gaugeVeryThin: 'Very thin',
  gaugeThin: 'Thin',
  rateTitle: 'Rate your experience',
  rateGroup: 'Experience rating, from 1 to 5',
  rateStar: (star) => `${star} out of 5`,
  rateHelp: 'Your personal satisfaction',
  notesTitle: 'Personal notes',
  notesPlaceholder: 'Feel, playing conditions, weather...',
  liveTitle: '📊 Real-Time RCS Analysis',
  mainsOnly: (kg) => `Mains only (${kg} kg):`,
  crossesOnly: (kg) => `Crosses only (${kg} kg):`,
  rcsIndex: 'RCS index:',
  rcsIndexLive: 'RCS index',
  compatibility: 'Compatibility:',
  buySetup: 'Buy this setup — partner links',
  advancedTitle: '🔬 Advanced RCS Analysis',
  ratingsBasis: (hybrid) =>
    `Sub-scores and overall score: calculated from the ratings out of 10 of ${hybrid ? 'both strings' : 'the string'}, adjusted for tension, gauge and racquet.`,
  ratingsMain: (hybrid) => (hybrid ? 'Main string: ' : 'Ratings: '),
  ratingsCross: 'Cross string:',
  notAvailable: 'Not available',
  notAvailableLower: 'not available',
  subScores: { power: 'Power', control: 'Control', comfort: 'Comfort', spin: 'Spin', durability: 'Durability' },
  lockedTitle: 'Detailed sub-scores & personalised recommendations',
  goPremium: 'Go Premium',
  analyse: '💾 Analyse Comfort',
  save: '📊 Save to the Log',
  saveMissing: 'Please fill in all required fields',
  saveAccountOk: 'Setup saved to your account successfully!',
  saveQuota: 'The free plan is limited to 3 saved setups. Go Premium for an unlimited log.',
  saveAccountFailed: 'Saved locally (saving to your account failed).',
  saveOffline: 'Saved locally (offline).',
  saveLocalOk: 'Setup saved locally successfully!',
  saveSuccessMarker: 'successfully',
  logTitle: 'Stringing Log',
  logSyncedTitle: '✅ Synced log enabled',
  logSyncedText: 'Your saved setups are stored in your account and available on all your devices.',
  logView: '📚 View my stringing log',
  logLockedTitle: '🔒 Synced log',
  logLockedText: 'Sign in to save your setups to your account and find them on all your devices.',
  logPerks: ['✓ Setup history in your account', '✓ Sync across all your devices', '✓ Notes and ratings kept'],
  logSignin: 'Sign in to enable',
  currentConfig: 'Current setup',
  noRacquet: 'No racquet selected',
  noString: 'No string',
  previewIndex: (rcs, compat) => `RCS index: ${rcs} | Compatibility: ${compat}%`,
  guideTitle: 'ℹ️ Comfort Recommendations (RCS)',
  armComfort: 'Arm Comfort:',
  selectConfig: 'Select a setup',
  bandComfortable: 'Comfortable band:',
  bandComfortableRange: 'RCS from 20 to 25',
  bandStandard: 'Standard band:',
  bandStandardRange: 'RCS from 25 to 30',
  tennisElbow: 'Tennis Elbow:',
  tennisElbowText: 'Caution from 32 (alert if a sensitive arm is declared), risk from 35',
  savedCount: 'Saved setups',
  avgRcs: 'Average RCS',
  recent: 'Recent setups',
  noSaved: 'No saved setup',
  engine: (text) => translateEngineText(text) ?? text,
  stringLevel: (level, description) => STRING_LEVEL_EN[level] ?? { level, description },
  ratingLabel: (s) => {
    const nature = stringRatingNature(s);
    if (nature === 'none') return null;
    const label = RATING_NATURE_EN[nature];
    return isComfortRecalibrated(s) ? `${label}; ${COMFORT_RECALIBRATION_RULE.labelEn}` : label;
  },
  ratingsNotice:
    'Ratings out of 10 are not measured: the basis of each rating is shown next to it. The RCS index uses stiffness (lb/in) only; the arm alert can also be triggered by the comfort rating.',
};

export const CONFIGURATOR_TEXT: Record<ConfiguratorLocale, ConfiguratorText> = { fr: FR, en: EN };
