#!/usr/bin/env python3
"""
Photos OFFICIELLES des fabricants -> public/images/products/ (décision de Pierre, 10/10/2026).

Décision de Pierre, verbatim : « Il n'y a aucune restriction à utiliser les images
officielles des raquettes. Jamais un fabricant ne s'opposera à la promotion des
produits de sa marque. » Prise EN CONNAISSANCE DU RISQUE, comme celle du 29/09 sur
Tennis Warehouse : tolérance supposée, aucune licence écrite. Les conditions
d'utilisation relevées sur chaque site figurent, texte exact, dans la description
de la PR ; elles interdisent la reproduction sans autorisation écrite (Wilson,
Babolat, Tecnifibre, Yonex). Le dispositif est donc purgeable par marque
(`purge fabricant:<marque>`) ou en bloc (`purge`).

Sites fermés au robot le 10/10/2026 : head.com (429, « Vercel Security Checkpoint », dès
robots.txt) et luxilon.com (403 à la première requête du collecteur) : aucune page lue,
aucun contournement ; l'adaptateur Luxilon est écrit mais NON TESTÉ au-delà de cette
première requête, et `out/refused-hosts.json` empêche toute nouvelle requête vers ces hôtes
tant que la ligne n'est pas retirée à la main.

Ce module ne contient QUE la logique propre à chaque site (découverte des pages,
lecture des caractéristiques, choix de l'image). Il n'ouvre aucune connexion : les
requêtes passent par `tw_product_images.fetch` (cache disque, débit >= 3 s par hôte,
arrêt au premier 403/406/429 ou page anti-robot, hôtes refusés consignés).

Règles communes
---------------
* Aucune URL composée à la main : pages produit et images sont LUES sur le plan du
  site ou sur les pages de navigation (collections, catégories). Les pages de recherche
  et tout chemin interdit par robots.txt ne sont pas appelés.
* L'association id -> page officielle est une décision humaine, consignée dans
  `product-images-mapping.json` (`"source": "fabricant:<marque>"`). Le script ne fait
  que la VÉRIFIER : tamis, plan de cordage, poids non cordé, RA quand elle est publiée,
  millésime / génération lus dans l'intitulé, jauge et coloris des cordages. Tout
  désaccord, toute caractéristique illisible : quarantaine, jamais « meilleur effort ».
* Packshot seulement : vue de face du produit, pas de photo d'ambiance, pas de joueur.
"""
from __future__ import annotations

import html
import json
import re

FAB_PREFIX = 'fabricant:'

# Libellé du crédit (« Photo : <label> ») et noms de marque du catalogue TSA couverts.
BRANDS: dict[str, dict] = {
    'wilson': {'label': 'Wilson', 'catalog_brands': ('Wilson',), 'host': 'www.wilson.com'},
    'luxilon': {'label': 'Luxilon', 'catalog_brands': ('Luxilon',), 'host': 'www.luxilon.com'},
    'babolat': {'label': 'Babolat', 'catalog_brands': ('Babolat',), 'host': 'www.babolat.com'},
    'tecnifibre': {'label': 'Tecnifibre', 'catalog_brands': ('Tecnifibre',), 'host': 'www.tecnifibre.com'},
    'yonex': {'label': 'Yonex', 'catalog_brands': ('Yonex',), 'host': 'www.yonex.com'},
}


def is_fab(source: str) -> bool:
    return source.startswith(FAB_PREFIX)


def brand_of(source: str) -> str:
    return source[len(FAB_PREFIX):]


def source_label(source: str) -> str:
    """Libellé du crédit affiché pour une source fabricant."""
    return BRANDS[brand_of(source)]['label']


# --------------------------------------------------------------------------
# Lecture du HTML
# --------------------------------------------------------------------------
def page_text(page: str) -> str:
    body = re.sub(r'<script.*?</script>|<style.*?</style>|<noscript.*?</noscript>', ' ', page, flags=re.S)
    return html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', body))).replace('\xa0', ' ')


def json_ld(page: str) -> list:
    out = []
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', page, flags=re.S):
        try:
            out.append(json.loads(m.group(1)))
        except ValueError:
            continue
    return out


def ld_products(page: str) -> list[dict]:
    """Tous les objets schema.org `Product` du HTML (y compris dans un ItemList)."""
    found: list[dict] = []

    def walk(o):
        if isinstance(o, dict):
            if o.get('@type') == 'Product':
                found.append(o)
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)

    for obj in json_ld(page):
        walk(obj)
    return found


def alias_tokens(s: str) -> list[str]:
    """Jetons de nom normalisés (jr = junior, accents retirés, 'v' collé au numéro)."""
    s = s.lower().replace('ö', 'o').replace('é', 'e').replace('è', 'e').replace("'", '').replace('’', '')
    toks = [t for t in re.split(r'[^a-z0-9.]+', s) if t]
    return ['junior' if t in ('jr', 'jun') else t for t in toks]


def gauge_mm(raw: str) -> str | None:
    """'125' -> '1.25', '1.25' -> '1.25', '16' (calibre US) -> None."""
    raw = raw.replace(',', '.')
    if re.fullmatch(r'\d\.\d{2}', raw):
        return raw
    if re.fullmatch(r'1\d\d', raw):
        return f'{raw[0]}.{raw[1:]}'
    return None


# --------------------------------------------------------------------------
# Wilson (www.wilson.com, boutique Shopify « en-us »)
# --------------------------------------------------------------------------
# robots.txt du 10/10/2026 : les sitemaps produit sont INTERDITS (`Disallow: /sitemap_products_*`)
# et la recherche aussi (`Disallow: /search`). Découverte par la navigation : pages « collection »
# du menu, dont le HTML porte un ItemList schema.org (nom, URL, image principale).
WILSON_BASE = 'https://www.wilson.com'
WILSON_COLLECTIONS = [
    '/en-us/collections/tennis-rackets',
    '/en-us/collections/junior-tennis-rackets',
    '/en-us/collections/tennis-roger-federer',
    '/en-us/collections/tennis-us-open',
]


def discover_wilson(fetch, cache) -> list[dict]:
    products: dict[str, dict] = {}
    for path in WILSON_COLLECTIONS:
        page_no = 1
        while page_no <= 6:
            url = WILSON_BASE + path + ('' if page_no == 1 else f'?page={page_no}')
            body = fetch(url, cache / 'catpages' / (re.sub(r'[^A-Za-z0-9]+', '_', path + f'_{page_no}') + '.html'))
            if body is None:
                break
            page = body.decode('utf-8', 'replace')
            new = 0
            for prod in ld_products(page):
                u = prod.get('url') or ''
                m = re.match(r'https://www\.wilson\.com/en-us/products/([a-z0-9-]+)$', u)
                if not m or 'racket' not in m.group(1) or re.search(r'(bag|cover)', m.group(1)):
                    continue
                img = prod.get('image')
                if isinstance(img, list):
                    img = img[0] if img else None
                if img and img.startswith('//'):
                    img = 'https:' + img
                if m.group(1) not in products:
                    new += 1
                products.setdefault(m.group(1), {
                    'code': m.group(1), 'kind': 'racquet', 'url': u,
                    'name': html.unescape(prod.get('name', '')), 'thumb': img})
            if new == 0 or f'?page={page_no + 1}' not in page:
                break  # la barre de pagination liste des pages au-delà de la dernière : on s'arrête à la première sans nouveauté
            page_no += 1
    return sorted(products.values(), key=lambda p: p['code'])


def facts_wilson(page: str, prod: dict) -> dict:
    text = page_text(page)
    facts: dict = {'_text': text}
    m = re.search(r'Head Size ([\d.]+) sq cm / ([\d.]+) sq in', text)
    if m:
        facts['headSize'] = float(m.group(2))
    m = re.search(r'String Pattern (\d+) x (\d+)', text)
    if m:
        facts['stringPattern'] = f'{m.group(1)}x{m.group(2)}'
    m = re.search(r'Unstrung Weight ([\d.]+)', text)
    if m:
        facts['weight'] = round(float(m.group(1)))
    m = re.search(r'Stiffness\s*(?:\(RA\))?\s*:?\s*(\d{2})(?!\d)', text)
    if m:
        facts['stiffness'] = int(m.group(1))
    facts['title'] = prod.get('name')
    return facts


# --------------------------------------------------------------------------
# Luxilon (www.luxilon.com, Magento « en-us », pages rendues côté client)
# --------------------------------------------------------------------------
# robots.txt : « Crawl-delay: 10 » (respecté : 10 s), plan du site publié dans robots.txt.
LUXILON_SITEMAP = 'https://www.luxilon.com/en-us/sitemaps/luxilon/sitemap-index.xml'
LUX_SKIP_RE = re.compile(r'(dampener|grip|egift|custom|wilson-com|byov|reel)', re.I)


def discover_luxilon(fetch, cache) -> list[dict]:
    index = fetch(LUXILON_SITEMAP, cache / 'sitemaps' / 'index.xml')
    if index is None:
        return []
    products: dict[str, dict] = {}
    for loc in re.findall(r'<loc>([^<]+)</loc>', index.decode('utf-8', 'replace')):
        if 'product-sitemap' not in loc:
            continue
        body = fetch(html.unescape(loc), cache / 'sitemaps' / 'products.xml')
        if body is None:
            continue
        for u in re.findall(r'<loc>(https://www\.luxilon\.com/en-us/product/([a-z0-9-]+))</loc>', body.decode('utf-8', 'replace')):
            url, slug = u
            if LUX_SKIP_RE.search(slug):
                continue  # bobines, accessoires : seuls les « set » portent une jauge et un coloris de garniture
            products[slug] = {'code': slug, 'kind': 'string', 'url': url, 'name': slug.replace('-', ' '), 'thumb': None}
    return sorted(products.values(), key=lambda p: p['code'])


def facts_luxilon(page: str, prod: dict) -> dict:
    facts: dict = {}
    items = ld_products(page)
    if items:
        it = items[0]
        facts['title'] = html.unescape(it.get('name', ''))
        img = it.get('image')
        if isinstance(img, list):
            img = img[0] if img else None
        facts['image'] = img
        m = re.search(r'\b(1\d\d)\b', facts['title'])
        if m:
            g = gauge_mm(m.group(1))
            facts['gaugesMm'] = [g] if g else []
    return facts


# --------------------------------------------------------------------------
# Babolat (www.babolat.com/fr, Salesforce Commerce Cloud)
# --------------------------------------------------------------------------
# robots.txt : `Disallow: /*start` (pagination des listes), recherche et filtres interdits ;
# plans du site publiés. Cordages : plan du site produit. Raquettes : pages « collection » et
# « raquettes » listées dans le plan du site des catégories (une page = au plus ~23 produits).
BABOLAT_BASE = 'https://www.babolat.com'
BAB_STRING_SKIP_RE = re.compile(r'(x3|x4|kit|cart|bag|tube|vs-original|pro-response|nylon|badminton|padel)', re.I)

FR_EN_COLOURS = {
    'noir': 'black', 'black': 'black', 'blanc': 'white', 'white': 'white', 'gris': 'gray', 'grey': 'gray',
    'gray': 'gray', 'argent': 'silver', 'silver': 'silver', 'bleu': 'blue', 'blue': 'blue', 'rouge': 'red',
    'red': 'red', 'jaune': 'yellow', 'yellow': 'yellow', 'vert': 'green', 'green': 'green', 'rose': 'pink',
    'pink': 'pink', 'marron': 'brown', 'brown': 'brown', 'naturel': 'natural', 'natural': 'natural',
    'ecru': 'natural', 'écru': 'natural', 'violet': 'purple', 'purple': 'purple', 'or': 'gold', 'gold': 'gold',
    'orange': 'orange', 'bronze': 'bronze', 'anthracite': 'anthracite', 'lime': 'lime', 'ambre': 'amber',
    'carbon': 'carbon', 'amber': 'amber', 'cream': 'cream', 'creme': 'cream', 'crème': 'cream', 'turquoise': 'turquoise',
}


def colour_set(s: str) -> set[str]:
    """Coloris canoniques d'un libellé (FR ou EN) ; mots inconnus conservés tels quels."""
    out = set()
    for w in re.split(r'[ ,/&-]+', (s or '').lower()):
        if w and w not in ('and', 'et', 'with', 'avec', 'selected'):
            out.add(FR_EN_COLOURS.get(w, w))
    return out


def srcset_best(entry: str, min_w: int = 600, max_w: int = 1400) -> str | None:
    """Meilleure variante PUBLIÉE d'une chaîne façon srcset « url 252w, url 504w, ... »
    (les URL contiennent des virgules sans espace : le séparateur est « virgule + espace »)."""
    best = None
    for part in entry.split(', '):
        m = re.match(r'(\S+)\s+(\d+)w$', part.strip())
        if not m:
            continue
        w = int(m.group(2))
        if min_w <= w <= max_w and (best is None or w < best[0]):
            best = (w, m.group(1))
    return best[1] if best else None


def discover_babolat(fetch, cache) -> list[dict]:
    products: dict[str, dict] = {}
    # Cordages : plan du site produit (version FR).
    index = fetch(BABOLAT_BASE + '/fr/sitemap_index.xml', cache / 'sitemaps' / 'index.xml')
    if index is None:
        return []
    locs = [html.unescape(x) for x in re.findall(r'<loc>([^<]+)</loc>', index.decode('utf-8', 'replace'))]
    for loc in locs:
        if loc.endswith('sitemap_0-product.xml'):
            body = fetch(loc, cache / 'sitemaps' / 'products.xml')
            for url in re.findall(r'<loc>(https://www\.babolat\.com/fr/([a-z0-9.\-]+)/(\d{5,8})\.html)</loc>',
                                  (body or b'').decode('utf-8', 'replace')):
                u, slug, pid = url
                if BAB_STRING_SKIP_RE.search(slug) or 'cordee' in slug:
                    continue
                products.setdefault(pid, {'code': pid, 'kind': 'string', 'url': u, 'name': slug.replace('-', ' '), 'thumb': None})
        if loc.endswith('sitemap_2-category.xml'):
            body = fetch(loc, cache / 'sitemaps' / 'categories.xml')
            cats = [u for u in re.findall(r'<loc>(https://www\.babolat\.com/fr/tennis/(?:collections|raquettes)/[a-z0-9\-]+\.html)</loc>',
                                          (body or b'').decode('utf-8', 'replace'))]
            for url in cats:
                page = fetch(url, cache / 'catpages' / (re.sub(r'[^A-Za-z0-9]+', '_', url.split('/fr/')[-1]) + '.html'))
                if page is None:
                    continue
                # Les pages « collection » et « raquettes » portent un JSON-LD Product par article
                # (nom, @id = URL publiée) ; les tuiles HTML, elles, ne sont pas toutes rendues.
                for prod in ld_products(page.decode('utf-8', 'replace')):
                    m = re.match(r'https://www\.babolat\.com/fr/([a-z0-9.\-]+)/(?:\d{3}-)?(\d{5,8})\.html$', prod.get('@id', ''))
                    if m:
                        products.setdefault(m.group(2), {'code': m.group(2), 'kind': 'racquet', 'url': prod['@id'],
                                                         'name': html.unescape(prod.get('name', '')), 'thumb': None})
                for u, slug, pid in re.findall(r'href="(/fr/([a-z0-9.\-]+)/(\d{5,8})\.html)[^"]*"', page.decode('utf-8', 'replace')):
                    products.setdefault(pid, {'code': pid, 'kind': 'racquet', 'url': BABOLAT_BASE + u,
                                              'name': slug.replace('-', ' '), 'thumb': None})
    return sorted(products.values(), key=lambda p: p['code'])


def facts_babolat(page: str, prod: dict) -> dict:
    text = page_text(page)
    facts: dict = {'_text': text}
    m = re.search(r'Taille du tamis (\d{3}) cm²', text)
    if m:
        facts['headSize'] = round(int(m.group(1)) / 6.4516, 1)
    m = re.search(r'Plan de cordage (\d+)x(\d+)', text)
    if m:
        facts['stringPattern'] = f'{m.group(1)}x{m.group(2)}'
    m = re.search(r'Poids \(non cordée\) (\d{3}) g', text)
    if m:
        facts['weight'] = int(m.group(1))
    m = re.search(r'Rigidité \(RA\) (\d{2})', text)
    if m:
        facts['stiffness'] = int(m.group(1))
    prods = [p for p in ld_products(page) if p.get('sku') or p.get('mpn')]
    if prods:
        facts['title'] = html.unescape(prods[0].get('name', ''))
        img = prods[0].get('image')
        entry = img[0] if isinstance(img, list) and img else img
        if isinstance(entry, str):
            facts['image'] = srcset_best(entry)
    # Sélecteur de coloris : « Coloris Noir selected » (un seul libellé suivi de « selected » ;
    # le premier « Coloris » de la page est l'en-tête du produit, pas le sélecteur).
    for seg in reversed(re.findall(r'Coloris (.{1,90}?) (?=Label -->|Jauge)', text) if prod.get('kind') == 'string' else []):
        words = seg.split()
        if 'selected' in words and words.index('selected') > 0 and len(seg) < 60:
            k = words.index('selected')
            facts['color'] = words[k - 1]
            facts['colourOptions'] = [w for w in words if w != 'selected']
            break
    m = re.search(r'Jauge Sélectionner Jauge ((?:\d{3} ?)+)', text)
    if m:
        facts['gaugesMm'] = [g for g in (gauge_mm(x) for x in m.group(1).split()) if g]
    return facts


# --------------------------------------------------------------------------
# Tecnifibre (www.tecnifibre.com, boutique Shopify FR)
# --------------------------------------------------------------------------
# robots.txt (10/10/2026) : plan du site publié, pages « collection » et « produit » autorisées,
# aucune directive de débit. Découverte par les pages « collection » du menu.
TECNIFIBRE_BASE = 'https://www.tecnifibre.com'
TECNIFIBRE_RACQUET_COLLECTIONS = [
    '/collections/raquettes-de-tennis', '/collections/raquettes-t-fight', '/collections/tf-40',
    '/collections/raquettes-tempo', '/collections/raquettes-de-tennis-junior',
    '/collections/outlet-raquettes-de-tennis', '/collections/raquettes-de-tennis-fire',
    '/collections/raquettes-t-fight-team',
]
TECNIFIBRE_STRING_COLLECTIONS = [
    '/collections/cordages-tennis', '/collections/cordages-de-tennis-monofilament',
    '/collections/cordages-de-tennis-multifilament',
]


def shopify_handles(page: str) -> list[str]:
    """Handles produit cités par une page Shopify (liens ou JSON, barres obliques échappées comprises)."""
    text = page.replace('\\/', '/')
    seen: list[str] = []
    for h in re.findall(r'/products/([a-z0-9][a-z0-9\-]*)', text):
        if h not in seen:
            seen.append(h)
    return seen


def discover_tecnifibre(fetch, cache) -> list[dict]:
    products: dict[str, dict] = {}
    for kind, seeds in (('racquet', TECNIFIBRE_RACQUET_COLLECTIONS), ('string', TECNIFIBRE_STRING_COLLECTIONS)):
        for path in seeds:
            body = fetch(TECNIFIBRE_BASE + path, cache / 'catpages' / (re.sub(r'[^A-Za-z0-9]+', '_', path) + '.html'))
            if body is None:
                continue
            for h in shopify_handles(body.decode('utf-8', 'replace')):
                if re.search(r'(carte-cadeau|sac|bag|balle|grip|antivibr|bumper|textile|polo|short|jupe|t-shirt|sweat|veste|casquette|squash|padel|pickleball)', h):
                    continue
                products.setdefault(h, {'code': h, 'kind': kind, 'url': f'{TECNIFIBRE_BASE}/products/{h}',
                                        'name': h.replace('-', ' '), 'thumb': None})
    return sorted(products.values(), key=lambda p: p['code'])


def facts_tecnifibre(page: str, prod: dict) -> dict:
    text = page_text(page)
    facts: dict = {'_text': text}
    m = re.search(r'Taille du tamis (\d{3,4}) ?cm² / (\d{2,3}) ?in²', text)
    if m:
        facts['headSize'] = float(m.group(2))
    m = re.search(r'Plan de cordage (\d+)x(\d+)', text)
    if m:
        facts['stringPattern'] = f'{m.group(1)}x{m.group(2)}'
    m = re.search(r'Poids de la raquette (\d{3}) ?g', text)
    if m:
        facts['weight'] = int(m.group(1))
    if prod.get('kind') == 'string':
        m = re.search(r'Jauge (\d[.,]\d{1,2})', text)
        if m:
            facts['gaugesMm'] = [gauge_mm(m.group(1).replace(',', '.').ljust(4, '0'))]
        # Coloris : suffixe du handle publié (garniture-xr3-naturel) ; à défaut « Coloris rouge » du texte
        tail = prod['code'].split('-')[-1]
        if tail in FR_EN_COLOURS:
            facts['color'] = tail
        else:
            m = re.search(r'Coloris ([A-Za-zéèêàç]+)', text)
            if m and m.group(1).lower() in FR_EN_COLOURS:
                facts['color'] = m.group(1)
    m = re.search(r'<meta property="og:image" content="([^"]+)"', page)
    if m:
        facts['image'] = html.unescape(m.group(1))
    m = re.search(r'<meta property="og:title" content="([^"]+)"', page) or re.search(r'<title>([^<]+)</title>', page)
    if m:
        facts['title'] = html.unescape(m.group(1)).strip()
    return facts


# --------------------------------------------------------------------------
# Yonex (www.yonex.com, Magento, site « US »)
# --------------------------------------------------------------------------
# robots.txt (10/10/2026) : ni /tennis/ ni /media/ interdits (seuls /catalog/product/view/, la
# recherche et les paramètres de tri/filtre le sont) ; le commentaire « Crawl-Delay: 3 » est
# désactivé, mais nous gardons >= 3 s. Pages « catégorie » du menu -> pages produit.
YONEX_BASE = 'https://www.yonex.com'
YONEX_RACQUET_CATEGORIES = ['ezone', 'vcore', 'percept', 'astrel', 'junior', 'muse']
YONEX_STRING_CATEGORIES = ['polyester', 'multifilament', 'synthetic-gut']


def discover_yonex(fetch, cache) -> list[dict]:
    products: dict[str, dict] = {}
    plan = [('racquet', f'/tennis/racquets/{c}') for c in YONEX_RACQUET_CATEGORIES] + \
           [('string', f'/tennis/strings/{c}') for c in YONEX_STRING_CATEGORIES]
    for kind, path in plan:
        body = fetch(YONEX_BASE + path, cache / 'catpages' / (re.sub(r'[^A-Za-z0-9]+', '_', path) + '.html'))
        if body is None:
            continue
        page = body.decode('utf-8', 'replace')
        folder = 'racquets' if kind == 'racquet' else 'strings'
        pat = r'href="(https://www\.yonex\.com/tennis/' + folder + r'/[a-z0-9\-]+/[a-z0-9\-]+)"'
        for url in re.findall(pat, page):
            slug = url.rsplit('/', 1)[-1]
            products.setdefault(url.split('/tennis/')[-1].replace('/', '--'), {
                'code': url.split('/tennis/')[-1].replace('/', '--'), 'kind': kind, 'url': url,
                'name': slug.replace('-', ' '), 'thumb': None})
    return sorted(products.values(), key=lambda p: p['code'])


def facts_yonex(page: str, prod: dict) -> dict:
    text = page_text(page)
    facts: dict = {'_text': text}
    m = re.search(r'Head Size (\d{2,3}) sq\.in\.', text)
    if m:
        facts['headSize'] = float(m.group(1))
    m = re.search(r'Stringing Pattern (\d+) x (\d+)', text)
    if m:
        facts['stringPattern'] = f'{m.group(1)}x{m.group(2)}'
    m = re.search(r'Weight (\d{3}) g', text)
    if m and prod.get('kind') == 'racquet':
        facts['weight'] = int(m.group(1))
    m = re.search(r'Color\(s\) ([A-Za-z ,/&-]{2,80}?) (?:Recommended|Stringing|Made|Item|Material|Grip|Length|Gauge)', text)
    if m:
        facts['colourOptions'] = [c.strip() for c in m.group(1).split(',') if c.strip()]
        if len(facts['colourOptions']) == 1:
            facts['color'] = facts['colourOptions'][0]
    if prod.get('kind') == 'string':
        m = re.search(r'Gauge (.+?) Length', text)
        if m:
            facts['gaugesMm'] = [f'{a}.{b}' for a, b in re.findall(r'(\d)\.(\d{2}) ?mm', m.group(1))]
    # Image PUBLIÉE du produit : parmi les médias catalogue de la page, ceux dont le nom contient
    # un code article (« Item Code ») ; la variante publiée la plus large (600 px pour les raquettes,
    # 240 px pour les cordages : aucune autre n'est publiée, aucune URL n'est modifiée).
    codes = {c.lower() for c in re.findall(r'\b([0-9A-Z]{5,12})\b', (re.search(r'Item Code (.+?) (?:Skip|Description|Compare)', text) or [None, ''])[1])}
    best = None
    for u in re.findall(r'https://www\.yonex\.com/media/catalog/product/[^"\s\']+', html.unescape(page)):
        w = re.search(r'[?&]width=(\d+)', u)
        name = u.split('/')[-1].split('?')[0].lower()
        if w and any(c in name for c in codes) and (best is None or int(w.group(1)) > best[0]):
            best = (int(w.group(1)), u)
    if best:
        facts['image'] = best[1]
    m = re.search(r'<h1[^>]*>(.*?)</h1>', page, flags=re.S)
    t = re.search(r'<meta property="og:title" content="([^"]+)"', page) or re.search(r'<title>([^<]+)</title>', page)
    facts['title'] = html.unescape(re.sub(r'<[^>]+>|\s+', ' ', m.group(1))).strip() if m else (html.unescape(t.group(1)).strip() if t else None)
    return facts


# --------------------------------------------------------------------------
# Registre
# --------------------------------------------------------------------------
DISCOVER = {'wilson': discover_wilson, 'luxilon': discover_luxilon, 'babolat': discover_babolat,
            'tecnifibre': discover_tecnifibre, 'yonex': discover_yonex}
FACTS = {'wilson': facts_wilson, 'luxilon': facts_luxilon, 'babolat': facts_babolat,
         'tecnifibre': facts_tecnifibre, 'yonex': facts_yonex}


def facts(brand: str, page: str, prod: dict) -> dict:
    return FACTS[brand](page, prod)


def image_url(brand: str, page: str, prod: dict, fct: dict) -> str | None:
    """URL de l'image principale PUBLIÉE (jamais composée) ; None si introuvable."""
    return fct.get('image') or prod.get('thumb')


def year_tokens(s: str) -> set[str]:
    return set(re.findall(r'20[12]\d', s))


def version_tokens(s: str) -> set[str]:
    return set(re.findall(r'\bv\s?(\d{1,2})\b', s.lower()))


def check(brand: str, kind: str, item: dict, prod: dict, fct: dict, decision: dict) -> str | None:
    """Raison de quarantaine, ou None si l'association tient (tout ce qui n'est pas
    vérifiable sur la page officielle n'est pas présumé conforme)."""
    name = f"{prod.get('name', '')} {fct.get('title') or ''}"
    ours = f"{item.get('model', '')} {item.get('variant') or ''} {item['id']}"
    # Millésime et génération : la fiche et la page officielle doivent dire la même chose.
    y_page, y_ours = year_tokens(name), year_tokens(ours)
    if y_page and y_ours and not (y_page & y_ours):
        return f"millésime {'/'.join(sorted(y_page))} de la page != fiche {'/'.join(sorted(y_ours))}"
    v_page, v_ours = version_tokens(name), version_tokens(ours)
    if v_page and v_ours and not (v_page & v_ours):
        return f"génération v{'/'.join(sorted(v_page))} de la page != fiche v{'/'.join(sorted(v_ours))}"
    if kind == 'racquet':
        hs, sp, w = fct.get('headSize'), fct.get('stringPattern'), fct.get('weight')
        # Exception documentée : la page officielle ne publie NI tamis NI plan de cordage (gamme
        # junior prétendue) ; l'association repose alors sur le nom complet (série, taille,
        # génération lue dans l'intitulé) et sur le poids non cordé, à +-5 g. Décision humaine,
        # consignée dans le mapping (`identification`).
        by_name = decision.get('identification') == 'nom+poids' and hs is None and sp is None and w is not None
        if not by_name and (hs is None or sp is None or w is None):
            return 'tamis, plan de cordage ou poids non cordé illisible sur la page officielle'
        if hs is not None and abs(hs - float(item['headSize'])) > 0.6:
            return f"tamis officiel {hs:g} in² != fiche {item['headSize']} in²"
        if sp is not None and item.get('stringPattern') and sp != item['stringPattern']:
            return f"plan de cordage officiel {sp} != fiche {item['stringPattern']}"
        if item.get('weight') and abs(w - item['weight']) > 5:
            return f"poids non cordé officiel {w} g != fiche {item['weight']} g"
        ra, ours_ra = fct.get('stiffness'), item.get('stiffness')
        if ra is not None and ours_ra is not None and abs(ra - ours_ra) > 2:
            return f"RA officielle {ra} != fiche {ours_ra} (génération probablement différente)"
        return None
    shown = fct.get('gaugesMm') or []
    if not shown:
        return 'jauge illisible sur la page officielle'
    ours_g = {round(float(g), 2) for gs in item.get('gauges', []) for g in gs.split('/') if re.match(r'^\d\.\d+$', g)}
    page_g = {round(float(g), 2) for g in shown}
    if len(shown) > 1:
        # page multi-jauges : une même photo sert toutes les jauges, la fiche ne doit pas en annoncer
        # une que le produit officiel n'a pas
        if not ours_g <= page_g:
            return f"jauge(s) de la fiche ({', '.join(item.get('gauges', []))}) absente(s) du produit officiel ({'/'.join(shown)} mm)"
    elif not page_g <= ours_g:
        return f"jauge officielle {'/'.join(shown)} mm absente de la fiche ({', '.join(item.get('gauges', []))})"
    colour = fct.get('color')
    if colour:
        if not (colour_set(colour) & colour_set(item.get('color') or '')):
            return f"coloris officiel « {colour} » != fiche « {item.get('color')} »"
        return None
    options = fct.get('colourOptions') or []
    if len(options) > 1:
        # plusieurs coloris sous la même fiche officielle : la photo n'en montre qu'un. Le coloris de la
        # fiche doit exister ET être celui du visuel (attesté à la main : `colourVisual`).
        if not any(colour_set(o) & colour_set(item.get('color') or '') for o in options):
            return f"coloris de la fiche « {item.get('color')} » absent des coloris officiels ({', '.join(options)})"
        if not decision.get('colourVisual'):
            return f"plusieurs coloris officiels ({', '.join(options)}) ; la photo n'en montre qu'un, non attesté"
        return None
    if not decision.get('colourVisual'):
        return 'coloris non publié par la page officielle : association non vérifiable'
    return None
