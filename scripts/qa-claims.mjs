#!/usr/bin/env node
/**
 * QA CLAIMS — plus d'allégation de santé ni de claim faux dans les pages, les métadonnées, le JSON-LD
 * et les dictionnaires (tsa-acquisition, 11/10/2026).
 *
 * Origine. Audit croisé de `tsa-core` et `tsa-pigiste` du 11/10/2026 : l'interface promettait ce que le
 * produit ne peut pas tenir. Exemples relevés (tous dans ce script, comme tests négatifs) :
 *   - santé : « prevent or relieve tennis elbow » (carte du blog EN), « préserver votre bras »,
 *     « doux pour le bras », « Ideal if you are protecting your arm », « ideal for sensitive arms »
 *     pour un RCS de 0 à 30 alors que l'alerte bras commence à 32 ;
 *   - faux : « Base de données complète — Specs vérifiées et tenues à jour » (RA absent de 29 fiches,
 *     équilibre de 91, des rigidités sans mesure), « recommandations IA » (aucune IA), « Join thousands
 *     of players » (28 à 43 humains par mois), « RCS (0-100) » (l'échelle publiée va de 11 à 41),
 *     « score de confort objectif » (un indice calculé par formule), un aperçu d'accueil « Confortable
 *     23 » pour un montage dont l'indice est 32 ;
 *   - absolus : « parfaits pour votre style de jeu », « montage idéal », « RCS Optimal ».
 * Principe (CLAUDE.md §4 règles 2 et 3, charte F7) : dire ce qui est vrai. Le confort d'un montage se
 * dit par son INDICE RCS et par les seuils d'alerte du configurateur, jamais par un effet promis sur le
 * bras ; un champ non publié est affiché comme tel ; aucun absolu. Les AVERTISSEMENTS de risque
 * (« très ferme, risque de tennis elbow », « alerte dès 32 pour un bras sensible ») restent : ils
 * protègent, et ils sont des témoins positifs permanents de ce script.
 *
 * Ce que le script lit. Tout texte qu'un visiteur ou un moteur peut lire :
 *   - HTML : texte visible (balises lues comme des espaces : « Find Your <span>Perfect</span> »
 *     se lit « Find Your Perfect »), attributs meta/alt/title/aria-label/placeholder, JSON-LD (lu
 *     comme du JSON, valeur par valeur), chaînes des scripts en ligne ;
 *   - code (TS, TSX, JS) : chaînes, gabarits, texte JSX, blocs `metadata`, JSON-LD construit en TS,
 *     dictionnaires. Analyse syntaxique : les commentaires n'en font pas partie.
 *
 * Périmètre et sévérité.
 *   ÉCHEC   public/ hors blog, hors public/js (pages EN, fiches EN générées, pages racine) ; les deux
 *           index du blog ; src/ (app, components, lib, types), scripts/en-products (gabarits).
 *   AVERT   les articles du blog (leur fact-check est celui de `tsa-pigiste`, leur corps celui de
 *           `tsa-redacteur` : le script signale, il ne bloque pas) ; public/js (moteur RCS statique,
 *           traité par `tsa-core` en parallèle : passer JS_SEVERITY à 'fail' une fois sa PR fusionnée) ;
 *           tout fichier de src/ qu'aucune route n'atteint (composant sans import : rien n'est affiché).
 *   HORS    src/data (descriptions des fiches : contrôle 19 de `audit:ratings`), public/images,
 *           public/data.
 *
 * Exceptions. Constante EXCEPTIONS : explicites, datées, motivées ; une exception qui ne correspond plus
 * à rien échoue (une exception qui survit à son motif est une dette cachée).
 *
 * Tests négatifs permanents (section finale, exécutés à chaque lancement) : chaque ancien texte fautif
 * DOIT échouer, chaque avertissement légitime DOIT passer, un blog ou un moteur statique donne des
 * AVERT et jamais un échec. Un garde-fou muet échoue.
 *
 * Périmètre du script : `tsa-measure` (scripts/qa-*), écrit par tsa-acquisition — signalé dans la PR.
 * Les fonctions de repérage (HTML, code) reprennent celles de qa-comptages-catalogue.mjs ; leur
 * factorisation dans un module commun est à décider par `tsa-measure`.
 *
 * Usage : node scripts/qa-claims.mjs [--all]    (npm run audit:claims ; --all : tous les AVERT)
 * Sortie : 0 si conforme, 1 sinon.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const ROOT = process.cwd();
const ts = createRequire(path.join(ROOT, 'package.json'))('typescript');
const SHOW_ALL = process.argv.includes('--all');

let failures = 0;
let warnings = 0;
const ok = (msg) => process.stdout.write(`  OK    ${msg}\n`);
const fail = (msg) => {
  failures++;
  process.stdout.write(`  ECHEC ${msg}\n`);
};
const warn = (msg) => {
  warnings++;
  process.stdout.write(`  AVERT ${msg}\n`);
};

/** Sévérité du moteur statique de public/js : AVERT tant que `tsa-core` n'a pas fusionné sa PR. */
const JS_SEVERITY = 'warn';

// Caractères invisibles : toujours par leur nom, jamais littéraux dans le source.
const NBSP = String.fromCharCode(0xa0);
const NNBSP = String.fromCharCode(0x202f);
const HOLE = String.fromCharCode(1); // tient la place d'une expression (gabarit, JSX)
const SPACES_RE = new RegExp(`[${NBSP}${NNBSP}]`, 'g');
const APOS_RE = /[‘’ʼ]/g;
const normalize = (s) => s.replace(SPACES_RE, ' ').replace(APOS_RE, "'");

// ---------------------------------------------------------------------------
// Exceptions : explicites, datées, motivées.
//   { file, contains, date: 'AAAA-MM-JJ', reason }
// `contains` est le texte du constat tel que ce script le rapporte.
// ---------------------------------------------------------------------------
const EXCEPTIONS = [
  {
    file: 'public/en/rcs-calculator.html',
    contains: 'Post-injury rehabilitation',
    date: '2026-10-11',
    reason:
      "libellé d'un profil que le visiteur CHOISIT (liste « Your Profile »), comme « Tennis elbow, elbow pain » du configurateur : ce n'est pas une promesse de l'outil. Le texte que le moteur rend pour ce profil est celui de public/js (AVERT, tsa-core).",
  },
];

function exceptionProblems(list) {
  const problems = [];
  list.forEach((e, i) => {
    const id = `exception n° ${i + 1}${e?.file ? ` (${e.file})` : ''}`;
    if (!e || typeof e.file !== 'string' || !e.file.trim()) problems.push(`${id} : « file » manquant`);
    if (!e || typeof e.contains !== 'string' || !e.contains.trim()) problems.push(`${id} : « contains » manquant`);
    if (!e || typeof e.reason !== 'string' || e.reason.trim().length < 15) problems.push(`${id} : « reason » absent ou trop court (15 caractères au moins : un motif, pas une étiquette)`);
    if (!e || typeof e.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(e.date) || Number.isNaN(Date.parse(e.date))) problems.push(`${id} : « date » absente ou invalide (AAAA-MM-JJ)`);
  });
  return problems;
}

/** Retire les constats d'échec couverts par une exception ; renvoie aussi les exceptions inutilisées. */
function applyExceptions(findings, list) {
  const used = new Set();
  const kept = findings.filter((f) => {
    if (f.severity !== 'fail') return true;
    const idx = list.findIndex((e) => e && e.file === f.file && typeof e.contains === 'string' && typeof f.text === 'string' && f.text.toLowerCase().includes(e.contains.toLowerCase()));
    if (idx < 0) return true;
    used.add(idx);
    return false;
  });
  return { kept, unused: list.filter((_, i) => !used.has(i)) };
}

// ---------------------------------------------------------------------------
// Le catalogue des motifs. Chaque entrée : une classe, un identifiant, une expression.
//   sante  — allégation de santé (prévention, soulagement, traitement, protection, absolu)
//   faux   — affirmation fausse ou invérifiable sur le site, ses données, son audience, son échelle
//   absolu — promesse de résultat (« parfait », « idéal », « optimal »)
// Les expressions s'écrivent avec des jetons : <B> début de mot, <E> fin de mot, <W> un mot,
// <GAP> jusqu'à quatre mots entre un verbe et son objet, <ART> une élision (l', d'). Les lettres
// accentuées ne sont pas des « caractères de mot » pour \b : d'où <B> et <E>.
// ---------------------------------------------------------------------------
const TOKENS = {
  '<B>': String.raw`(?<![\p{L}\p{N}_])`,
  '<E>': String.raw`(?![\p{L}\p{N}_])`,
  '<W>': String.raw`[\p{L}\p{N}'-]+`,
  '<GAP>': String.raw`(?:\s+[\p{L}\p{N}'-]+){0,4}?\s+`,
  '<ART>': String.raw`(?:[ld]')?`,
};
const expand = (src) => src.replace(/<[BEW]>|<GAP>|<ART>/g, (t) => TOKENS[t]);

const HEALTH_OBJ_EN = String.raw`(?:tennis[- ]elbow|elbows?|epicondyl[\p{L}]*|tend(?:on|in)[\p{L}]*|injur(?:y|ies)|pains?|aches?|arms?|joints?|shoulders?|wrists?|symptoms?)`;
const HEALTH_OBJ_FR = String.raw`(?:tennis[- ]elbow|coudes?|[ée]picondyl[\p{L}]*|tend(?:on|in)[\p{L}]*|blessures?|douleurs?|bras|articulations?|[ée]paules?|poignets?|sympt[ôo]mes?)`;

const CLAIMS = [
  // ---- SANTÉ : un verbe de prévention, de soulagement, de traitement ou de protection + un objet de santé
  {
    cls: 'sante',
    id: 'verbe-objet-en',
    re: `<B>(?:prevent(?:s|ed|ing)?|relieve[sd]?|relieving|alleviat(?:e|es|ed|ing)|heal(?:s|ed|ing)?|cure[sd]?|curing|treat(?:s|ed|ing)?|soothe[sd]?|soothing|protect(?:s|ed|ing)?|safeguard(?:s|ed|ing)?|rehabilitat(?:e|es|ed|ing))<E><GAP><ART><B>${HEALTH_OBJ_EN}<E>`,
  },
  {
    cls: 'sante',
    id: 'verbe-objet-fr',
    re: `<B>(?:pr[ée]ven(?:ir|ez|ons|tion|ant)|soulag(?:er|e|es|ent|ement|eant)|gu[ée]r(?:ir|it|issent|ison)|soign(?:er|e|es|ent|ement)|trait(?:er|e|es|ent|ement)|apais(?:er|e|es|ent)|prot[éèe]g(?:er|e|es|ent|eant|ez)|pr[ée]serv(?:er|e|es|ent|ez|ation)|m[ée]nag(?:er|e|es|ent|eant))<E><GAP><ART><B>${HEALTH_OBJ_FR}<E>`,
  },
  // « prévient » seul peut vouloir dire « avertit » (« l'alerte prévient si votre bras… ») : forme conjuguée retenue devant un objet de santé précis
  { cls: 'sante', id: 'previent-fr', re: `<B>pr[ée]vien(?:t|nent|dra|drait)<E><GAP><ART><B>(?:tennis[- ]elbow|[ée]picondylite|blessures?|douleurs?|tendinite)<E>` },
  { cls: 'sante', id: 'prevenir-ou-soulager', re: `<B>(?:prevent or relieve|pr[ée]venir ou soulager|injury prevention|pr[ée]vention des blessures|prevention of injur[\\p{L}]*)<E>` },
  { cls: 'sante', id: 'contre-tennis-elbow', re: `<B>contre (?:le |la |les )?(?:tennis[- ]elbow|[ée]picondylite|blessures?|douleurs?)<E>` },
  { cls: 'sante', id: 'protection-bras', re: `<B>(?:(?:arm|joint|elbow) protection|protection (?:of|for) (?:the |your )?(?:arm|joints?|elbow)|protection (?:du |de votre |des )?(?:bras|coude|articulations)|priority on (?:joint|arm|elbow) health)<E>` },
  { cls: 'sante', id: 'termes-medicaux', re: `<B>(?:post-injury )?(?:therapeutic|th[ée]rapeutiques?|therapy|th[ée]rapie|rehabilitation|r[ée][ée]ducation)<E>` },
  {
    cls: 'sante',
    id: 'absolu-en',
    re: `<B>(?:risk[- ]free|injury[- ]free|pain[- ]free|zero risk|completely safe|totally safe|100 ?% safe|without (?:any )?(?:risk|strain|pain|injur(?:y|ies)|discomfort)|safe (?:for|on|to) (?:your |the )?(?:arm|elbow|joints?|wrists?|shoulders?)|(?:gentle|gentler|kind|easy|forgiving|soft) (?:on|to|for|with) (?:your |the )?(?:arm|elbow|joints?|wrists?|shoulders?)|(?:arm|joint|elbow)[- ]friendly|(?:ideal|perfect|recommended|suitable|safest) (?:for|if|when)<GAP>(?:sensitive arms?|tennis elbow|(?:the |your )?elbow|arm (?:issues?|problems?|pain|injur[\\p{L}]*)|injur[\\p{L}]*|protecting (?:your )?arm)|reduces? (?:the )?stress transmitted to the arm)<E>`,
  },
  {
    cls: 'sante',
    id: 'absolu-fr',
    re: `<B>(?:sans (?:danger|risque|douleur|blessure)s?|z[ée]ro (?:risque|douleur|blessure)|(?:doux|douce|douces|ami|amie|gentil|bienveillante?) (?:pour|avec|envers|du|de) (?:le |la |les |l')?(?:bras|coude|articulations?)|(?:id[ée]al(?:e|es|aux)?|parfait(?:e|es|s)?|recommand[ée]e?s?|adapt[ée]e?s?|con[çc]ue?s?) (?:pour|aux?) (?:les |le |un |une |votre |vos )?(?:[\\p{L}]+ ){0,2}(?:coudes?|bras (?:sensibles?|fragiles?)|[ée]picondylite|tennis[- ]elbow|blessures?|douleurs?)|adapt[ée][\\p{L}]* (?:à|a|aux?) (?:[\\p{L}]+,? ){0,6}?(?:sensibilit[ée](?: du| au| de votre)? bras|bras sensibles?)|[ée]vite(?:r|z|nt)? les montages)<E>`,
  },
  { cls: 'sante', id: 'evite-en', re: `<B>avoid(?:s)? overly stiff setups<E>` },
  { cls: 'sante', id: 'vibrations', re: `<B>(?:absorbs?|dampens?|reduces?|fewer|less|filters?) (?:the |your )?vibrations?<E>` },

  // ---- FAUX : ce que le site, ses données, son audience ou son échelle ne permettent pas d'affirmer
  { cls: 'faux', id: 'base-complete', re: `<B>(?:base de donn[ée]es compl[èe]te|complete database|exhaustive database)<E>` },
  {
    cls: 'faux',
    id: 'specs-verifiees',
    re: `<B>(?:(?:sp[ée]cifications?|specs?|donn[ée]es|specifications?) (?:v[ée]rifi[ée]e?s?|verified)|verified,? (?:and )?(?:up-to-date )?(?:specs?|specifications?)|(?:tenues?|maintenues?|gard[ée]es?) [àa] jour|kept (?:up[- ]to[- ]date|current)|up-to-date specs?)<E>`,
  },
  {
    cls: 'faux',
    id: 'ia',
    re: `<B>(?:(?:recommandations?|suggestions?|conseils?) (?:par |de |d')?(?:l')?IA|AI[- ](?:powered|based|driven|generated|assisted|recommendations?|suggestions?|analysis|analy[sz]es?)|our AI|powered by AI|intelligence artificielle|artificial intelligence|IA personnalis[ée]e?s?)<E>`,
  },
  {
    cls: 'faux',
    id: 'objectif',
    re: `<B>(?:score (?:de )?confort objectif|objective comfort score|compare objectivement|objectively compar[\\p{L}]*|score objectif|objective score)<E>`,
  },
  {
    cls: 'faux',
    id: 'audience',
    re: `<B>(?:(?:thousands|hundreds|millions) of (?:[\\p{L}]+ ){0,2}(?:players|users|athletes)|des? (?:milliers|centaines|millions) de (?:joueurs|joueuses|utilisateurs)|who (?:have )?improved their (?:playing )?comfort)<E>`,
  },
  {
    cls: 'faux',
    id: 'joint-stress',
    re: `<B>(?:joint[- ]stress|joint comfort|stress on (?:your |the )?joints?|evaluates? (?:the )?(?:joint|arm) stress)<E>`,
  },
  // légende d'une jauge « 0 … 100 » : l'indice publié va de 11 à 41
  { cls: 'faux', id: 'legende-echelle', re: `<B>(?:0 ?[-–] ?maximum comfort|100 ?[-–] ?maximum performance)<E>` },
  // « de 0 à 100 », « (0-100) » à côté du RCS : l'échelle publiée va de 11 à 41 (paliers < 20, 20-25, 25-30, 30-35, ≥ 35)
  { cls: 'faux', id: 'echelle-0-100', re: `<B>0 ?(?:to|à|[-–]) ?100<E>`, near: /\b(?:RCS|comfort|confort|score|indice|index)\b/i, nearRadius: 160 },

  // ---- ABSOLU : une promesse de résultat
  {
    cls: 'absolu',
    id: 'parfait-ideal-en',
    re: `<B>(?:(?:perfect|ideal) (?:tennis )?(?:set-?up|strings?|racquets?|rackets?|equipment|gear|configuration|match|combination|tension)|your (?:perfect|ideal)|(?:perfect|ideal) for your (?:game|playing style|style|level)|(?:comfort )?suited to the majority of players)<E>`,
  },
  {
    cls: 'absolu',
    id: 'parfait-ideal-fr',
    re: `<B>(?:(?:cordages?|raquettes?|montages?|setups?|configurations?|[ée]quipements?|combinaisons?) (?:id[ée]al(?:e|es|aux)?|parfait(?:e|es|s)?)|(?:id[ée]al|parfait)(?:e|es|s)? pour (?:votre|vos) (?:style|jeu|niveau)|confort adapt[ée] [àa] la majorit[ée])<E>`,
  },
  { cls: 'absolu', id: 'optimal', re: `<B>(?:(?:RCS|indice|score) optimale?|optimale? (?:setup|configuration|montage)|configuration optimale)<E>` },
];

const FLAGS = 'giu';
const PATTERNS = CLAIMS.map((c) => {
  try {
    return { ...c, regex: new RegExp(expand(c.re), c.flags ?? FLAGS) };
  } catch (e) {
    process.stdout.write(`  ECHEC motif « ${c.cls}/${c.id} » illisible : ${e.message}\n`);
    process.exit(1);
  }
});

const HINT = {
  sante: "dire l'indice RCS et ses seuils d'alerte (dès 32 pour un bras sensible, dès 35 sinon), jamais un effet sur le bras (charte F7, règle 2)",
  faux: 'dire ce qui est vrai : champ non publié affiché comme tel, indice de fermeté (11 à 41), aucune IA, aucun chiffre d\'audience (règle 3)',
  absolu: 'décrire ce que fait la page (comparer, calculer, filtrer), sans promesse de résultat',
};
const CLASS_FR = { sante: 'allégation de santé', faux: 'claim faux ou invérifiable', absolu: 'promesse de résultat' };

/**
 * Le texte, espaces et retours à la ligne ramenés à une seule espace : « Perfect</span> <span>Racquet »
 * (balises lues comme des blancs), une phrase coupée sur deux lignes ou un JSX imbriqué se lisent d'une
 * traite. `map[i]` rend la position, dans le texte d'origine, du caractère i du texte aplati.
 */
function collapse(raw) {
  const text = normalize(raw);
  let flat = '';
  const map = [];
  for (let i = 0; i < text.length; i++) {
    const isSpace = /\s/.test(text[i]);
    if (isSpace && flat.endsWith(' ')) continue;
    flat += isSpace ? ' ' : text[i];
    map.push(i);
  }
  return { flat, map };
}

/** Constats d'un texte : { index, id, cls, text } (index dans le texte d'origine). */
function claimsIn(raw) {
  const { flat, map } = collapse(raw);
  const out = [];
  for (const p of PATTERNS) {
    for (const m of flat.matchAll(p.regex)) {
      if (p.near) {
        const around = flat.slice(Math.max(0, m.index - p.nearRadius), m.index + m[0].length + p.nearRadius);
        if (!p.near.test(around)) continue;
      }
      out.push({ index: map[m.index], id: p.id, cls: p.cls, text: m[0].trim() });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Lignes et constats
// ---------------------------------------------------------------------------
const lineStarts = (text) => {
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) starts.push(i + 1);
  return starts;
};
const lineAt = (starts, offset) => {
  let lo = 0;
  let hi = starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (starts[mid] <= offset) lo = mid;
    else hi = mid - 1;
  }
  return lo + 1;
};

/** Un constat : { severity, file, line, where, cls, id, text } */
const finding = (base, c, where) => ({ ...base, where, cls: c.cls, id: c.id, text: c.text });

function describe(f) {
  if (f.kind === 'jsonld-invalide') return `${f.file}:${f.line} JSON-LD illisible (${f.text}) : ses textes ne sont pas vérifiables`;
  return `${f.file}:${f.line} ${f.where} « ${f.text} » [${f.cls}/${f.id}] ${CLASS_FR[f.cls]}${f.severity === 'fail' ? ` — ${HINT[f.cls]}` : ''}`;
}

// ---------------------------------------------------------------------------
// Code (TS, TSX, JS) : chaînes, gabarits, texte JSX — jamais les commentaires
// ---------------------------------------------------------------------------
class Unit {
  constructor() {
    this.text = '';
    this.anchors = [];
  }
  add(str, pos) {
    this.anchors.push({ flat: this.text.length, pos });
    this.text += str;
  }
  posAt(i) {
    let a = this.anchors[0];
    for (const x of this.anchors) {
      if (x.flat <= i) a = x;
      else break;
    }
    return a.pos + (i - a.flat);
  }
}
const scriptKindOf = (file) => (/\.tsx$/i.test(file) ? ts.ScriptKind.TSX : /\.(?:ts|mts|cts)$/i.test(file) ? ts.ScriptKind.TS : ts.ScriptKind.JS);

/** Les textes qu'un fichier de code peut émettre. */
function codeUnits(src, fileName) {
  const sf = ts.createSourceFile(fileName, src, ts.ScriptTarget.Latest, true, scriptKindOf(fileName));
  const units = [];
  const single = (text, pos) => {
    const u = new Unit();
    u.add(text, pos);
    units.push(u);
  };
  // Texte d'un élément JSX mis bout à bout : `<strong>Parfait</strong> pour vous` se lit « Parfait pour vous ».
  const flatten = (n, u) => {
    for (const child of n.children) {
      if (ts.isJsxText(child)) u.add(child.text, child.pos);
      else if (ts.isJsxExpression(child)) {
        const e = child.expression;
        if (e && (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e) || ts.isNumericLiteral(e))) u.add(e.text, e.getStart(sf));
        else u.add(HOLE, child.getStart(sf));
      } else if (ts.isJsxElement(child) || ts.isJsxFragment(child)) {
        u.add(' ', child.getStart(sf));
        flatten(child, u);
        u.add(' ', child.end);
      } else u.add(' ', child.getStart(sf));
    }
  };
  const visit = (node, inJsx) => {
    if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      if (!inJsx) {
        const u = new Unit();
        flatten(node, u);
        units.push(u);
      }
      ts.forEachChild(node, (c) => visit(c, true));
      return;
    }
    if (ts.isJsxText(node)) return; // lu via flatten
    if (ts.isJsxExpression(node)) {
      ts.forEachChild(node, (c) => visit(c, false));
      return;
    }
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      single(node.text, node.getStart(sf));
      return;
    }
    if (ts.isTemplateExpression(node)) {
      const u = new Unit();
      u.add(node.head.text, node.head.getStart(sf));
      for (const span of node.templateSpans) {
        u.add(HOLE, span.expression.getStart(sf));
        u.add(span.literal.text, span.literal.getStart(sf));
      }
      units.push(u);
      ts.forEachChild(node, (c) => visit(c, inJsx));
      return;
    }
    ts.forEachChild(node, (c) => visit(c, inJsx));
  };
  visit(sf, false);
  return { sf, units };
}

function scanCode(src, { file, severity = 'fail' }) {
  const { sf, units } = codeUnits(src, file);
  const seen = new Set();
  const out = [];
  const lineOfPos = (pos) => sf.getLineAndCharacterOfPosition(pos).line + 1;
  for (const u of units) {
    for (const c of claimsIn(u.text)) {
      const line = lineOfPos(u.posAt(c.index));
      const key = `${line}|${c.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(finding({ severity, file, line }, c, 'texte du code'));
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// HTML : texte visible, attributs de texte, JSON-LD, scripts en ligne
// ---------------------------------------------------------------------------
const TAG_RE = /<\/?[a-zA-Z](?:[^>"']|"[^"]*"|'[^']*')*>/g;
const NBSP_ENT_RE = /&(?:nbsp|thinsp|ensp|emsp|#160|#8201|#8239|#xa0|#x202f);/gi;
const TEXT_ATTRS = new Set(['content', 'alt', 'title', 'aria-label', 'placeholder']);
const blank = (s) => s.replace(/[^\n]/g, ' '); // même longueur, mêmes retours à la ligne : les décalages restent exacts
const decodeAttr = (s) => s.replace(NBSP_ENT_RE, ' ').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&');

/** Les valeurs textuelles d'un JSON parsé, avec leur clé. */
function jsonStrings(node, out = []) {
  if (typeof node === 'string') out.push(node);
  else if (Array.isArray(node)) node.forEach((n) => jsonStrings(n, out));
  else if (node && typeof node === 'object') Object.values(node).forEach((n) => jsonStrings(n, out));
  return out;
}

function scanHtml(html, { file, severity = 'fail', inlineJs = true }) {
  const out = [];
  const starts = lineStarts(html);
  const base = (offset) => ({ severity, file, line: lineAt(starts, offset) });

  // 1. Blocs <script> : JSON-LD (lu comme du JSON), JavaScript en ligne (lu comme du code)
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1];
    const body = m[2];
    const bodyOffset = m.index + m[0].length - '</script>'.length - body.length;
    if (/\btype\s*=\s*["']?application\/ld\+json/i.test(attrs)) {
      let parsed;
      try {
        parsed = JSON.parse(body);
      } catch (e) {
        out.push({ ...base(bodyOffset), kind: 'jsonld-invalide', where: 'JSON-LD', text: e.message });
        continue;
      }
      for (const s of jsonStrings(parsed)) {
        for (const c of claimsIn(s)) {
          // la ligne : où la valeur commence dans le bloc brut (repli : début du bloc)
          const at = body.indexOf(s.slice(0, 40).replace(/"/g, '\\"'));
          out.push(finding(base(bodyOffset + Math.max(at, 0)), c, 'JSON-LD'));
        }
      }
    } else if (inlineJs && !/\bsrc\s*=/i.test(attrs) && body.trim() && (!/\btype\s*=/i.test(attrs) || /\btype\s*=\s*["']?(?:text\/javascript|module)/i.test(attrs))) {
      const { units } = codeUnits(body, 'inline.js');
      for (const u of units) {
        for (const c of claimsIn(u.text)) out.push(finding(base(bodyOffset + u.posAt(c.index)), c, 'script en ligne'));
      }
    }
  }

  // 2. Texte visible : tout ce qui n'est ni balise, ni commentaire, ni script, ni style (les balises
  //    deviennent des espaces : « Find Your <span>Perfect</span> Setup » se lit d'une traite)
  const withoutBlocks = html.replace(/<!--[\s\S]*?-->|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi, blank);
  const visible = withoutBlocks.replace(TAG_RE, blank).replace(NBSP_ENT_RE, blank);
  for (const c of claimsIn(visible)) out.push(finding(base(c.index), c, 'texte visible'));

  // 3. Attributs qui portent du texte lu : meta content (description, og:*, twitter:*), alt, title…
  for (const t of withoutBlocks.matchAll(TAG_RE)) {
    const tag = t[0];
    const name = (tag.match(/^<\/?([a-zA-Z][\w:-]*)/) ?? [])[1]?.toLowerCase();
    const label = (tag.match(/\b(?:name|property)\s*=\s*["']([^"']+)["']/i) ?? [])[1];
    for (const a of tag.matchAll(/([a-zA-Z:_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
      const attr = a[1].toLowerCase();
      if (!TEXT_ATTRS.has(attr)) continue;
      for (const c of claimsIn(decodeAttr(a[2] ?? a[3] ?? ''))) {
        out.push(finding(base(t.index + a.index), c, `<${name}${label ? ` ${label}` : ''}> ${attr}`));
      }
    }
  }
  return out;
}

function scanPlain(text, { file, severity = 'fail' }) {
  const starts = lineStarts(text);
  return claimsIn(text).map((c) => finding({ severity, file, line: lineAt(starts, c.index) }, c, 'texte'));
}

function scanFile(file, text, opts = {}) {
  if (/\.html?$/i.test(file)) return scanHtml(text, { file, ...opts });
  if (/\.(?:tsx?|mts|cts|mjs|cjs|js)$/i.test(file)) return scanCode(text, { file, ...opts });
  return scanPlain(text, { file, ...opts });
}

// ---------------------------------------------------------------------------
// Fichiers : parcours, et code que rien n'atteint
// ---------------------------------------------------------------------------
function walk(dir, { exts, skipDirs = [] }) {
  const abs = path.join(ROOT, dir);
  if (!existsSync(abs)) return [];
  const out = [];
  for (const e of readdirSync(abs, { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) {
      if (!skipDirs.includes(rel)) out.push(...walk(rel, { exts, skipDirs }));
    } else if (exts.some((x) => e.name.endsWith(x))) out.push(rel);
  }
  return out;
}
const read = (f) => readFileSync(path.join(ROOT, f), 'utf8');

// Un fichier de src/ qu'aucune route n'atteint ne s'affiche à personne : AVERT, pas ÉCHEC.
// Points d'entrée : fichiers spéciaux du routeur Next (page, layout, route, manifest, sitemap…).
const ENTRY_NAMES = new Set(['page', 'layout', 'route', 'loading', 'error', 'global-error', 'not-found', 'template', 'default', 'manifest', 'sitemap', 'robots', 'opengraph-image', 'twitter-image', 'icon', 'apple-icon', 'middleware', 'instrumentation']);
const CODE_EXTS = ['.ts', '.tsx', '.js', '.mjs'];
const isEntry = (f) => (f.startsWith('src/app/') || /^src\/(?:middleware|instrumentation)\./.test(f)) && ENTRY_NAMES.has(path.posix.basename(f).replace(/\.[^.]+$/, ''));

/** Fichiers atteignables depuis les points d'entrée, par les import / export from / import() / require. */
function reachable(files, sourceOf, existsFn) {
  const fileSet = new Set(files);
  const resolve = (spec, from) => {
    let base;
    if (spec.startsWith('@/')) base = `src/${spec.slice(2)}`;
    else if (spec.startsWith('.')) base = path.posix.normalize(path.posix.join(path.posix.dirname(from), spec));
    else return null;
    for (const c of [base, ...CODE_EXTS.map((x) => base + x), ...CODE_EXTS.map((x) => `${base}/index${x}`)]) {
      if (fileSet.has(c) && existsFn(c)) return c;
    }
    return null;
  };
  const importsOf = (f) => {
    const sf = ts.createSourceFile(f, sourceOf(f), ts.ScriptTarget.Latest, true, scriptKindOf(f));
    const specs = [];
    const visit = (n) => {
      if ((ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) && n.moduleSpecifier && ts.isStringLiteral(n.moduleSpecifier)) specs.push(n.moduleSpecifier.text);
      else if (ts.isCallExpression(n) && n.arguments.length === 1 && ts.isStringLiteral(n.arguments[0]) && (n.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(n.expression) && n.expression.text === 'require'))) specs.push(n.arguments[0].text);
      ts.forEachChild(n, visit);
    };
    visit(sf);
    return specs;
  };
  const seen = new Set(files.filter(isEntry));
  const queue = [...seen];
  while (queue.length) {
    const f = queue.pop();
    for (const spec of importsOf(f)) {
      const r = resolve(spec, f);
      if (r && !seen.has(r)) {
        seen.add(r);
        queue.push(r);
      }
    }
  }
  return seen;
}

// ---------------------------------------------------------------------------
// Exécution
// ---------------------------------------------------------------------------
function printWarnings(label, list, { cap = 12 } = {}) {
  const shown = SHOW_ALL ? list : list.slice(0, cap);
  warnings += list.length; // le total, pas seulement les lignes affichées
  for (const f of shown) process.stdout.write(`  AVERT ${describe(f)}
`);
  if (list.length > shown.length) process.stdout.write(`        … ${list.length - shown.length} autre(s) AVERT ${label} (node scripts/qa-claims.mjs --all pour tout lister)\n`);
}

process.stdout.write(`Motifs : ${PATTERNS.length} (${['sante', 'faux', 'absolu'].map((k) => `${k} ${PATTERNS.filter((p) => p.cls === k).length}`).join(', ')})\n`);

// 1. Exceptions bien formées
{
  const problems = exceptionProblems(EXCEPTIONS);
  if (problems.length) problems.forEach((p) => fail(`EXCEPTIONS : ${p}`));
  else ok(`exceptions : ${EXCEPTIONS.length} déclarée(s), toutes datées et motivées`);
}

// 2. Pages, métadonnées, JSON-LD, dictionnaires : échec
const PUBLIC_SKIP = ['public/blog', 'public/en/blog', 'public/js', 'public/images', 'public/data', 'public/css'];
const publicFiles = walk('public', { exts: ['.html', '.txt', '.xml', '.webmanifest'], skipDirs: PUBLIC_SKIP });
const blogIndexes = ['public/blog/index.html', 'public/en/blog/index.html'].filter((f) => existsSync(path.join(ROOT, f)));
const srcFiles = ['src/app', 'src/components', 'src/lib', 'src/types'].flatMap((d) => walk(d, { exts: CODE_EXTS }));
const enProductTemplates = walk('scripts/en-products', { exts: ['.mjs'] });

const live = reachable(srcFiles, read, (f) => existsSync(path.join(ROOT, f)));
const deadSrc = srcFiles.filter((f) => !live.has(f));
const liveSrc = srcFiles.filter((f) => live.has(f));

const failScopes = [
  { name: 'public/ hors blog et hors public/js (pages EN, fiches EN générées)', files: publicFiles },
  { name: 'index du blog FR et EN', files: blogIndexes },
  { name: 'src/ atteignable (app, components, lib, types)', files: liveSrc },
  { name: 'scripts/en-products (gabarits des fiches EN)', files: enProductTemplates },
];
const failFindings = [];
for (const scope of failScopes) for (const f of scope.files) failFindings.push(...scanFile(f, read(f), { severity: 'fail' }));

const { kept: failKept, unused } = applyExceptions(failFindings, EXCEPTIONS);
unused.forEach((e) => fail(`exception inutilisée (${e.file} : « ${e.contains} », ${e.date}) : le texte a changé ou a été corrigé, la retirer`));
for (const f of failKept) fail(describe(f));
if (failKept.length === 0) for (const scope of failScopes) ok(`${scope.name} : ${scope.files.length} fichiers lus, aucune allégation ni claim faux`);
else {
  process.stdout.write(
    "\n  Correction : l'indice RCS se dit avec ses seuils d'alerte, un champ absent se dit « non publié », rien n'est promis sur le bras.\n" +
      '    Un cas légitime (libellé de choix du visiteur, citation datée) va dans EXCEPTIONS, avec sa date et son motif.\n\n',
  );
}

// 3. AVERT : articles (pigiste, rédacteur), moteur statique (tsa-core), code que rien n'atteint
{
  const blog = walk('public/blog', { exts: ['.html'] }).concat(walk('public/en/blog', { exts: ['.html'] })).filter((f) => !blogIndexes.includes(f));
  const found = blog.flatMap((f) => scanFile(f, read(f), { severity: 'warn' }));
  if (found.length === 0) ok(`articles du blog : ${blog.length} pages lues, aucun motif`);
  else {
    printWarnings('articles du blog', found);
    process.stdout.write(`        (articles : ${blog.length} pages lues, ${found.length} motif(s) signalé(s) à tsa-pigiste / tsa-redacteur, jamais bloquants)\n`);
  }
  const jsFiles = walk('public/js', { exts: ['.js'] });
  const jsFound = jsFiles.flatMap((f) => scanFile(f, read(f), { severity: JS_SEVERITY }));
  if (jsFound.length === 0) ok(`public/js : ${jsFiles.length} scripts lus, aucun motif`);
  else if (JS_SEVERITY === 'fail') jsFound.forEach((f) => fail(describe(f)));
  else {
    printWarnings('public/js', jsFound);
    process.stdout.write(`        (public/js : ${jsFiles.length} scripts lus, ${jsFound.length} motif(s) dans le moteur RCS statique, périmètre tsa-core ; JS_SEVERITY = 'fail' dès la fusion de sa PR)\n`);
  }
  const deadFound = deadSrc.flatMap((f) => scanFile(f, read(f), { severity: 'warn' }));
  if (deadFound.length === 0) ok(`code non atteint : ${deadSrc.length} fichier(s) de src/ sans route, aucun motif`);
  else {
    printWarnings('code non atteint', deadFound);
    process.stdout.write(`        (${deadSrc.length} fichier(s) de src/ qu'aucune route n'atteint — composants sans import : rien ne s'affiche, à retirer ou à corriger avant de les brancher)\n`);
  }
}

// ---------------------------------------------------------------------------
// 4. Tests négatifs permanents : chaque garde-fou est éprouvé sur une altération qui DOIT échouer
//    et sur un témoin qui DOIT passer. Un garde-fou muet échoue.
// ---------------------------------------------------------------------------
{
  const before = failures;
  const page = (head, body) => `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n${head}\n<title>Test</title>\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
  const html = (head, body, opts = {}) => scanHtml(page(head, body), { file: 'public/en/test.html', ...opts });
  const code = (src, file = 'src/app/x/page.tsx', opts = {}) => scanCode(src, { file, ...opts });
  const tsx = (body) => `export default function P() { return (${body}); }\n`;
  const meta = (content) => `<meta name="description" content="${content}">`;
  const ld = (json) => `<script type="application/ld+json">${typeof json === 'string' ? json : JSON.stringify(json)}</script>`;
  const fails = (f) => f.some((x) => x.severity === 'fail');
  const clean = (f) => f.length === 0;

  const cases = [];
  const add = (name, run, expected) => cases.push([name, run, expected]);

  // -- Textes fautifs relevés le 11/10/2026 (HTML, corps) : DOIVENT échouer ------------------------
  const BAD_BODY = [
    // allégations de santé
    ['carte du blog EN : « prevent or relieve tennis elbow »', 'How to choose your strings and tension to prevent or relieve tennis elbow.', 'sante'],
    ['« prevent injuries »', 'optimize your tennis setup and prevent injuries.', 'sante'],
    ['« protect your joints »', 'receive personalized recommendations to protect your joints.', 'sante'],
    ['« protects the arm »', 'Soft string that protects the arm and adds power.', 'sante'],
    ['« excellent for protecting the arm »', 'Very comfortable string, excellent for protecting the arm.', 'sante'],
    ['« Ideal if you are protecting your arm »', 'Very comfortable setup. Ideal if you are protecting your arm.', 'sante'],
    ['« forgiving on the joints »', 'Comfortable setup, forgiving on the joints.', 'sante'],
    ['« ideal for sensitive arms » (FAQ, score 0-30)', 'Low score (0-30): Maximum comfort, ideal for sensitive arms', 'sante'],
    ['« gentler on the arm »', 'Polyesters offer control and spin but less comfort. Multifilaments are gentler on the arm.', 'sante'],
    ['« ideal for starting out without strain »', 'Flexible, comfortable racquet, ideal for starting out without strain.', 'sante'],
    ['« arm-friendly »', 'seventeen arm-friendly and arm-hostile strings', 'sante'],
    ['« Maximum arm protection »', 'Therapeutic setup: maximum arm protection', 'sante'],
    ['« absorbs vibrations »', 'Comfortable racquet that absorbs vibrations well.', 'sante'],
    ['« fewer vibrations »', 'Low tension for more comfort and fewer vibrations.', 'sante'],
    ['« without risk of aggravation »', 'Perfectly suited, without risk of aggravation', 'sante'],
    ['« Post-injury rehabilitation »', 'Ultra Comfort+ - Post-injury rehabilitation', 'sante'],
    ['« sans danger »', 'Un montage sans danger pour votre coude', 'sante'],
    ['« idéal pour le coude »', 'Un cordage idéal pour le coude', 'sante'],
    ['« soulager le tennis elbow »', 'Comment soulager le tennis elbow avec le bon cordage', 'sante'],
    ['« prévenir ou soulager »', 'pour prévenir ou soulager le tennis elbow', 'sante'],
    ['« préserver votre bras »', 'Un score de confort objectif pour anticiper la sensation de jeu et préserver votre bras.', 'sante'],
    ['« doux pour le bras »', 'Plus il est bas, plus le montage est doux pour le bras.', 'sante'],
    ['« Évite les montages trop rigides »', 'Évite les montages trop rigides (risque de tennis elbow)', 'sante'],
    ['« Avoid overly stiff setups »', 'Avoid overly stiff setups (tennis elbow risk)', 'sante'],
    ['« ménager le bras »', 'tout en ménageant le bras', 'sante'],
    ['« adaptés à votre sensibilité au bras »', 'Trouvez le cordage et la tension adaptés à votre raquette, votre jeu et votre sensibilité au bras.', 'sante'],
    ['« contre le tennis elbow »', 'Le cordage contre le tennis elbow', 'sante'],
    ['« prévient les blessures »', 'Ce montage prévient les blessures du coude', 'sante'],
    ['« soigne l’épicondylite » (élision)', 'Ce cordage soigne l’épicondylite', 'sante'],
    // claims faux
    ['« Base de données complète »', 'Base de données complète', 'faux'],
    ['« Complete database »', 'Complete database', 'faux'],
    ['« Specs vérifiées et tenues à jour »', 'Specs vérifiées et tenues à jour pour les modèles vendus aujourd’hui.', 'faux'],
    ['« Verified, up-to-date specs »', 'Verified, up-to-date specs for the models sold today.', 'faux'],
    ['« recommandations IA personnalisées »', 'comparateur, recommandations IA personnalisées et base', 'faux'],
    ['tuile « AI Recommendations »', '<h3>AI Recommendations</h3>', 'faux'],
    ['« Our AI analyzes »', 'Our AI analyzes thousands of equipment combinations', 'faux'],
    ['« score de confort objectif »', 'pour calculer un score de confort objectif (RCS)', 'faux'],
    ['« Compare objectivement »', 'Compare objectivement plusieurs configurations', 'faux'],
    ['« Objectively compare »', 'Objectively compare several configurations', 'faux'],
    ['« Join thousands of players »', 'Join thousands of players who found their perfect setup.', 'faux'],
    ['« Join hundreds of players … improved their playing comfort »', 'Join hundreds of players who have improved their playing comfort with Tennis String Advisor.', 'faux'],
    ['« des milliers de joueurs »', 'Rejoignez des milliers de joueurs', 'faux'],
    ['« RCS … from 0 to 100 »', 'The RCS (Recommendation Comfort Score) is an indicator from 0 to 100', 'faux'],
    ['« The RCS score (0-100) »', 'The RCS score (0-100) evaluates the stress on your joints', 'faux'],
    ['« joint stress »', 'Evaluate the joint stress of your setup.', 'faux'],
    ['« joint comfort score »', 'Calculate your joint comfort score (RCS)', 'faux'],
    ['légende « 0 - Maximum Comfort »', '<span>0 - Maximum Comfort</span>', 'faux'],
    // absolus
    ['« parfaits pour votre style de jeu »', 'Trouvez le cordage et la raquette de tennis parfaits pour votre style de jeu.', 'absolu'],
    ['« le cordage parfait pour votre style »', 'Trouvez le cordage parfait pour votre style de jeu.', 'absolu'],
    ['« montage idéal »', 'Prêt à trouver votre montage idéal ?', 'absolu'],
    ['« guide you to the ideal setup »', 'and guide you to the ideal setup.', 'absolu'],
    ['« Find your perfect tennis setup »', 'Find your perfect tennis setup.', 'absolu'],
    ['« Find the perfect racquet for your game »', 'Find the perfect racquet for your game.', 'absolu'],
    ['« Find the perfect equipment for your playing style »', 'Find the perfect equipment for your playing style.', 'absolu'],
    ['« confort adapté à la majorité des joueurs »', 'contrôle élevé avec un confort adapté à la majorité des joueurs.', 'absolu'],
    ['« comfort suited to the majority of players »', 'high control with comfort suited to the majority of players.', 'absolu'],
    ['« RCS Optimal »', 'RCS Optimal: 20-25 (Confortable)', 'absolu'],
    ['« Optimal configuration for »', 'Optimal configuration for club players', 'absolu'],
  ];
  for (const [name, text, cls] of BAD_BODY) {
    add(`HTML corps : ${name}`, () => html('', `<p>${text}</p>`), 'echec');
    add(`classe ${cls} : ${name}`, () => html('', `<p>${text}</p>`), `classe:${cls}`);
  }

  // -- Mêmes textes dans les autres emplacements lus : DOIVENT échouer ---------------------------
  const SAMPLE = 'Find your perfect tennis setup. Evaluate the joint stress of your setup. Soft string that protects the arm.';
  add('meta description', () => html(meta('Calculate your score and prevent injuries.'), ''), 'echec');
  add('og:description', () => html('<meta property="og:description" content="Find your perfect tennis setup.">', ''), 'echec');
  add('twitter:description', () => html('<meta name="twitter:description" content="Trouvez le cordage parfait pour votre style de jeu.">', ''), 'echec');
  add('attribut alt', () => html('', '<img src="a.png" alt="A perfect racquet for your game">'), 'echec');
  add('placeholder', () => html('', '<input placeholder="Ideal for sensitive arms">'), 'echec');
  add('JSON-LD : description', () => html(ld({ '@type': 'WebApplication', description: 'Expert configurator to find your ideal setup' }), ''), 'echec');
  add('JSON-LD : réponse de FAQ', () => html(ld({ '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: 'q', acceptedAnswer: { '@type': 'Answer', text: 'It evaluates the joint stress of your setup.' } }] }), ''), 'echec');
  add('JSON-LD illisible (textes non vérifiables)', () => html(ld('{"@type":"FAQPage",'), ''), 'echec');
  add('script en ligne : chaîne', () => html('', `<script>advice = 'Very comfortable setup. Ideal if you are protecting your arm.';</script>`), 'echec');
  add('script en ligne : gabarit', () => html('', '<script>const t = `Optimal configuration for ${x}`;</script>'), 'echec');
  add('balises coupant la phrase (« Find Your <span>Perfect</span> Racquet »)', () => html('', '<h1>Find Your <span class="y">Perfect</span> <span>Racquet & String Setup</span></h1>'), 'echec');
  add('balises en majuscules', () => html('<META NAME="description" CONTENT="Find the perfect equipment for your style">', ''), 'echec');
  add('espace insécable dans « montage idéal »', () => html('', `<p>votre montage${NBSP}idéal</p>`), 'echec');
  add('apostrophe typographique (« l’épicondylite »)', () => html('', '<p>Il soulage l’épicondylite</p>'), 'echec');
  add('texte sur deux lignes', () => html('', '<p>Find your\n   perfect\n tennis setup</p>'), 'echec');

  // -- Code (TS, TSX, dictionnaire, metadata, JSON-LD en TS) : DOIVENT échouer --------------------
  add('bloc metadata', () => code("export const metadata = { description: 'Trouvez le cordage parfait pour votre style de jeu.' };\n", 'src/app/layout.tsx'), 'echec');
  add('dictionnaire', () => code("export const d = { fr: { 'home.finalCta.title': 'Prêt à trouver votre montage idéal ?' } };\n", 'src/lib/i18n/dictionaries.ts'), 'echec');
  add('texte JSX', () => code(tsx('<p>Un cordage doux pour le bras</p>')), 'echec');
  add('texte JSX imbriqué', () => code(tsx('<p>Un montage <strong>idéal</strong> pour le coude</p>')), 'echec');
  add('chaîne dans une expression JSX', () => code(tsx("<p>{'RCS Optimal: 20-25'}</p>")), 'echec');
  add('attribut JSX', () => code(tsx('<Card description="Base de données complète" />')), 'echec');
  add('JSON-LD en TS', () => code("const jsonLd = { description: 'Specs vérifiées et tenues à jour' };\n"), 'echec');
  add('gabarit TS', () => code('export const m = { description: `${n} cordages : recommandations IA personnalisées` };\n'), 'echec');
  add('gabarit de fiche EN (scripts/en-products)', () => code("const t = (p) => `<p>${p.name}: perfect racquet for your game</p>`;\n", 'scripts/en-products/x.mjs'), 'echec');
  add('JSX : « RCS Optimal » dans deux éléments voisins', () => code(tsx('<div><span>RCS Optimal:</span><span>20-25</span></div>')), 'echec');

  // -- Avertissements légitimes et phrases honnêtes : DOIVENT passer ------------------------------
  const GOOD = [
    'Très ferme (indice 38) : risque de tennis elbow',
    'Très ferme, risque de tennis elbow au-delà de l’indice 35',
    'Alerte bras dès 32 pour un bras sensible, dès 35 sinon',
    'Prudence au-delà de 32, risque à partir de 35',
    'Very firm setup (index 38): tennis elbow risk',
    'Consultez un professionnel de santé si la douleur persiste.',
    'No. The RCS score is a decision-support tool based on technical data. It does not replace medical advice. In case of pain or injury (tennis elbow, etc.), consult a healthcare professional.',
    'Plus l’indice est bas, plus le montage est souple ; plus il est haut, plus il est ferme.',
    'The lower the index, the softer the setup.',
    'Signale les montages trop rigides (risque de tennis elbow)',
    'Flags overly stiff setups (tennis elbow risk)',
    'Compare plusieurs configurations avec le même indice.',
    'L’alerte vous prévient si votre bras risque d’être sollicité par un montage trop ferme.',
    'Fiches de caractéristiques : une donnée que le fabricant ne publie pas est affichée « Non publié », jamais comblée.',
    'Specifications are shown as published; a field the maker does not publish reads « Not published ».',
    'Tennis elbow / Arm pain',
    'Shoulder pain',
    'Sensitive arm',
    'Ideal for hard court matches in summer... (exemple de note)',
    'Un montage souple : 20 à 25, palier « Confortable ».',
    'RCS : indice de fermeté de 11 à 41 ; palier « Confortable » de 20 à 25.',
    'Le configurateur calcule l’indice RCS de votre montage (raquette, cordage, tension).',
    'Premium : configurations illimitées, analyse RCS avancée et export PDF.',
    'Catalogue de plus de 120 raquettes et de plus de 170 cordages.',
    'A softer setup reduces the load your arm receives at impact.',
    'Une douleur au coude qui persiste relève d’un avis médical.',
  ];
  for (const g of GOOD) {
    add(`témoin HTML : ${g.slice(0, 60)}`, () => html('', `<p>${g}</p>`), 'propre');
    add(`témoin meta : ${g.slice(0, 60)}`, () => html(meta(g.replace(/"/g, '&quot;')), ''), 'propre');
  }
  add('témoin : e.preventDefault() (script en ligne)', () => html('', '<script>form.addEventListener("submit", function (e) { e.preventDefault(); /* prevent injuries */ });</script>'), 'propre');
  add('témoin : commentaire HTML', () => html('', '<!-- Find your perfect setup, prevent injuries -->'), 'propre');
  add('témoin : style en ligne', () => html('', '<style>.a::after{content:"perfect setup"}</style>'), 'propre');
  add('témoin : classe CSS et identifiant', () => html('', '<div class="perfect-setup" id="ideal-for-sensitive-arms"></div>'), 'propre');
  add('témoin : URL perfect-tennis.com dans le JSON-LD', () => html(ld({ '@type': 'Article', sameAs: ['https://www.perfect-tennis.com/roger-federers-racquet/'] }), ''), 'propre');
  add('témoin : « 0 à 100 » hors contexte RCS', () => html('', '<p>Un pourcentage de 0 à 100 sur une barre de chargement.</p>'), 'propre');
  add('témoin : commentaire de code', () => code('// Le site disait « Base de données complète » : faux (RA absent de 29 fiches).\n/** parfait pour votre style de jeu */\nexport const a = 1;\n'), 'propre');
  add('témoin : code (identifiants, clés)', () => code("export const level = { optimal: 1, 'trop_rigide': 2 }; const idealFor = 'x';\n"), 'propre');
  add('témoin : texte JSX honnête', () => code(tsx('<p>Plus l’indice est bas, plus le montage est souple.</p>')), 'propre');
  add('témoin : texte JSX avec expression', () => code(tsx('<p>{count} cordages, dont {n} sans note : « Non publié ».</p>')), 'propre');

  // -- Sévérités : un article ou le moteur statique donne des AVERT, jamais un échec ---------------
  add('blog : allégation = AVERT, pas échec', () => html('', '<p>Un cordage idéal pour le coude</p>', { severity: 'warn' }), 'avert');
  add('blog : JSON-LD fautif = AVERT', () => html(ld({ '@type': 'FAQPage', mainEntity: [{ name: 'q', acceptedAnswer: { text: 'tout en ménageant le bras' } }] }), '', { severity: 'warn' }), 'avert');
  add('moteur statique (JS) : allégation = AVERT', () => code("const t = 'Therapeutic setup: maximum arm protection';\n", 'public/js/x.js', { severity: 'warn' }), 'avert');
  add('code non atteint : allégation = AVERT', () => code(tsx('<p>Our AI analyzes thousands of combinations</p>'), 'src/components/sections/how-it-works.tsx', { severity: 'warn' }), 'avert');
  add('blog : JSON-LD illisible = AVERT', () => html(ld('{"@type":"FAQPage",'), '', { severity: 'warn' }), 'avert');
  add('blog : phrase honnête = rien', () => html('', '<p>Alerte bras dès 32 pour un bras sensible.</p>', { severity: 'warn' }), 'propre');

  // Exécution des cas
  let nFail = 0;
  let nClean = 0;
  let nWarn = 0;
  for (const [name, run, expected] of cases) {
    let found;
    try {
      found = run();
    } catch (e) {
      fail(`test négatif « ${name} » inexécutable : ${e.message}`);
      continue;
    }
    if (expected === 'echec') {
      nFail++;
      if (!fails(found)) fail(`test négatif : garde-fou muet sur « ${name} » (échec attendu, ${found.length} constat(s))`);
    } else if (expected === 'propre') {
      nClean++;
      if (!clean(found)) fail(`témoin positif refusé : « ${name} » → ${found.map(describe).join(' ; ')}`);
    } else if (expected.startsWith('classe:')) {
      nFail++;
      if (!found.some((f) => f.severity === 'fail' && f.cls === expected.slice(7))) fail(`test négatif : « ${name} » doit être classé « ${expected.slice(7)} » (${found.map((f) => f.cls).join(', ') || 'aucun constat'})`);
    } else if (expected === 'avert') {
      nWarn++;
      if (found.length === 0 || found.some((f) => f.severity !== 'warn')) fail(`test négatif (sévérité) : « ${name} » doit donner des AVERT et aucun échec (${found.length} constat(s))`);
    }
  }

  // Numéros de ligne : le constat pointe la bonne ligne
  {
    const f = scanHtml('<html>\n<head>\n</head>\n<body>\n<p>ok</p>\n<p>Find your perfect tennis setup</p>\n</body>\n</html>\n', { file: 'x.html' });
    if (!(f.length >= 1 && f[0].line === 6)) fail(`numéro de ligne (HTML) : 6 attendu, ${f[0]?.line ?? 'aucun constat'} obtenu`);
    const g = scanCode("const a = 1;\n\nexport const m = {\n  description: 'Base de données complète',\n};\n", { file: 'x.ts' });
    if (!(g.length === 1 && g[0].line === 4)) fail(`numéro de ligne (code) : 4 attendu, ${g[0]?.line ?? 'aucun constat'} obtenu`);
    const jsx = scanCode('export default function P() {\n  return (\n    <div>\n      <p>\n        Un cordage doux pour le bras\n      </p>\n    </div>\n  );\n}\n', { file: 'x.tsx' });
    if (!(jsx.length === 1 && jsx[0].line === 5)) fail(`numéro de ligne (JSX) : 5 attendu, ${jsx[0]?.line ?? 'aucun constat'} obtenu`);
    const j = scanHtml('<head>\n<script type="application/ld+json">\n{\n "a": "ok",\n "description": "Find your perfect tennis setup"\n}\n</script>\n</head>\n', { file: 'x.html' });
    if (!(j.length === 1 && j[0].line === 5)) fail(`numéro de ligne (JSON-LD) : 5 attendu, ${j[0]?.line ?? 'aucun constat'} obtenu`);
  }

  // Code que rien n'atteint : le calcul d'atteignabilité
  {
    const sources = {
      'src/app/page.tsx': "import { A } from '@/components/a';\nexport default () => A;\n",
      'src/components/a.tsx': "import { B } from './b';\nexport const A = B;\n",
      'src/components/b.ts': 'export const B = 1;\n',
      'src/components/dead.tsx': "export const D = 'Our AI analyzes';\n",
      'src/components/dead-user.tsx': "import { D } from './dead';\nexport const U = D;\n",
      'src/components/lazy.tsx': 'export const L = 1;\n',
      'src/app/layout.tsx': "export default async () => { const m = await import('@/components/lazy'); return m; };\n",
    };
    const files = Object.keys(sources);
    const live = reachable(files, (f) => sources[f], (f) => f in sources);
    const expectLive = ['src/app/page.tsx', 'src/components/a.tsx', 'src/components/b.ts', 'src/components/lazy.tsx'];
    const expectDead = ['src/components/dead.tsx', 'src/components/dead-user.tsx'];
    for (const f of expectLive) if (!live.has(f)) fail(`atteignabilité : ${f} devrait être atteint`);
    for (const f of expectDead) if (live.has(f)) fail(`atteignabilité : ${f} ne devrait pas être atteint (un fichier mort qui importe un autre ne le rend pas vivant)`);
  }

  // Exceptions : une exception valide retire le constat, une inutilisée échoue, une mal formée est refusée
  {
    const fk = html('', '<p>Ultra Comfort+ - Post-injury rehabilitation</p>');
    const good = [{ file: 'public/en/test.html', contains: 'Post-injury rehabilitation', date: '2026-10-11', reason: 'libellé de profil choisi par le visiteur, pas une promesse' }];
    const r = applyExceptions(fk, good);
    if (!(r.kept.length === 0 && r.unused.length === 0)) fail('exception valide : le constat devrait être retiré et l’exception comptée comme utilisée');
    const other = applyExceptions(fk, [{ ...good[0], file: 'public/en/autre.html' }]);
    if (!(other.kept.length >= 1 && other.unused.length === 1)) fail('exception d’un autre fichier : ne doit rien retirer et doit être signalée inutilisée');
    if (applyExceptions([], good).unused.length !== 1) fail('exception sans constat : doit être signalée inutilisée');
    if (exceptionProblems(good).length !== 0) fail('exception valide refusée par la validation');
    if (exceptionProblems([{ ...good[0], reason: '' }]).length === 0) fail('exception sans motif acceptée');
    if (exceptionProblems([{ ...good[0], reason: 'trop court' }]).length === 0) fail('exception au motif d’une étiquette acceptée');
    if (exceptionProblems([{ ...good[0], date: '11/10/2026' }]).length === 0) fail('exception à la date mal formée acceptée');
    if (exceptionProblems([{ ...good[0], date: undefined }]).length === 0) fail('exception sans date acceptée');
    if (exceptionProblems([{ ...good[0], file: '' }]).length === 0) fail('exception sans fichier acceptée');
    // une exception ne couvre ni un AVERT, ni un autre texte du même fichier
    const mixed = applyExceptions([...fk, ...html('', '<p>Find your perfect tennis setup</p>')], good);
    if (mixed.kept.length < 1) fail('exception : ne doit couvrir que le texte nommé');
    const warnOnly = applyExceptions(html('', '<p>Post-injury rehabilitation</p>', { severity: 'warn' }), good);
    if (warnOnly.unused.length !== 1) fail('exception : ne doit pas couvrir un AVERT (elle serait comptée inutilisée)');
  }

  // Les classes sont toutes éprouvées
  for (const k of ['sante', 'faux', 'absolu']) {
    if (!BAD_BODY.some(([, , cls]) => cls === k)) fail(`classe « ${k} » sans test négatif`);
  }
  // Chaque motif est éprouvé : un motif que plus aucun test ne déclenche est muet
  {
    const all = BAD_BODY.map(([, text]) => text).join('\n') + '\n' + SAMPLE;
    const hit = new Set(claimsIn(all).map((c) => c.id));
    for (const p of PATTERNS) if (!hit.has(p.id)) fail(`motif « ${p.cls}/${p.id} » sans test négatif : aucun texte fautif ne le déclenche`);
  }

  if (failures === before) {
    ok(
      `tests négatifs : ${nFail} altérations détectées (santé, claims faux, absolus ; corps, meta, og, alt, JSON-LD, script, JSX, metadata, dictionnaire, gabarit), ` +
        `${nClean} témoins acceptés (avertissements de risque, indice et seuils, « Non publié », commentaires, classes CSS, URL), ` +
        `${nWarn} cas en AVERT seulement (blog, moteur statique, code non atteint) ; lignes, atteignabilité, motifs et exceptions éprouvés`,
    );
  }
}

process.stdout.write(`\n${failures === 0 ? 'Conforme' : 'NON CONFORME'} — ${failures} échec(s), ${warnings} avertissement(s)\n`);
process.exit(failures === 0 ? 0 : 1);
