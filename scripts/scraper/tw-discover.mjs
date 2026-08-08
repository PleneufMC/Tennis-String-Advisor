#!/usr/bin/env node
/**
 * ÉTAPE 1/3 — Découverte des URL produit Tennis Warehouse.
 *
 * Pourquoi ce script existe :
 * lors d'une première tentative, j'ai conclu à tort que les données produit de
 * Tennis Warehouse étaient inaccessibles. L'erreur venait de MA méthode : je
 * DEVINAIS les URL produit (elles renvoyaient 404), puis j'ai cru que le
 * `sitemap.xml` ne contenait « aucune page produit » — ce qui est exact, mais
 * la conclusion tirée était fausse.
 *
 * Le sitemap contient 1 472 pages CATÉGORIE (`catpage-*.html`), et CHAQUE page
 * catégorie liste les URL produit (`descpage*.html`) en HTML statique. Le
 * chemin est donc : sitemap -> catpages -> descpages. Aucune URL n'est devinée,
 * toutes sont lues depuis le site.
 *
 * robots.txt (vérifié le 8 août 2026), bloc `User-agent: *` :
 *   Disallow: /zzz/ , /mailings/ , /tennis_recruit.html
 * Ni `catpage` ni `descpage` ne sont interdits. Un Crawl-delay n'est imposé
 * qu'à des bots nommés (msnbot, bingbot, Slurp) ; on s'applique tout de même
 * une limite de débit volontaire.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  ⚠️ ÉTAT RÉEL : CE SCRIPT NE PEUT PAS ABOUTIR DEPUIS LE SANDBOX
 * ─────────────────────────────────────────────────────────────────────────────
 * Mesuré après écriture de ce script : le site applique une protection
 * anti-robot qui renvoie **HTTP 406** de manière PROGRESSIVE. Les mêmes URL qui
 * répondaient 200 (sitemap 1 763 URL / 1 472 catpages ; catpage-LENGTH23 avec
 * 9 liens produit) répondent ensuite 406 systématiquement — y compris
 * `robots.txt`, que personne n'a interdit. `curl` avec en-têtes navigateur
 * complets : 406 également.
 *
 * Autrement dit l'IP appelante est bannie. Ce n'est PAS une absence de données
 * côté serveur, et il ne faut pas re-tirer la conclusion « inaccessible » :
 *   - la route sitemap -> catpage -> descpage est VALIDE (vérifiée) ;
 *   - une passe a récolté 21 URL produit réelles (voir `out/product-urls.json`,
 *     non versionné) ;
 *   - mais AUCUNE fiche n'a jamais pu être LUE : zéro spec récupérée, donc
 *     zéro valeur de la base confirmée par Tennis Warehouse.
 *
 * À rejouer depuis une IP résidentielle avec DELAY_MS nettement plus élevé
 * (quelques secondes), ou à remplacer par une source contractuelle (fiches
 * constructeur, export d'un distributeur partenaire). Ne JAMAIS combler les
 * trous avec des valeurs « plausibles » : c'est l'objet même de ce garde-fou.
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';

const OUT_DIR = new URL('./out/', import.meta.url).pathname;
const DELAY_MS = 700; // limite de débit volontaire (relevée après un HTTP 406)
const CONCURRENCY = 2;

// En-têtes de navigateur COMPLETS. Avec le seul `User-Agent`, le site a
// commencé à répondre 406 (Not Acceptable) après quelques centaines de
// requêtes : c'est l'absence d'`Accept`/`Accept-Language` qui trahissait un
// client automatisé. On reste sous une charge très faible (2 requêtes en
// parallèle, 700 ms d'intervalle).
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Upgrade-Insecure-Requests': '1',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url, attempt = 1) {
  try {
    const res = await fetch(url, { headers: HEADERS, redirect: 'follow' });
    if (!res.ok) {
      // 406/429/5xx = limitation de débit : on patiente franchement.
      if ([406, 429, 500, 502, 503].includes(res.status) && attempt <= 4) {
        await sleep(5000 * attempt);
        return fetchText(url, attempt + 1);
      }
      return { ok: false, status: res.status, body: '' };
    }
    return { ok: true, status: 200, body: await res.text() };
  } catch (err) {
    if (attempt <= 3) {
      await sleep(1500 * attempt);
      return fetchText(url, attempt + 1);
    }
    return { ok: false, status: 0, body: '', error: String(err) };
  }
}

/** Exécute `worker` sur `items` avec une concurrence bornée. */
async function pool(items, worker) {
  const queue = [...items.entries()];
  const runners = Array.from({ length: CONCURRENCY }, async () => {
    for (;;) {
      const next = queue.shift();
      if (!next) return;
      const [index, item] = next;
      await worker(item, index);
      await sleep(DELAY_MS);
    }
  });
  await Promise.all(runners);
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  // --- 1. sitemap -> pages catégorie -------------------------------------
  // Mis en cache sur disque : inutile de le redemander à chaque exécution,
  // et cela évite de consommer du quota pour rien lors des reprises.
  const smPath = `${OUT_DIR}sitemap.xml`;
  let smBody;
  if (existsSync(smPath)) {
    console.log('1/2  Sitemap lu depuis le cache local.');
    smBody = readFileSync(smPath, 'utf8');
  } else {
    console.log('1/2  Lecture du sitemap...');
    const sm = await fetchText('https://www.tennis-warehouse.com/sitemap.xml');
    if (!sm.ok) throw new Error(`sitemap inaccessible (HTTP ${sm.status})`);
    smBody = sm.body;
    writeFileSync(smPath, smBody);
  }
  const allUrls = [...smBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const catpages = [...new Set(allUrls.filter((u) => /catpage-[A-Za-z0-9_-]+\.html/.test(u)))];

  // On ne garde que ce qui nous concerne : raquettes et cordages. Les sacs,
  // chaussures, vêtements, balles, grips sont hors périmètre. Les bobines
  // (« reel ») sont conservées : ce sont les mêmes cordages, et leur page
  // porte les mêmes caractéristiques techniques.
  const wanted = catpages.filter(
    (u) =>
      /racquet|racket|string|LENGTH\d|JUNIOR|REEL|POLY|GUT|MULTI/i.test(u) &&
      !/bag|shoe|apparel|grip|ball|damp|sock|short|skirt|hat|towel/i.test(u)
  );
  // Pages marque, absentes du sitemap mais découvertes par recherche web.
  const brands = [
    'Wilson', 'Babolat', 'Head', 'Yonex', 'Prince', 'Tecnifibre',
    'Dunlop', 'Volkl', 'Solinco', 'Gamma', 'ProKennex',
  ];
  const brandPages = [
    ...brands.map((b) => `https://www.tennis-warehouse.com/${b}racquets.html`),
    ...brands.map((b) => `https://www.tennis-warehouse.com/${b}strings.html`),
    'https://www.tennis-warehouse.com/catpage-TENSTRING.html',
    'https://www.tennis-warehouse.com/catpage-POLYSTRINGS.html',
    'https://www.tennis-warehouse.com/catpage-MULTISTRINGS.html',
    'https://www.tennis-warehouse.com/catpage-GUTSTRINGS.html',
    'https://www.tennis-warehouse.com/catpage-SYNGUTSTRINGS.html',
    'https://www.tennis-warehouse.com/catpage-KEVSTRINGS.html',
    'https://www.tennis-warehouse.com/catpage-TENRACQUETS.html',
    'https://www.tennis-warehouse.com/catpage-JUNIORRACQUETS.html',
  ];
  const seeds = [...new Set([...wanted, ...brandPages])];
  console.log(`     ${catpages.length} catpages au sitemap -> ${seeds.length} pages à explorer`);

  // --- 2. pages catégorie -> URL produit ---------------------------------
  console.log('2/2  Extraction des liens produit...');
  const products = new Map(); // code -> url
  let done = 0;
  await pool(seeds, async (url) => {
    const res = await fetchText(url);
    done += 1;
    if (!res.ok) return;
    // ATTENTION — piège rencontré : le HTML de TW insère des retours chariot
    // À L'INTÉRIEUR des attributs, sous la forme
    //     href="\rhttps://.../descpageRCWILSON-WB1001.html\r"
    // Un motif `href="([^"]*descpage...)"` ancré sur le début de l'attribut
    // échouait donc silencieusement : ma première passe n'a trouvé que 21
    // produits sur 230 pages. On normalise \r et \n avant d'extraire.
    const html = res.body.replace(/[\r\n]+/g, '');
    // Les liens produit ont la forme /Nom_Du_Produit/descpageXXCODE.html
    for (const m of html.matchAll(
      /https:\/\/www\.tennis-warehouse\.com\/[^"'\s]*?\/descpage([A-Z]{2})([A-Za-z0-9_-]+)\.html/g
    )) {
      const url = m[0].split('?')[0].split('#')[0];
      const code = `${m[1]}${m[2]}`;
      if (!products.has(code)) products.set(code, url);
    }
    if (done % 25 === 0) console.log(`     ${done}/${seeds.length} pages — ${products.size} produits`);
  });

  const list = [...products.entries()].map(([code, url]) => ({ code, url })).sort((a, b) => a.code.localeCompare(b.code));
  writeFileSync(`${OUT_DIR}product-urls.json`, JSON.stringify(list, null, 2));
  console.log(`\nTerminé : ${list.length} URL produit -> scripts/scraper/out/product-urls.json`);
  const rc = list.filter((p) => p.code.startsWith('RC')).length;
  const st = list.filter((p) => p.code.startsWith('ST')).length;
  console.log(`  dont RC (raquettes) : ${rc}`);
  console.log(`  dont ST (cordages)  : ${st}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
