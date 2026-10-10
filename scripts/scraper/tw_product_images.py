#!/usr/bin/env python3
"""
Photos produit Tennis Warehouse -> public/images/products/ (décision de Pierre, 29/09/2026).

Pierre a choisi, en connaissance du risque, d'habiller les pages matériel avec
les photos de Tennis Warehouse. Leurs conditions interdisent la reproduction
sans permission écrite ; une demande est en cours. Le dispositif est donc
purgeable en une opération (cf. src/lib/product-images.ts).

Principes
---------
* Aucune URL construite à la main : les pages produit et les URL d'image sont
  LUES sur les pages catégorie de TW (navigation), puis sur la page produit.
  Les pages de recherche sont interdites par robots.txt : on ne les appelle pas.
* L'association id -> produit TW est une décision humaine, consignée dans
  `product-images-mapping.json` (versionné). Le script ne fait que la vérifier :
  jauge et couleur (cordages), tamis et plan de cordage (raquettes). Tout
  désaccord envoie l'id en quarantaine, jamais en « meilleur effort ».
* Collecte modérée : une requête à la fois, >= 1,1 s d'intervalle,
  User-Agent honnête, cache disque (reprise possible), pas de boucle de retry
  agressive (une seule nouvelle tentative, 10 s plus tard).

Seconde source (09/10/2026) : Tennis Warehouse Europe
------------------------------------------------------
Même groupe (Sports Warehouse), même cadre de droits que la décision du 29/09 —
à confirmer par Pierre (site et conditions distincts). TWE vend des produits que
TW (US) ne vend pas (gammes européennes, générations précédentes encore en
stock) et publie une fiche PAR coloris et PAR jauge : l'association d'un cordage
à sa couleur y est directe. Découverte par le plan du site publié
(sitemapindex.xml -> sitemaps par marque), jamais par URL composée. Une décision
du mapping porte alors `"source": "tennis-warehouse-europe"`.

Troisième source (10/10/2026) : Tennis-Point (www.tennis-point.fr)
--------------------------------------------------------------------
Demande de Pierre. Boutique Shopify : robots.txt autorise /products/, plan du site
publié avec l'image principale de chaque produit. Tennis-Point ne publie ni la
rigidité RA ni, souvent, le millésime : la génération ne s'y vérifie que par le
millésime du nom ; tout doute = quarantaine. Débit 3 s par requête. Tout refus
(403/406/429, page anti-robot) lève AccessRefused et ARRÊTE la commande — le
10/10/2026, HTTP 429 après ~60 requêtes : collecte arrêtée, non reprise.

Quatrième famille (10/10/2026) : images OFFICIELLES des fabricants
-----------------------------------------------------------------
Décision de Pierre, verbatim : « Il n'y a aucune restriction à utiliser les images
officielles des raquettes. Jamais un fabricant ne s'opposera à la promotion des produits
de sa marque. » Prise en connaissance du risque (tolérance supposée, aucune licence
écrite ; les conditions d'utilisation de Wilson, Babolat, Tecnifibre et Yonex interdisent
la reproduction sans autorisation écrite : texte exact dans la description de la PR).
Source `fabricant:<marque>` (wilson, babolat, tecnifibre, yonex), logique propre à chaque site
dans `fabricants_images.py`. Collecte : robots.txt lu, >= 3 s entre requêtes, premier
403/406/429 ou page anti-robot = arrêt pour ce site et hôte consigné dans
`out/refused-hosts.json` (head.com : 429 dès robots.txt ; luxilon.com : 403 à la première
requête de la passe). Packshot seulement (pas de joueur : les emballages Yonex à portraits
sont écartés), image PUBLIÉE par la page (jamais modifiée), aplatie sur blanc et rognée.

Étapes
------
  python scripts/scraper/tw_product_images.py discover       # pages catégorie -> catalogue TW
  python scripts/scraper/tw_product_images.py discover-eu    # plan du site TWE -> catalogue TWE
  python scripts/scraper/tw_product_images.py candidates     # aide à la décision (lecture humaine)
  python scripts/scraper/tw_product_images.py candidates-eu  # idem TWE, pages lues et contrôles appliqués
  python scripts/scraper/tw_product_images.py discover-tp    # plan du site Tennis-Point -> catalogue TP
  python scripts/scraper/tw_product_images.py candidates-tp  # idem Tennis-Point (débit lent, arrêt au refus)
  python scripts/scraper/tw_product_images.py discover-fab <marque>            # catalogue officiel (navigation/plan du site)
  python scripts/scraper/tw_product_images.py candidates-fab <marque> [id | id=code]...   # pages candidates + contrôles
  python scripts/scraper/tw_product_images.py peek-fab <marque> <code>...      # planche-contact (contrôle visuel)
  python scripts/scraper/tw_product_images.py build          # pages produit, contrôles, images, manifeste
  python scripts/scraper/tw_product_images.py purge          # RETRAIT : supprime images et manifeste
  python scripts/scraper/tw_product_images.py purge tennis-warehouse-europe   # retrait d'une seule source
  python scripts/scraper/tw_product_images.py purge fabricant:wilson          # retrait des images d'une marque

Sorties : scripts/scraper/out/tw-images/ (non versionné),
          scripts/scraper/out/product-images-quarantaine.json,
          public/images/products/<racquets|strings>/<id>.webp,
          src/data/product-images.ts (généré).
"""
from __future__ import annotations

import html
import io
import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

sys.dont_write_bytecode = True  # pas de __pycache__ dans le dépôt
import fabricants_images as fab  # logique propre à chaque site fabricant (aucune connexion)

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'scripts' / 'scraper' / 'out'
CACHE = OUT / 'tw-images'
MAPPING = ROOT / 'scripts' / 'scraper' / 'product-images-mapping.json'
QUARANTINE = OUT / 'product-images-quarantaine.json'
MANIFEST_TS = ROOT / 'src' / 'data' / 'product-images.ts'
PUBLIC = ROOT / 'public' / 'images' / 'products'

BASE = 'https://www.tennis-warehouse.com'
BASE_EU = 'https://www.tenniswarehouse-europe.com'
CACHE_EU = CACHE / 'eu'
SOURCE_TW = 'tennis-warehouse'
SOURCE_EU = 'tennis-warehouse-europe'
SOURCES = (SOURCE_TW, SOURCE_EU, 'tennis-point')
CACHE_FAB = CACHE / 'fab'
# Sitemaps de marque TWE retenus (codes lus dans sitemapindex.xml) : marques du catalogue TSA.
EU_BRANDS = {'BABOLAT', 'WILSON', 'HEAD', 'YONEX', 'DUNLOP', 'PRINCE', 'TECNIFIBRE', 'VOLKL',
             'LUXILON', 'SOLINCO', 'GAMMA', 'GOSEN', 'ISOSPEED', 'KIRSCH', 'SIGNUMPRO', 'TOROLINE',
             'ASHAWAY'}
UA = 'TennisStringAdvisor-ImageCollector/1.0 (+https://tennisstringadvisor.org)'
MIN_INTERVAL_S = 1.1
MAX_WIDTH = 600
MAX_HEIGHT = 800  # raquettes en portrait : 800 px suffisent (affichage <= 320 px de haut)
WEBP_QUALITY = 72

# Pages catégorie lues dans le menu de navigation de TW (29/09/2026).
SEEDS = [
    # raquettes, par marque + juniors + fins de série
    '/Babolatracquets.html', '/Headracquets.html', '/Wilsonracquets.html',
    '/YonexRacquets.html', '/PrinceRacquets.html', '/Tecnifibreracquets.html',
    '/DunlopRacquets.html', '/VolklRacquets.html', '/JrRacquets.html',
    '/Clearance_Tennis_Racquets/catpage-LIQRACS.html',
    # cordages, par marque + hybrides
    '/BabolatString.html', '/Head_Tennis_String/catpage-HEADSTR.html',
    '/WilsonString.html', '/YonexString.html', '/LuxilonString.html',
    '/SolincoString.html', '/TecnifibreString.html', '/PrinceString.html',
    '/Volkl_Tennis_String/catpage-VOLKLSTR.html', '/GammaString.html',
    '/DiademString.html', '/GosenString.html', '/KirschbaumString.html',
    '/MSVString.html', '/SignumString.html', '/WeissString.html',
    '/ashawaystring.html', '/ISOSPEED_Tennis_String/catpage-ISOSPEEDSTR.html',
    '/Toroline_Tennis_Strings/catpage-TOROLSTR.html',
    '/Hybrid_Tennis_String/catpage-HYBRIDS.html',
]

_last_request = 0.0


class AccessRefused(SystemExit):
    """Refus du site (403/406/429, captcha) : arrêt immédiat, jamais de contournement."""


# Statuts qui signifient « le site refuse le robot » : on s'arrête, on ne réessaie pas.
REFUSAL_CODES = (403, 406, 429)
CAPTCHA_RE = re.compile(rb'captcha|cf-challenge|challenge-platform|Access denied', re.I)
ANTIBOT_TITLE_RE = re.compile(
    rb'<title>[^<]*(captcha|challenge|denied|checkpoint|just a moment|attention required|are you a robot|verify you)', re.I)

# Débit par hôte : TW/TWE 1,1 s (décision du 29/09) ; tout le reste >= 3 s (consigne du
# 10/10/2026) ; luxilon.com publie « Crawl-delay: 10 » dans son robots.txt.
TW_HOSTS = ('tennis-warehouse.com', 'tenniswarehouse-europe.com')
HOST_INTERVAL = {'www.luxilon.com': 10.0}
SLOW_INTERVAL_S = 3.0

# Hôtes qui ont refusé le robot (premier 403/406/429 ou page anti-robot) : plus aucune
# requête, d'aucune commande, tant que Pierre n'a pas retiré la ligne. Fichier non versionné.
REFUSED_HOSTS = OUT / 'refused-hosts.json'


def host_interval(host: str) -> float:
    if host in HOST_INTERVAL:
        return HOST_INTERVAL[host]
    return MIN_INTERVAL_S if host.endswith(TW_HOSTS) else SLOW_INTERVAL_S


def refused_hosts() -> dict:
    return json.loads(REFUSED_HOSTS.read_text(encoding='utf-8')) if REFUSED_HOSTS.exists() else {}


def mark_refused(host: str, code: int | str, note: str) -> None:
    data = refused_hosts()
    data[host] = {'code': code, 'date': date.today().isoformat(), 'note': note}
    REFUSED_HOSTS.parent.mkdir(parents=True, exist_ok=True)
    REFUSED_HOSTS.write_text(json.dumps(data, indent=1, ensure_ascii=False), encoding='utf-8')


def fetch(url: str, dest: Path, binary: bool = False) -> bytes | None:
    """GET poli, avec cache disque. Renvoie None si la ressource est indisponible.
    Un refus (403/406/429, page anti-robot) lève AccessRefused : la collecte s'arrête,
    et l'hôte est consigné dans refused-hosts.json (aucune requête ultérieure)."""
    global _last_request
    if dest.exists() and dest.stat().st_size > 0:
        return dest.read_bytes()
    host = urllib.parse.urlsplit(url).hostname or ''
    if host in refused_hosts():
        r = refused_hosts()[host]
        raise AccessRefused(f"ARRÊT : {host} a refusé le robot le {r['date']} (HTTP {r['code']}) — aucune requête")
    interval = host_interval(host)
    for attempt in (1, 2):
        wait = interval - (time.monotonic() - _last_request)
        if wait > 0:
            time.sleep(wait)
        _last_request = time.monotonic()
        req = urllib.request.Request(url, headers={
            'User-Agent': UA,
            'Accept': 'image/webp,image/*,*/*;q=0.8' if binary else 'text/html,*/*;q=0.8',
        })
        try:
            with urllib.request.urlopen(req, timeout=30) as res:
                body = res.read()
            if body[:2] == b'\x1f\x8b':  # certains serveurs compressent sans y être invités
                import gzip
                body = gzip.decompress(body)
            if not binary and ANTIBOT_TITLE_RE.search(body[:20000]):
                mark_refused(host, 'antibot', f'page de contrôle anti-robot sur {url}')
                raise AccessRefused(f'ARRÊT : page de contrôle anti-robot sur {url}')
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(body)
            return body
        except urllib.error.HTTPError as err:
            print(f'   HTTP {err.code} {url}')
            if err.code in REFUSAL_CODES:
                mark_refused(host, err.code, f'refus sur {url}')
                raise AccessRefused(f'ARRÊT : HTTP {err.code} sur {url} — le site refuse la collecte')
            if err.code in (404, 410) or attempt == 2:
                return None
        except AccessRefused:
            raise
        except Exception as err:  # réseau
            print(f'   erreur {err} {url}')
            if attempt == 2:
                return None
        time.sleep(10)
    return None


def slug(s: str) -> str:
    return re.sub(r'[^A-Za-z0-9]+', '_', s).strip('_')


# --------------------------------------------------------------------------
# 1. discover : pages catégorie -> catalogue TW
# --------------------------------------------------------------------------
CELL_RE = re.compile(
    r'<a href="(https://www\.tennis-warehouse\.com/[^"]+/descpage([A-Z]{2})([A-Za-z0-9_-]+)\.html)"'
    r' class="cattable-wrap-cell-imgwrap-inner[^"]*">\s*<img[^>]*srcset="([^"]+)"'
)
NAME_RE = re.compile(
    r'class="cattable-wrap-cell-info" href="([^"]+)">.*?cattable-wrap-cell-info-name">([^<]+)<'
)


def discover() -> None:
    products: dict[str, dict] = {}
    for path in SEEDS:
        url = BASE + path
        body = fetch(url, CACHE / 'catpages' / (slug(path) + '.html'))
        if body is None:
            print(f'!  catégorie indisponible : {url}')
            continue
        page = body.decode('utf-8', 'replace').replace('\r', '').replace('\n', '')
        names = {m.group(1): html.unescape(m.group(2)).strip() for m in NAME_RE.finditer(page)}
        n = 0
        for m in CELL_RE.finditer(page):
            purl, kind, code = m.group(1), m.group(2), m.group(3)
            srcset = [s.strip().split(' ')[0] for s in m.group(4).split(',')]
            # On retient, parmi les variantes PUBLIÉES dans le srcset, la plus
            # petite largeur >= 600 px (aucune URL n'est composée à la main).
            def width(u: str) -> int:
                w = re.search(r'[?&]nw=(\d+)', u)
                return int(w.group(1)) if w else 0
            eligible = sorted((u for u in srcset if width(u) >= MAX_WIDTH), key=width)
            thumb = html.unescape(eligible[0] if eligible else max(srcset, key=width))
            key = f'{kind}{code}'
            entry = products.setdefault(key, {
                'code': key, 'kind': 'racquet' if kind == 'RC' else 'string' if kind in ('ST', 'AC') else kind,
                'url': purl, 'name': names.get(purl, ''), 'thumb': thumb, 'categories': [],
            })
            entry['categories'].append(url)
            n += 1
        print(f'   {path}: {n} produits')
    items = sorted(products.values(), key=lambda p: p['code'])
    (CACHE / 'catalog.json').write_text(json.dumps(items, indent=1, ensure_ascii=False), encoding='utf-8')
    print(f'Catalogue TW : {len(items)} produits '
          f'({sum(p["kind"] == "racquet" for p in items)} raquettes, '
          f'{sum(p["kind"] == "string" for p in items)} cordages)')


# --------------------------------------------------------------------------
# 1 bis. discover-eu : plan du site TWE -> catalogue TWE
# --------------------------------------------------------------------------
EU_LOC_RE = re.compile(r'<loc>(https://www\.tenniswarehouse-europe\.com/([^/<]+)/descpage(RC|AC)([A-Za-z0-9_-]+)\.html)</loc>')
# Bobines (« Reel »), œillets et articles hors produit : jamais une photo de cordage ou de cadre.
EU_SKIP_RE = re.compile(r'\b(Reel|Grommets?|Bumper|Overgrips?|Grips?|Dampeners?|Bag)\b', re.I)


def eu_name(slug_part: str) -> str:
    """Intitulé lisible depuis le segment d'URL publié (« Yonex_Percept_100_Racket »)."""
    s = re.sub(r'_x([0-9A-F]{2})_', lambda m: chr(int(m.group(1), 16)), slug_part)
    return re.sub(r'\s+', ' ', s.replace('_', ' ')).strip()


def discover_eu() -> None:
    index = fetch(BASE_EU + '/sitemapindex.xml', CACHE_EU / 'sitemaps' / 'sitemapindex.xml')
    if index is None:
        raise SystemExit('sitemapindex TWE indisponible')
    products: dict[str, dict] = {}
    for loc in re.findall(r'<loc>([^<]+)</loc>', index.decode('utf-8', 'replace')):
        ccode = re.search(r'sitemap_brand_product\.xml\?ccode=([A-Z0-9]+)$', html.unescape(loc))
        if not ccode or ccode.group(1) not in EU_BRANDS:
            continue
        body = fetch(html.unescape(loc), CACHE_EU / 'sitemaps' / f'{ccode.group(1)}.xml')
        if body is None:
            print(f'!  sitemap indisponible : {loc}')
            continue
        n = 0
        for m in EU_LOC_RE.finditer(body.decode('utf-8', 'replace')):
            url, slug_part, kind, rest = m.groups()
            name = eu_name(slug_part)
            if EU_SKIP_RE.search(name):
                continue
            code = kind + rest
            products.setdefault(code, {'code': code, 'kind': 'racquet' if kind == 'RC' else 'string',
                                       'url': url, 'name': name, 'source': SOURCE_EU})
            n += 1
        print(f'   {ccode.group(1)} : {n} produits')
    items = sorted(products.values(), key=lambda p: p['code'])
    (CACHE_EU / 'catalog.json').write_text(json.dumps(items, indent=1, ensure_ascii=False), encoding='utf-8')
    print(f'Catalogue TWE : {len(items)} produits '
          f'({sum(p["kind"] == "racquet" for p in items)} raquettes, '
          f'{sum(p["kind"] == "string" for p in items)} cordages)')


def eu_image(page: str, code: str) -> str | None:
    """Photo principale d'une page produit TWE : `<code produit>-1.jpg`, variante
    publiée la plus petite >= 600 px (URL lues sur la page, jamais composées)."""
    pcode = code.split('-', 1)[1] if '-' in code else code
    urls = set(re.findall(r'https://img\.tenniswarehouse-europe\.com/watermark/rs\.php\?path='
                          + re.escape(pcode) + r'-1\.jpg(?:&amp;|&)nw=\d+', page))
    def width(u: str) -> int:
        return int(re.search(r'nw=(\d+)', u).group(1))
    urls = {html.unescape(u) for u in urls}
    if not urls:
        return None
    eligible = sorted((u for u in urls if width(u) >= MAX_WIDTH), key=width)
    return eligible[0] if eligible else max(urls, key=width)


# --------------------------------------------------------------------------
# 1 ter. discover-tp : plan du site Tennis-Point (FR) -> catalogue TP
# --------------------------------------------------------------------------
# Décision de Pierre du 10/10/2026 (« utilisez Tennis-Point pour compléter les
# photos »). Boutique Shopify : robots.txt autorise /products/ ; sitemaps produit
# publiés avec l'URL de l'image principale. Domaine .fr : catalogue et libellés
# français, comme le site ; c'est aussi le marchand des liens d'affiliation.
BASE_TP = 'https://www.tennis-point.fr'
CACHE_TP = CACHE / 'tp'
SOURCE_TP = 'tennis-point'
TP_KEEP_RE = re.compile(r'(raquette|cordage|garniture)', re.I)
TP_SKIP_RE = re.compile(r'(housse|sac|bag|padel|badminton|squash|bobine|reel|grip|antivibr|balle|'
                        r'chaussure|t-shirt|short|veste|machine|oeillet|protection|pickleball|beach)', re.I)


def discover_tp() -> None:
    index = fetch(BASE_TP + '/sitemap.xml', CACHE_TP / 'sitemaps' / 'sitemap.xml')
    if index is None:
        raise SystemExit('sitemap Tennis-Point indisponible')
    products: dict[str, dict] = {}
    locs = [html.unescape(x) for x in re.findall(r'<loc>([^<]+)</loc>', index.decode('utf-8', 'replace'))]
    for i, loc in enumerate(l for l in locs if '/sitemap_products_' in l):
        body = fetch(loc, CACHE_TP / 'sitemaps' / f'products_{i + 1}.xml')
        if body is None:
            print(f'!  sitemap indisponible : {loc}')
            continue
        n = 0
        for block in re.findall(r'<url>(.*?)</url>', body.decode('utf-8', 'replace'), re.S):
            m = re.search(r'<loc>(https://www\.tennis-point\.fr/products/([a-z0-9-]+))</loc>', block)
            img = re.search(r'<image:loc>([^<]+)</image:loc>', block)
            if not m or not img:
                continue
            url, handle = m.groups()
            if not TP_KEEP_RE.search(handle) or TP_SKIP_RE.search(handle):
                continue
            kind = 'racquet' if 'raquette' in handle else 'string'
            products[handle] = {'code': handle, 'kind': kind, 'url': url, 'name': handle.replace('-', ' '),
                                'thumb': html.unescape(img.group(1)), 'source': SOURCE_TP}
            n += 1
        print(f'   sitemap produits {i + 1} : {n} raquettes/cordages')
    items = sorted(products.values(), key=lambda p: p['code'])
    (CACHE_TP / 'catalog.json').write_text(json.dumps(items, indent=1, ensure_ascii=False), encoding='utf-8')
    print(f'Catalogue TP : {len(items)} produits '
          f'({sum(p["kind"] == "racquet" for p in items)} raquettes, '
          f'{sum(p["kind"] == "string" for p in items)} cordages)')


TP_COLOURS = {
    'noir': 'black', 'blanc': 'white', 'gris': 'gray', 'argent': 'silver', 'jaune': 'yellow',
    'rouge': 'red', 'bleu': 'blue', 'vert': 'green', 'orange': 'orange', 'rose': 'pink',
    'violet': 'purple', 'ecru': 'natural', 'écru': 'natural', 'naturel': 'natural', 'or': 'gold',
    'bronze': 'bronze', 'menthe': 'mint', 'anthracite': 'anthracite', 'lime': 'lime', 'lavande': 'lavender',
}


def tp_facts(page: str) -> dict:
    """Caractéristiques d'une page produit Tennis-Point (bloc « Caractéristiques »,
    sélecteur « Épaisseur »). Tennis-Point ne publie pas la rigidité RA."""
    body = re.sub(r'<script.*?</script>|<style.*?</style>', '', page, flags=re.S)
    text = html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', body)))
    facts: dict = {'_text': text}
    m = re.search(r'Taille de la tête (\d{3,4}) cm²', text)
    if m:
        facts['headSize'] = round(int(m.group(1)) / 6.4516, 1)
    m = re.search(r'Schéma de cordage (\d+)\s*/\s*(\d+)', text)
    if m:
        facts['stringPattern'] = f'{m.group(1)}x{m.group(2)}'
    m = re.search(r'Caractéristiques .{0,200}?Poids (\d{3}) g', text)
    if m:
        facts['weight'] = int(m.group(1))
    m = re.search(r'Type de raquette (non cordée|cordée)', text)
    if m:
        facts['strung'] = m.group(1) == 'cordée'
    m = re.search(r'Caractéristiques .{0,400}?Couleur ([a-zàâçéèêëîïôûù ,/-]{2,40}?) (?:Type|Avis|Description|Niveau)', text)
    if m:
        facts['colourFr'] = m.group(1).strip()
        facts['color'] = ' '.join(TP_COLOURS.get(w, w) for w in re.split(r'[ ,/-]+', facts['colourFr']) if w)
    facts['gaugesMm'] = sorted({g.replace(',', '.') for g in re.findall(r'Choisir (\d,\d{2})\b', text)})
    m = re.search(r'<h1[^>]*>(.*?)</h1>', page, re.S)
    if m:
        facts['title'] = html.unescape(re.sub(r'<[^>]+>|\s+', ' ', m.group(1))).strip()
    return facts


def tp_check(kind: str, item: dict, prod: dict, facts: dict) -> str | None:
    """Contrôles d'association Tennis-Point. Sans RA publiée, la génération ne se
    vérifie que par le millésime : un millésime de la fiche absent du produit TP,
    ou un millésime TP différent, part en quarantaine."""
    years_ours = set(re.findall(r'20[12]\d', f"{item.get('variant') or ''} {item['id']}"))
    years_tp = set(re.findall(r'20[12]\d', prod['code']))
    if years_tp and years_ours and not (years_tp & years_ours):
        return f"millésime TP {'/'.join(sorted(years_tp))} != fiche {'/'.join(sorted(years_ours))}"
    if years_ours and not years_tp:
        return f"millésime {'/'.join(sorted(years_ours))} de la fiche non mentionné chez TP"
    if kind == 'racquet':
        hs, sp, w = facts.get('headSize'), facts.get('stringPattern'), facts.get('weight')
        if hs is None or sp is None or w is None:
            return 'tamis, plan ou poids illisible sur la page TP : association non vérifiable'
        if abs(hs - float(item['headSize'])) > 0.6:
            return f"tamis TP {hs:g} in² != fiche {item['headSize']} in²"
        if item.get('stringPattern') and sp != item['stringPattern']:
            return f"plan de cordage TP {sp} != fiche {item['stringPattern']}"
        if facts.get('strung') is not False:
            return 'raquette cordée chez TP : poids non cordé non vérifiable'
        if item.get('weight') and abs(w - item['weight']) > 5:
            return f"poids non cordé TP {w} g != fiche {item['weight']} g"
        return None
    shown = facts.get('gaugesMm') or []
    if not shown:
        return 'jauge illisible sur la page TP : association non vérifiable'
    ours = {round(float(g), 2) for gs in item.get('gauges', []) for g in gs.split('/') if re.match(r'^\d\.\d+$', g)}
    if not all(round(float(g), 2) in ours for g in shown):
        return f"jauge TP {'/'.join(shown)} mm absente de la fiche ({', '.join(item.get('gauges', []))})"
    tp_colour, our_colour = facts.get('color') or '', item.get('color') or ''
    if not tp_colour:
        return 'couleur illisible sur la page TP : association non vérifiable'
    if not our_colour or not (color_tokens(tp_colour) & color_tokens(our_colour)):
        return f"couleur TP « {facts.get('colourFr')} » != fiche « {our_colour} »"
    return None


def tp_catalog() -> dict[str, dict]:
    path = CACHE_TP / 'catalog.json'
    return {p['code']: p for p in json.loads(path.read_text(encoding='utf-8'))} if path.exists() else {}


def eu_catalog() -> dict[str, dict]:
    path = CACHE_EU / 'catalog.json'
    return {p['code']: p for p in json.loads(path.read_text(encoding='utf-8'))} if path.exists() else {}


# --------------------------------------------------------------------------
# Base TSA (lue via tsx : les données vivent dans src/data/*.ts)
# --------------------------------------------------------------------------
def load_base() -> dict:
    code = (
        "import { racquetsDatabase } from './src/data/racquets-database';"
        "import { stringsDatabase } from './src/data/strings-database';"
        "console.log(JSON.stringify({ racquets: racquetsDatabase, strings: stringsDatabase }));"
    )
    tmp = ROOT / 'scripts' / 'scraper' / 'out' / '_base_dump.mts'
    tmp.parent.mkdir(parents=True, exist_ok=True)
    tmp.write_text(code.replace('./src', '../../../src'), encoding='utf-8')
    out = subprocess.run(['npx', '--yes', 'tsx', str(tmp)], cwd=ROOT, capture_output=True,
                         text=True, encoding='utf-8', shell=sys.platform == 'win32')
    if out.returncode != 0:
        raise SystemExit(out.stderr)
    return json.loads(out.stdout)


def norm(s: str) -> list[str]:
    s = s.lower().replace('ö', 'o').replace("'", '')
    return [t for t in re.split(r'[^a-z0-9.]+', s) if t]


def candidates() -> None:
    base = load_base()
    catalog = json.loads((CACHE / 'catalog.json').read_text(encoding='utf-8'))
    report = []
    for kind, items in (('racquet', base['racquets']), ('string', base['strings'])):
        pool = [p for p in catalog if p['kind'] == kind]
        for it in items:
            label = f"{it['brand']} {it['model']} {it.get('variant', '')}".strip()
            want = set(norm(f"{it['brand']} {it['model']}"))
            scored = []
            for p in pool:
                toks = set(norm(p['name']))
                if not want <= toks:
                    continue
                scored.append((len(toks - want), p['code'], p['name']))
            scored.sort()
            report.append({'id': it['id'], 'label': label,
                           'extra': {k: it.get(k) for k in ('headSize', 'stringPattern', 'weight', 'gauges', 'color') if k in it},
                           'candidates': [f'{c} | {n}' for _, c, n in scored[:14]]})
    (CACHE / 'candidates.json').write_text(json.dumps(report, indent=1, ensure_ascii=False), encoding='utf-8')
    print(f'{len(report)} fiches -> {CACHE / "candidates.json"}')


# --------------------------------------------------------------------------
# 3. build : pages produit, contrôles, images, manifeste
# --------------------------------------------------------------------------
GAUGE_MM_RE = re.compile(r'(?<!\d)(\d)\.(\d{2})(?!\d)')
# Fin d'une valeur de caractéristique : intitulé suivant, bloc suivant, ou
# encart « joueur » (« Black Clara Tauson WTA Player »).
_END = (r'(?=\s*(?:Similar|String Comparison|Stock|Customer|Specifications|Gauge|Length|Racquet|Videos|'
        r'[A-Z][a-z]+ [A-Z][A-Za-z]+ (?:ATP|WTA)|$))')


def product_facts(page: str) -> dict:
    """Extrait du HTML d'une page produit les champs utiles aux contrôles."""
    text = re.sub(r'<[^>]+>', ' ', page)
    text = html.unescape(re.sub(r'\s+', ' ', text)).replace(' ', ' ')
    facts: dict = {}
    m = re.search(r'Head Size\s*:\s*([\d.]+)\s*in', text)
    if m:
        facts['headSize'] = float(m.group(1))
    m = re.search(r'String Pattern\s*:\s*(\d+)\s*Mains\s*/\s*(\d+)\s*Crosses', text)
    if m:
        facts['stringPattern'] = f'{m.group(1)}x{m.group(2)}'
    m = re.search(r'Stiffness\s*:\s*(\d{2})(?!\d)', text)
    if m:
        facts['stiffness'] = int(m.group(1))
    # « Unstrung Weight: 300g / 10,6oz » (TWE ; TW ne publie que le poids cordé :
    # le contrôle de poids ne s'applique alors pas).
    m = re.search(r'Unstrung Weight\s*:\s*[^:]{0,20}?(\d{3})\s*g(?![a-z])', text)
    if m:
        facts['weight'] = int(m.group(1))
    # Cordages : bloc « Gauge : 17/1.25mm Length : … Composition : … Color(s) : … »
    m = re.search(r'Gauge\s*:\s*([^:]{1,60}?)\s+(?:Thickness|Length|Composition|Colou?rs?|Material)\s*:', text)
    if m:
        facts['gaugeText'] = m.group(1)
        facts['gaugesMm'] = sorted({f'{x}.{y}' for x, y in GAUGE_MM_RE.findall(m.group(1))})
    m = re.search(r'Composition\s*:[^:]{0,200}?Colou?rs?\s*:\s*([A-Za-z ,/&-]{2,60}?)' + _END, text)
    if m:
        facts['color'] = m.group(1).strip(' ,')
    # Sélecteur de coloris (« Color : Black Stock # … ») : plusieurs valeurs =
    # plusieurs coloris vendus sous la même fiche, la photo n'en montre qu'un.
    facts['colorOptions'] = sorted({c.strip() for c in re.findall(r'Color\s*:\s*([A-Za-z][A-Za-z /-]{1,30}?)\s+Stock\s*#', text)})
    m = re.search(r'<h1[^>]*>(.*?)</h1>', page, re.S)
    if m:
        facts['title'] = html.unescape(re.sub(r'<[^>]+>|\s+', ' ', m.group(1))).strip()
    facts['_text'] = text
    return facts


def color_tokens(s: str) -> set[str]:
    s = s.lower().replace('grey', 'gray')
    return {t for t in re.split(r'[ ,/&-]+', s) if t and t not in ('and', 'with')}


# Codes coloris des photos TW (« ALUSTR-SI-1.jpg »). Seuls les codes sans
# ambiguïté sont retenus : GR (Grey ou Green ?) et GL (Gold ?) sont exclus.
COLOUR_CODES = {
    'black': 'BK', 'white': 'WH', 'blue': 'BL', 'silver': 'SI', 'green': 'GN', 'orange': 'OR',
    'pink': 'PK', 'yellow': 'YE', 'red': 'RD', 'gray': 'GY',
}


def colour_image(item: dict, facts: dict, page: str, thumb: str) -> str | None:
    """Fiche TW à plusieurs coloris : photo du coloris de NOTRE fiche, si elle
    est identifiable sans ambiguïté sur la page produit ; sinon None."""
    options = facts.get('colorOptions') or []
    ours = color_tokens(item.get('color') or '')
    if len(options) < 2 or len(ours) != 1:
        return None
    matches = [o for o in options if color_tokens(o) & ours]
    if len(matches) != 1:
        return None
    code = COLOUR_CODES.get(next(iter(color_tokens(matches[0]))))
    base = re.search(r'path=([A-Za-z0-9_]+?)(?:-[A-Z]{2})?-1\.jpg', thumb)
    if not code or not base:
        return None
    urls = set(re.findall(r'https://img\.tennis-warehouse\.com/watermark/rs\.php\?path='
                          + re.escape(f'{base.group(1)}-{code}-1.jpg') + r'(?=["\s,])', page))
    return urls.pop() if len(urls) == 1 else None


def check(kind: str, item: dict, decision: dict, facts: dict) -> str | None:
    """Renvoie une raison de quarantaine, ou None si l'association tient.

    Principe : ce qui ne peut pas être vérifié sur la page TW n'est pas
    présumé conforme — l'id part en quarantaine.
    """
    tw = 'TWE' if decision.get('source') == SOURCE_EU else 'TW'
    req = decision.get('requireText')
    if req and not re.search(req, facts.get('_text', '')):
        return f"mention exigée « {req} » introuvable sur la page produit {tw}"
    if kind == 'racquet':
        hs, sp = facts.get('headSize'), facts.get('stringPattern')
        if hs is None or sp is None:
            return f'tamis ou plan de cordage illisible sur la page {tw} : association non vérifiable'
        if abs(hs - float(item['headSize'])) > 0.6:
            return f"tamis {tw} {hs:g} in² != fiche {item['headSize']} in²"
        if item.get('stringPattern') and sp != item['stringPattern']:
            return f"plan de cordage {tw} {sp} != fiche {item['stringPattern']}"
        # Rigidité : un écart de 4 points RA ou plus signale plus probablement
        # une autre génération de cadre qu'une imprécision de mesure.
        ra, ours = facts.get('stiffness'), item.get('stiffness')
        if ra is not None and ours is not None and abs(ra - ours) >= 4:
            return f"rigidité {tw} {ra} RA != fiche {ours} RA (génération probablement différente)"
        # Poids (ajouté le 09/10/2026) : même cadre décliné en 285 / 300 g = autre produit.
        w, ours_w = facts.get('weight'), item.get('weight')
        if w is not None and ours_w is not None and abs(w - ours_w) > 5:
            return f"poids non cordé {tw} {w} g != fiche {ours_w} g"
        return None
    # Cordage : la jauge montrée doit figurer dans la fiche, la couleur ne pas la contredire.
    shown = facts.get('gaugesMm') or []
    if not shown:
        return f'jauge illisible sur la page {tw} : association non vérifiable'
    ours = {g for gs in item.get('gauges', []) for g in gs.split('/')}
    ours_num = {round(float(g), 2) for g in ours if re.match(r'^\d\.\d+$', g)}
    if not all(round(float(g), 2) in ours_num for g in shown):
        return f"jauge {tw} {'/'.join(shown)} mm absente de la fiche ({', '.join(item.get('gauges', []))})"
    options = facts.get('colorOptions') or []
    tw_color = facts.get('color') or ''
    if facts.get('colourImage'):
        return None  # coloris de la fiche retrouvé parmi les photos de la page TW
    if len(options) > 1 or ',' in tw_color or tw_color.lower() == 'multiple':
        shown_c = ', '.join(options) if len(options) > 1 else tw_color
        return f"plusieurs coloris vendus sous la fiche {tw} ({shown_c}) ; la photo n'en montre qu'un"
    if not tw_color and len(options) == 1:
        tw_color = options[0]
    our_color = item.get('color') or ''
    if our_color and not tw_color:
        return f'couleur illisible sur la page {tw} : association non vérifiable'
    if tw_color and our_color and not (color_tokens(tw_color) & color_tokens(our_color)):
        return f"couleur {tw} « {tw_color} » != fiche « {our_color} »"
    return None


def flatten_and_trim(img):
    """Packshots des fabricants : aplatit sur fond blanc (le site les affiche sur fond blanc) puis
    rogne les marges vides, sans toucher au contenu. Rien n'est rogné si le produit occupe déjà
    plus de 88 % de chaque dimension."""
    from PIL import Image, ImageChops
    rgba = img.convert('RGBA')
    flat = Image.new('RGB', rgba.size, (255, 255, 255))
    flat.paste(rgba, mask=rgba.split()[3])
    corner = flat.getpixel((2, 2))
    diff = ImageChops.difference(flat, Image.new('RGB', flat.size, corner)).convert('L').point(lambda v: 255 if v > 14 else 0)
    box = diff.getbbox()
    if not box:
        return flat
    w, h = flat.size
    bw, bh = box[2] - box[0], box[3] - box[1]
    if bw > 0.88 * w and bh > 0.88 * h:
        return flat
    mx, my = round(0.05 * bw) + 4, round(0.04 * bh) + 4
    return flat.crop((max(0, box[0] - mx), max(0, box[1] - my), min(w, box[2] + mx), min(h, box[3] + my)))


def to_webp(raw: bytes, dest: Path, trim: bool = False) -> tuple[int, int, int]:
    from PIL import Image
    img = Image.open(io.BytesIO(raw))
    if trim:
        img = flatten_and_trim(img)
    img = img.convert('RGBA') if img.mode in ('P', 'LA', 'RGBA') else img.convert('RGB')
    scale = min(1.0, MAX_WIDTH / img.width, MAX_HEIGHT / img.height)
    if scale < 1.0:
        img = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, 'WEBP', quality=WEBP_QUALITY, method=6)
    return img.width, img.height, dest.stat().st_size


def build() -> None:
    base = load_base()
    catalog = {p['code']: p for p in json.loads((CACHE / 'catalog.json').read_text(encoding='utf-8'))}
    catalog_eu = eu_catalog()
    catalog_tp = tp_catalog()
    catalog_fab: dict[str, dict] = {}
    mapping = json.loads(MAPPING.read_text(encoding='utf-8'))
    manifest: dict[str, dict] = {}
    quarantine: list[dict] = []
    today = date.today().isoformat()

    for kind, items, folder in (('racquet', base['racquets'], 'racquets'), ('string', base['strings'], 'strings')):
        section = mapping[folder]
        for it in items:
            pid = it['id']
            decision = section.get(pid)
            if decision is None:
                quarantine.append({'id': pid, 'kind': kind, 'reason': 'aucune décision dans le mapping'})
                continue
            if 'quarantine' in decision:
                quarantine.append({'id': pid, 'kind': kind, 'reason': decision['quarantine']})
                continue
            source = decision.get('source', SOURCE_TW)
            fab_brand = fab.brand_of(source) if fab.is_fab(source) else None
            if fab_brand:
                if fab_brand not in catalog_fab:
                    catalog_fab[fab_brand] = fab_catalog(fab_brand)
                cat = catalog_fab[fab_brand]
            else:
                cat = {SOURCE_TW: catalog, SOURCE_EU: catalog_eu, SOURCE_TP: catalog_tp}[source]
            prod = cat.get(decision['code'])
            if prod is None:
                where = {SOURCE_TW: 'pages catégorie TW', SOURCE_EU: 'plan du site TWE',
                         SOURCE_TP: 'plan du site Tennis-Point'}.get(source, f'pages de navigation {source}')
                quarantine.append({'id': pid, 'kind': kind,
                                   'reason': f"code {decision['code']} absent des {where} lus"})
                continue
            cache = fab_cache(fab_brand) if fab_brand else {SOURCE_TW: CACHE, SOURCE_EU: CACHE_EU, SOURCE_TP: CACHE_TP}[source]
            body = fetch(prod['url'], cache / 'descpages' / f"{prod['code']}.html")
            if body is None:
                quarantine.append({'id': pid, 'kind': kind, 'reason': f"page produit indisponible {prod['url']}"})
                continue
            page_html = body.decode('utf-8', 'replace')
            if fab_brand:
                facts = fab.facts(fab_brand, page_html, prod)
                reason = fab.check(fab_brand, kind, it, prod, facts, decision)
            elif source == SOURCE_TP:
                facts = tp_facts(page_html)
                reason = tp_check(kind, it, prod, facts)
            else:
                facts = product_facts(page_html)
                if kind == 'string' and source == SOURCE_TW:
                    facts['colourImage'] = colour_image(it, facts, page_html, prod['thumb'])
                reason = check(kind, it, decision, facts)
            if reason:
                quarantine.append({'id': pid, 'kind': kind, 'reason': reason,
                                   'twProduct': prod['name'], 'sourcePageUrl': prod['url']})
                continue
            if fab_brand:
                image_url = fab.image_url(fab_brand, page_html, prod, facts)
                if image_url is None:
                    quarantine.append({'id': pid, 'kind': kind, 'reason': 'image principale introuvable sur la page officielle'})
                    continue
            elif source == SOURCE_TW:
                image_url = facts.get('colourImage') or prod['thumb']
            elif source == SOURCE_TP:
                image_url = prod['thumb']  # image principale publiée dans le sitemap produit
            else:
                image_url = eu_image(page_html, prod['code'])
                if image_url is None:
                    quarantine.append({'id': pid, 'kind': kind, 'reason': 'photo principale introuvable sur la page TWE'})
                    continue
            raw_name = re.sub(r'[^A-Za-z0-9_-]+', '_', image_url.split('path=')[-1])[-80:]
            raw_file = (f"{prod['code']}.jpg" if image_url == prod.get('thumb')
                        else f"{prod['code']}__{raw_name}.jpg")
            raw = fetch(image_url, cache / 'raw' / raw_file, binary=True)
            if raw is None:
                quarantine.append({'id': pid, 'kind': kind, 'reason': f"image indisponible {image_url}"})
                continue
            rel = f'/images/products/{folder}/{pid}.webp'
            w, h, size = to_webp(raw, PUBLIC / folder / f'{pid}.webp', trim=bool(fab_brand))
            prev = (CACHE / 'retrieved.json')
            retrieved = json.loads(prev.read_text(encoding='utf-8')) if prev.exists() else {}
            rkey = (f"fab:{fab_brand}:{prod['code']}" if fab_brand else
                    {SOURCE_TW: prod['code'], SOURCE_EU: f"eu:{prod['code']}", SOURCE_TP: f"tp:{prod['code']}"}[source])
            retrieved.setdefault(rkey, today)
            prev.write_text(json.dumps(retrieved, indent=1), encoding='utf-8')
            manifest[pid] = {
                'file': rel, 'width': w, 'height': h, 'bytes': size,
                'sourcePageUrl': prod['url'], 'sourceImageUrl': image_url,
                'retrievedAt': retrieved[rkey], 'source': source,
                'twProduct': (facts.get('title') or prod['name']) if fab_brand else prod['name'],
            }
            print(f'   ok {pid:40s} <- {prod["name"]} ({size // 1024} Ko)')

    QUARANTINE.write_text(json.dumps({
        'generatedAt': today,
        'count': len(quarantine),
        'items': quarantine,
    }, indent=1, ensure_ascii=False), encoding='utf-8')
    write_manifest(manifest)
    # Une image d'un id passé en quarantaine ne doit pas survivre à un rejeu.
    kept = {ROOT / 'public' / v['file'].lstrip('/') for v in manifest.values()}
    for stale in PUBLIC.glob('*/*.webp'):
        if stale not in kept:
            stale.unlink()
            print(f'   retiré {stale.relative_to(ROOT)}')
    total = sum(v['bytes'] for v in manifest.values())
    nr = sum(v['file'].startswith('/images/products/racquets/') for v in manifest.values())
    print(f'\nImages : {nr} raquettes, {len(manifest) - nr} cordages, {total / 1e6:.2f} Mo au total')
    print(f'Quarantaine : {len(quarantine)} -> {QUARANTINE}')


MANIFEST_FIELDS = ('file', 'width', 'height', 'sourcePageUrl', 'sourceImageUrl', 'retrievedAt', 'source', 'twProduct')


SOURCE_LABELS = {SOURCE_TW: 'Tennis Warehouse', SOURCE_EU: 'Tennis Warehouse Europe', 'tennis-point': 'Tennis-Point'}


def source_labels(used: set[str] | None = None) -> dict[str, str]:
    """Libellé du crédit « Photo : … » par source : les trois sources historiques, plus les
    fabricants qui ont au moins une photo au manifeste."""
    labels = dict(SOURCE_LABELS)
    for brand, info in fab.BRANDS.items():
        if used is None or fab.FAB_PREFIX + brand in used:
            labels[fab.FAB_PREFIX + brand] = info['label']
    return labels


def fab_cache(brand: str) -> Path:
    return CACHE_FAB / brand


def fab_catalog(brand: str) -> dict[str, dict]:
    path = fab_cache(brand) / 'catalog.json'
    return {p['code']: p for p in json.loads(path.read_text(encoding='utf-8'))} if path.exists() else {}


def write_manifest(manifest: dict) -> None:
    lines = [
        '// FICHIER GÉNÉRÉ par scripts/scraper/tw_product_images.py — ne pas éditer à la main.',
        '//',
        '// Photos produit hébergées chez nous (public/images/products/) : Tennis Warehouse (US),',
        '// Tennis Warehouse Europe, Tennis-Point et images officielles des fabricants',
        '// (source « fabricant:<marque> »). Retrait : PRODUCT_IMAGES_ENABLED = false',
        '// (src/lib/product-images.ts), puis : python scripts/scraper/tw_product_images.py purge',
        '// (ou « purge <source> » pour une seule source, ex. « purge fabricant:wilson »).',
        '',
        'export type ProductImageSource =',
        "  | 'tennis-warehouse'",
        "  | 'tennis-warehouse-europe'",
        "  | 'tennis-point'",
        '  | `fabricant:${string}`;',
        '',
        '/** Libellé du crédit « Photo : … » affiché sous chaque photo, par source. */',
        'export const PRODUCT_IMAGE_CREDITS: Readonly<Record<string, string>> = {',
    ] + [f'  {json.dumps(k)}: {json.dumps(v, ensure_ascii=False)},' for k, v in source_labels({e['source'] for e in manifest.values()}).items()] + [
        '};',
        '',
        'export interface ProductImageEntry {',
        '  file: string;',
        '  width: number;',
        '  height: number;',
        '  sourcePageUrl: string;',
        '  sourceImageUrl: string;',
        '  retrievedAt: string;',
        '  source: ProductImageSource;',
        '  /** Intitulé du produit chez la source, pour l\'audit de l\'association. */',
        '  twProduct: string;',
        '}',
        '',
        'export const PRODUCT_IMAGES: Readonly<Record<string, ProductImageEntry>> = {',
    ]
    # Une ligne par produit : le manifeste reste lisible en revue de diff.
    for pid in sorted(manifest):
        e = manifest[pid]
        fields = ', '.join(f'{k}: {json.dumps(e[k], ensure_ascii=False)}' for k in MANIFEST_FIELDS)
        lines.append(f'  {json.dumps(pid)}: {{ {fields} }},')
    lines += ['};', '']
    MANIFEST_TS.write_text('\n'.join(lines), encoding='utf-8', newline='\n')


def read_manifest() -> dict:
    """Relit le manifeste généré (une ligne par entrée, valeurs au format JSON)."""
    out: dict[str, dict] = {}
    if not MANIFEST_TS.exists():
        return out
    keys = '|'.join(MANIFEST_FIELDS)
    for line in MANIFEST_TS.read_text(encoding='utf-8').splitlines():
        m = re.match(r'^  ("[^"]+"): \{ (.*) \},$', line)
        if not m:
            continue
        body = re.sub(r'(^|, )(' + keys + r'): ', r'\1"\2": ', m.group(2))
        out[json.loads(m.group(1))] = json.loads('{' + body + '}')
    return out


def purge(source: str | None = None) -> None:
    """Retrait : supprime les images hébergées, le cache brut et vide le manifeste.
    Avec une source (`tennis-warehouse` ou `tennis-warehouse-europe`), ne retire que
    les photos de cette source ; les autres restent servies."""
    import shutil
    if source is None:
        raws = [CACHE / 'raw', CACHE_EU / 'raw', CACHE_TP / 'raw'] + sorted(CACHE_FAB.glob('*/raw'))
        for path in [PUBLIC] + raws:
            if path.exists():
                shutil.rmtree(path)
                print(f'   supprimé {path.relative_to(ROOT)}')
        write_manifest({})
        print(f'   manifeste vidé : {MANIFEST_TS.relative_to(ROOT)}')
        return
    if source not in SOURCES and not (fab.is_fab(source) and fab.brand_of(source) in fab.BRANDS):
        known = list(SOURCES) + [fab.FAB_PREFIX + b for b in fab.BRANDS]
        raise SystemExit(f'source inconnue : {source} (attendu : {", ".join(known)})')
    manifest = read_manifest()
    kept = {pid: e for pid, e in manifest.items() if e['source'] != source}
    for pid, e in manifest.items():
        if pid not in kept:
            (ROOT / 'public' / e['file'].lstrip('/')).unlink(missing_ok=True)
    raw = (fab_cache(fab.brand_of(source)) if fab.is_fab(source)
           else {SOURCE_TW: CACHE, SOURCE_EU: CACHE_EU, SOURCE_TP: CACHE_TP}[source]) / 'raw'
    if raw.exists():
        shutil.rmtree(raw)
    write_manifest(kept)
    print(f'   {len(manifest) - len(kept)} photo(s) {source} retirée(s), {len(kept)} conservée(s)')


# --------------------------------------------------------------------------
# candidates-eu : aide à la décision, pages TWE lues et contrôles appliqués
# --------------------------------------------------------------------------
def candidates_tp() -> None:
    """Comme candidates-eu, pour Tennis-Point : candidats dont le handle publié
    contient marque et modèle, page lue (débit lent), contrôles TP appliqués.
    Ne décide RIEN. Un refus du site arrête tout (AccessRefused)."""
    base = load_base()
    catalog_tp = tp_catalog()
    manifest = read_manifest()
    only = set(sys.argv[2:])
    report = []
    try:
        for kind, items in (('racquet', base['racquets']), ('string', base['strings'])):
            pool = [p for p in catalog_tp.values() if p['kind'] == kind]
            for it in items:
                if (only and it['id'] not in only) or (not only and it['id'] in manifest):
                    continue
                want = set(norm(f"{it['brand']} {it['model']}"))
                scored = sorted((len(set(norm(p['name'])) - want), p['code']) for p in pool
                                if want <= set(norm(p['name'])))
                rows = []
                for _, code in scored[:12]:
                    prod = catalog_tp[code]
                    body = fetch(prod['url'], CACHE_TP / 'descpages' / f'{code}.html')
                    if body is None:
                        rows.append({'code': code, 'reason': 'page indisponible'})
                        continue
                    facts = tp_facts(body.decode('utf-8', 'replace'))
                    rows.append({'code': code, 'title': facts.get('title'),
                                 'facts': {k: facts.get(k) for k in ('headSize', 'stringPattern', 'weight', 'strung',
                                                                     'gaugesMm', 'colourFr')},
                                 'reason': tp_check(kind, it, prod, facts)})
                report.append({'id': it['id'], 'label': f"{it['brand']} {it['model']} {it.get('variant') or ''}".strip(),
                               'ours': {k: it.get(k) for k in ('headSize', 'stringPattern', 'stiffness', 'weight',
                                                               'gauges', 'color')},
                               'candidates': rows})
    finally:
        out = CACHE_TP / 'candidates.json'
        out.write_text(json.dumps(report, indent=1, ensure_ascii=False), encoding='utf-8')
        print(f'{len(report)} fiches -> {out}')


def candidates_eu() -> None:
    """Pour chaque fiche sans photo (ou les id passés en argument), liste les
    produits TWE dont l'intitulé contient marque et modèle, lit leur page et
    applique les contrôles du build. Ne décide RIEN : la sortie se lit, la
    décision s'écrit à la main dans le mapping."""
    base = load_base()
    catalog_eu = eu_catalog()
    manifest = read_manifest()
    only = set(sys.argv[2:])
    report = []
    for kind, items in (('racquet', base['racquets']), ('string', base['strings'])):
        pool = [p for p in catalog_eu.values() if p['kind'] == kind]
        for it in items:
            if (only and it['id'] not in only) or (not only and it['id'] in manifest):
                continue
            want = set(norm(f"{it['brand']} {it['model']}"))
            scored = sorted((len(set(norm(p['name'])) - want), p['code']) for p in pool
                            if want <= set(norm(p['name'])))
            rows = []
            for _, code in scored[:25]:
                prod = catalog_eu[code]
                body = fetch(prod['url'], CACHE_EU / 'descpages' / f'{code}.html')
                if body is None:
                    rows.append({'code': code, 'name': prod['name'], 'reason': 'page indisponible'})
                    continue
                page = body.decode('utf-8', 'replace')
                facts = product_facts(page)
                reason = check(kind, it, {'source': SOURCE_EU}, facts)
                rows.append({'code': code, 'name': prod['name'], 'title': facts.get('title'),
                             'facts': {k: facts.get(k) for k in ('headSize', 'stringPattern', 'stiffness', 'weight',
                                                                 'gaugesMm', 'color', 'colorOptions')},
                             'image': bool(eu_image(page, code)), 'reason': reason})
            report.append({'id': it['id'], 'label': f"{it['brand']} {it['model']} {it.get('variant') or ''}".strip(),
                           'ours': {k: it.get(k) for k in ('headSize', 'stringPattern', 'stiffness', 'weight',
                                                           'gauges', 'color')},
                           'candidates': rows})
    out = CACHE_EU / 'candidates.json'
    out.write_text(json.dumps(report, indent=1, ensure_ascii=False), encoding='utf-8')
    print(f'{len(report)} fiches -> {out}')


# --------------------------------------------------------------------------
# Fabricants : discover-fab <marque> / candidates-fab <marque> [ids...]
# --------------------------------------------------------------------------
def discover_fab() -> None:
    """Liste les produits officiels d'une marque, lus sur le plan du site ou les pages de
    navigation autorisées par robots.txt (aucune URL composée). Écrit catalog.json."""
    brand = sys.argv[2] if len(sys.argv) > 2 else ''
    if brand not in fab.BRANDS:
        raise SystemExit(f'marque inconnue : {brand} (attendu : {", ".join(fab.BRANDS)})')
    cache = fab_cache(brand)
    cache.mkdir(parents=True, exist_ok=True)
    items = fab.DISCOVER[brand](fetch, cache)
    (cache / 'catalog.json').write_text(json.dumps(items, indent=1, ensure_ascii=False), encoding='utf-8')
    print(f'Catalogue {brand} : {len(items)} produits '
          f'({sum(p["kind"] == "racquet" for p in items)} raquettes, {sum(p["kind"] == "string" for p in items)} cordages)')


def candidates_fab() -> None:
    """Pour chaque fiche encore sans photo de la marque (ou les id donnés), liste les pages
    officielles dont l'intitulé recouvre le modèle, les lit (débit >= 3 s) et applique les
    contrôles. Ne décide RIEN : la décision s'écrit à la main dans le mapping."""
    brand = sys.argv[2] if len(sys.argv) > 2 else ''
    if brand not in fab.BRANDS:
        raise SystemExit(f'marque inconnue : {brand} (attendu : {", ".join(fab.BRANDS)})')
    # Arguments : des id (fiches à traiter) ou « id=code » pour ajouter une page candidate
    # lue sur la navigation mais que le recouvrement de noms n'aurait pas retenue.
    forced: dict[str, list[str]] = {}
    for arg in sys.argv[3:]:
        pid, _, code = arg.partition('=')
        forced.setdefault(pid, [])
        if code:
            forced[pid].append(code)
    only = set(forced)
    info = fab.BRANDS[brand]
    base = load_base()
    manifest = read_manifest()
    catalog = fab_catalog(brand)
    cache = fab_cache(brand)
    report = []
    try:
        for kind, items in (('racquet', base['racquets']), ('string', base['strings'])):
            pool = [p for p in catalog.values() if p['kind'] == kind]
            for it in items:
                if it['brand'] not in info['catalog_brands']:
                    continue
                if (only and it['id'] not in only) or (not only and it['id'] in manifest):
                    continue
                brand_toks = {t for b in info['catalog_brands'] for t in fab.alias_tokens(b)}
                drop = brand_toks | {'standard'}
                wants = [{t for t in fab.alias_tokens(f"{it['model']} {it.get('variant') or ''}") if t not in drop},
                         {t for t in fab.alias_tokens(it['id'].replace('-', ' ')) if t not in drop}]
                scored = []
                for p in pool:
                    toks = set(fab.alias_tokens(p['name']))
                    cover = max(len(w & toks) / max(1, len(w)) for w in wants)
                    if cover >= 0.75:
                        scored.append((-cover, len(toks - wants[0]), p['code']))
                scored.sort()
                codes = [c for _, _, c in scored[:4]]
                codes += [c for c in forced.get(it['id'], []) if c in catalog and c not in codes]
                rows = []
                for code in codes:
                    prod = catalog[code]
                    body = fetch(prod['url'], cache / 'descpages' / f'{code}.html')
                    if body is None:
                        rows.append({'code': code, 'name': prod['name'], 'reason': 'page indisponible'})
                        continue
                    page = body.decode('utf-8', 'replace')
                    facts = fab.facts(brand, page, prod)
                    rows.append({'code': code, 'name': prod['name'], 'title': facts.get('title'),
                                 'facts': {k: facts.get(k) for k in ('headSize', 'stringPattern', 'weight', 'stiffness',
                                                                     'gaugesMm', 'color', 'colourFr') if facts.get(k) is not None},
                                 'image': fab.image_url(brand, page, prod, facts),
                                 'reason': fab.check(brand, kind, it, prod, facts, {})})
                report.append({'id': it['id'], 'label': f"{it['brand']} {it['model']} {it.get('variant') or ''}".strip(),
                               'ours': {k: it.get(k) for k in ('headSize', 'stringPattern', 'stiffness', 'weight',
                                                               'gauges', 'color')},
                               'candidates': rows})
    finally:
        out = cache / 'candidates.json'
        out.write_text(json.dumps(report, indent=1, ensure_ascii=False), encoding='utf-8')
        print(f'{len(report)} fiches -> {out}')


def peek_fab() -> None:
    """Planche-contact des images des pages candidates retenues (contrôle visuel : packshot de
    face, coloris, absence de joueur). Télécharge uniquement les images des codes donnés, dans le
    cache brut (jamais dans public/). Écrit scripts/scraper/out/peek-<marque>.png."""
    from PIL import Image, ImageDraw
    brand = sys.argv[2] if len(sys.argv) > 2 else ''
    if brand not in fab.BRANDS:
        raise SystemExit(f'marque inconnue : {brand}')
    codes = sys.argv[3:]
    catalog = fab_catalog(brand)
    cache = fab_cache(brand)
    tiles = []
    for code in codes:
        prod = catalog[code]
        body = fetch(prod['url'], cache / 'descpages' / f'{code}.html')
        facts = fab.facts(brand, body.decode('utf-8', 'replace'), prod)
        url = fab.image_url(brand, body.decode('utf-8', 'replace'), prod, facts)
        raw = fetch(url, cache / 'raw' / f"{code}__{re.sub(r'[^A-Za-z0-9_-]+', '_', url)[-80:]}.jpg", binary=True) if url else None
        if raw is None:
            print(f'   pas d\'image : {code}')
            continue
        img = Image.open(io.BytesIO(raw)).convert('RGBA')
        bg = Image.new('RGBA', img.size, (255, 255, 255, 255))
        bg.alpha_composite(img)
        img = bg.convert('RGB')
        img.thumbnail((260, 380))
        tile = Image.new('RGB', (270, 420), 'white')
        tile.paste(img, (5, 5))
        ImageDraw.Draw(tile).text((5, 392), code[-44:], fill=(0, 0, 0))
        tiles.append(tile)
        print(f'   {code}: {Image.open(io.BytesIO(raw)).size} {len(raw) // 1024} Ko')
    if tiles:
        sheet = Image.new('RGB', (270 * len(tiles), 420), 'white')
        for i, t in enumerate(tiles):
            sheet.paste(t, (270 * i, 0))
        out = OUT / f'peek-{brand}.png'
        sheet.save(out)
        print(f'planche : {out}')


if __name__ == '__main__':
    step = sys.argv[1] if len(sys.argv) > 1 else ''
    CACHE.mkdir(parents=True, exist_ok=True)
    CACHE_EU.mkdir(parents=True, exist_ok=True)
    CACHE_TP.mkdir(parents=True, exist_ok=True)
    if step == 'purge':
        purge(sys.argv[2] if len(sys.argv) > 2 else None)
    else:
        {'discover': discover, 'discover-eu': discover_eu, 'discover-tp': discover_tp,
         'discover-fab': discover_fab, 'peek-fab': peek_fab,
         'candidates': candidates, 'candidates-eu': candidates_eu, 'candidates-tp': candidates_tp,
         'candidates-fab': candidates_fab,
         'build': build}.get(step, lambda: sys.exit(__doc__))()
