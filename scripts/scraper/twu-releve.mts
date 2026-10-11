/**
 * Relevé TWU COMPLET, normalisé et versionné (chantier D0, 10/10/2026). HORS LIGNE : aucune requête réseau.
 *
 * Le relevé brut (`scripts/scraper/out/twu-strings.json`, 788 enregistrements, non versionné) est la sortie de
 * `twu-fetch-strings.mjs` (UNE requête POST à TWU, le 29/09/2026). Ce module en tire
 * `data/reference/twu-releve-complet.json`, qui garde, pour chaque enregistrement :
 *   - les 8 champs bruts, INCHANGÉS et dans l'ordre : le brut est exactement `JSON.stringify(enregistrements, null, 2)`
 *     (sans retour final), donc ces champs suffisent à le reconstruire à l'octet près et à en vérifier le sha256 ;
 *   - 4 champs dérivés du seul intitulé, sans rien y ajouter : `model`, `suffix`, `calibre`, `gaugeNameMm`
 *     (`name` = `model` + ' ' + `suffix`). Les quatre formats de suffixe sont ceux de l'appariement strict de #110 ;
 *     tout autre intitulé reste entier dans `model` (suffixe, calibre et jauge du nom : null).
 *
 *   npx tsx scripts/scraper/twu-releve.mts           écrit le fichier versionné depuis le relevé brut local
 *   npx tsx scripts/scraper/twu-releve.mts --check   régénère en mémoire et compare (code 1 si différent ou brut absent)
 *
 * Date, nombre d'enregistrements et sha256 de référence : `STIFFNESS_SOURCE.fullSurvey`
 * (src/data/string-stiffness-provenance.ts). Le contrôle 13 ter de `audit:ratings` importe ce module.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { STIFFNESS_SOURCE } from '../../src/data/string-stiffness-provenance';

export const RAW_KEYS = ['name', 'refTensionLbs', 'swingSpeed', 'material', 'gaugeNominalMm', 'stiffnessLbIn', 'tensionLossPct', 'spinPotential'] as const;
export const DERIVED_KEYS = ['model', 'suffix', 'calibre', 'gaugeNameMm'] as const;

export interface RawRow {
  name: string;
  refTensionLbs: number;
  swingSpeed: string;
  material: string | null;
  gaugeNominalMm: number | null;
  stiffnessLbIn: number;
  tensionLossPct: number;
  spinPotential: number | null;
}
export interface ReleveRow extends RawRow {
  model: string;
  suffix: string | null;
  calibre: string | null;
  gaugeNameMm: number | null;
}

export const sha256 = (x: string | Buffer): string => createHash('sha256').update(x).digest('hex');

// « 16 », « 16L (1.30) », « 17/1.24 » ou « 1.25 » en fin d'intitulé, après une espace : les quatre formats stricts de #110.
const SUFFIX = /^(?<model>.+?) (?<suffix>(?<cal>\d{2}L?)(?: ?\((?<g1>\d\.\d+)\)| ?\/ ?(?<g2>\d\.\d+))?|(?<g3>\d\.\d{2}))$/i;

export function splitName(name: string): Pick<ReleveRow, (typeof DERIVED_KEYS)[number]> {
  const g = SUFFIX.exec(name)?.groups;
  if (!g) return { model: name, suffix: null, calibre: null, gaugeNameMm: null };
  const mm = g.g1 ?? g.g2 ?? g.g3;
  return { model: g.model, suffix: g.suffix, calibre: g.cal ? g.cal.toUpperCase() : null, gaugeNameMm: mm === undefined ? null : Number(mm) };
}

export const pick = (r: RawRow): RawRow => Object.fromEntries(RAW_KEYS.map((k) => [k, r[k]])) as unknown as RawRow;
export const normaliseRows = (raw: readonly RawRow[]): ReleveRow[] => raw.map((r) => ({ ...pick(r), ...splitName(r.name) }));
/** Texte du relevé brut reconstruit depuis les seuls champs bruts (format de `twu-fetch-strings.mjs`). */
export const rawTextOf = (rows: readonly RawRow[]): string => JSON.stringify(rows.map(pick), null, 2);

export function serialiseReleve(rows: readonly ReleveRow[]): string {
  const S = STIFFNESS_SOURCE;
  const V = S.fullSurvey;
  const head: Record<string, unknown> = {
    source: 'Tennis Warehouse University — String Performance Database',
    url: S.url,
    request: S.request,
    retrieved: V.retrieved,
    verifiedIdentical: V.verifiedIdentical,
    conditions: { refTensionLbs: S.referenceTensionLbs, swingSpeed: S.swingSpeed, unit: 'lb/in' },
    rawSha256: V.sha256,
    rawRecords: V.records,
    rawFile: `${V.raw} (non versionné)`,
    rawFormat: 'JSON.stringify(enregistrements, null, 2), sans retour final : les 8 champs bruts de chaque enregistrement, dans l\'ordre, reconstruisent le relevé brut à l\'octet près (sha256 ci-dessus)',
    scope: 'URL, date et conditions valent pour les enregistrements du fichier entier (une seule requête)',
    fields: {
      name: 'intitulé TWU tel que publié (marque, modèle, calibre éventuel)',
      refTensionLbs: 'tension de référence (lbs)',
      swingSpeed: 'vitesse de balayage',
      material: 'matière TWU (Polyester, Nylon, Nylon/Zyex, Gut…) ; null si TWU ne la renseigne pas',
      gaugeNominalMm: 'colonne « Gauge Nominal » (mm) ; null quand TWU publie 0 (jauge non renseignée)',
      stiffnessLbIn: 'rigidité mesurée (lb/in)',
      tensionLossPct: 'perte de tension (%)',
      spinPotential: 'potentiel d\'effet ; null si non publié',
      model: 'intitulé sans le suffixe de calibre, marque comprise (TWU ne la sépare pas du modèle) ; intitulé entier si aucun suffixe reconnu',
      suffix: 'fin d\'intitulé reconnue (« 16 », « 16L (1.30) », « 17/1.24 », « 1.25 ») ; null si aucun des quatre formats stricts',
      calibre: 'calibre lu dans le suffixe (« 16L ») ; null sinon',
      gaugeNameMm: 'jauge en mm écrite dans le suffixe ; null sinon (peut différer de gaugeNominalMm : le contrôle ne le corrige pas)',
    },
    regeneration: 'npx tsx scripts/scraper/twu-releve.mts [--check] : hors ligne, depuis le relevé brut local',
  };
  const top = Object.entries(head).map(([k, v]) => ` ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join('\n');
  return `{\n${top}\n "records": [\n${rows.map((r) => `  ${JSON.stringify(r)}`).join(',\n')}\n ]\n}\n`;
}

function main(): void {
  const V = STIFFNESS_SOURCE.fullSurvey;
  const check = process.argv.includes('--check');
  const fail = (msg: string): never => {
    console.error(msg);
    process.exit(1);
  };
  if (!existsSync(V.raw)) fail(`relevé brut absent (${V.raw}) : non versionné, la régénération n'est possible que là où il a été obtenu (aucune requête réseau ici)`);
  const bytes = readFileSync(V.raw);
  if (sha256(bytes) !== V.sha256) fail(`sha256 du relevé brut ${sha256(bytes)} ≠ ancrage ${V.sha256} (string-stiffness-provenance.ts) : autre relevé ? mettre l'ancrage à jour délibérément`);
  const raw = JSON.parse(bytes.toString('utf8')) as RawRow[];
  if (rawTextOf(raw) !== bytes.toString('utf8')) fail('le relevé brut n\'est plus au format JSON.stringify(enregistrements, null, 2) : la reconstruction par sha256 ne tient plus');
  if (raw.length !== V.records) fail(`${raw.length} enregistrements ≠ ancrage ${V.records}`);
  const out = serialiseReleve(normaliseRows(raw));
  if (check) {
    const disk = existsSync(V.file) ? readFileSync(V.file, 'utf8').replace(/\r\n/g, '\n') : null;
    if (disk !== out) fail(`${V.file} ${disk === null ? 'absent' : 'DIFFÉRENT de la régénération'} : relancer sans --check`);
    console.log(`ok : ${V.file} identique à la régénération (${raw.length} enregistrements, sha256 du brut ${V.sha256.slice(0, 7)}…${V.sha256.slice(-4)})`);
    return;
  }
  writeFileSync(V.file, out);
  console.log(`${V.file} écrit : ${raw.length} enregistrements (sha256 du brut ${V.sha256.slice(0, 7)}…${V.sha256.slice(-4)})`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
