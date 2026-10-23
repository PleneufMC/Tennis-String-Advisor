#!/usr/bin/env python3
"""
Photos de DÉTAILLANTS -> public/images/products/ (consigne de Pierre du 23/10/2026).

Consigne de Pierre, relayée textuellement par l'orchestrateur : « Vous vous débrouillez pour mettre les photos
des articles manquants. Vous les trouvez où vous voulez mais ça doit être présent sur chaque fiche. Aucun
fabricant ne me reprochera de faire la publicité gratuite de son matériel. » La question de droit est tranchée
par Pierre ; les conditions d'utilisation de chaque détaillant sont relevées, texte exact, dans la PR.

Ce qui ne change pas (règles techniques, pas de droit) : robots.txt, agents.md et llms.txt lus avant toute
page, robot nommé « agent automatisé », 3 s minimum par hôte, premier 403/406/429 ou page anti-robot = arrêt
et hôte consigné, aucun contournement (un site de marque fermé ne se lit pas par un autre domaine). Ce module
ne contient QUE la logique propre à chaque site ; il n'ouvre aucune connexion (tout passe par
`tw_product_images.fetch`).

Source `detaillant:<site>` au manifeste, crédit « Photo : <détaillant> » (la source réelle, jamais la
marque). Mêmes règles d'association que pour les sites de marque (`fabricants_images.check`) : millésime et
génération lus dans l'intitulé, tamis, plan, poids non cordé, RA quand elle est publiée, jauge, coloris ;
tout désaccord ou toute caractéristique illisible = quarantaine. Packshot seulement : ni joueur ni filigrane
(relecture de la planche-contact). Bobines (« Reel ») et demi-garnitures écartées : la photo montre la
garniture vendue.
"""
from __future__ import annotations

import html
import re

import fabricants_images as fab

DET_PREFIX = 'detaillant:'

# Libellé du crédit (« Photo : <label> ») ; hôte des pages (politique d'accès lue le 23/10/2026).
SITES: dict[str, dict] = {
    # agents.md et llms.txt absents (404), robots.txt : pages produit et catégories autorisées ; conditions
    # (« 3/ OWNERSHIP OF RIGHTS ») relues le 23/10/2026.
    'racquetdepot': {'label': 'Racquet Depot', 'host': 'www.racquetdepot.co.uk'},
}


def is_det(source: str) -> bool:
    return source.startswith(DET_PREFIX) and source[len(DET_PREFIX):] in SITES


def site_of(source: str) -> str:
    return source[len(DET_PREFIX):]


def source_label(source: str) -> str:
    return SITES[site_of(source)]['label']


# --------------------------------------------------------------------------
# Racquet Depot (www.racquetdepot.co.uk, boutique BigCommerce)
# --------------------------------------------------------------------------
# Navigation : la page « tennis-strings » liste les catégories par marque (« <marque>-tennis-strings ») ;
# chaque catégorie est paginée (liens « Page N of M » publiés dans la page, jamais composés). Une page
# produit par jauge et par format (« Set », « Half Set », « 200M Reel ») ; seules les garnitures sont gardées.
RD_BASE = 'https://www.racquetdepot.co.uk'
RD_STRINGS = RD_BASE + '/tennis-strings'
RD_CARD_RE = re.compile(r'<a href="(https://www\.racquetdepot\.co\.uk/[^"]+/)"\s*>\s*<div class="card-img-container">\s*'
                        r'<img class="card-image[^"]*"[^>]*?data-src="([^"]+)"[^>]*?title="([^"]+)"', re.S)
RD_SKIP_RE = re.compile(r'\b(Reel|Half Set|Dampeners?|Grommets?)\b', re.I)


def _cards(page: str) -> list[tuple[str, str, str]]:
    return [(u, html.unescape(img), html.unescape(name).strip()) for u, img, name in RD_CARD_RE.findall(page)]


def discover_racquetdepot(fetch, cache) -> list[dict]:
    nav = fetch(RD_STRINGS, cache / 'nav' / 'tennis-strings.html')
    if nav is None:
        raise SystemExit('page « tennis-strings » de Racquet Depot indisponible')
    nav_html = nav.decode('utf-8', 'replace')
    categories = sorted(set(re.findall(r'href="(https://www\.racquetdepot\.co\.uk/[a-z0-9-]+-tennis-strings)"', nav_html)))
    items: dict[str, dict] = {}
    for cat in categories:
        slug = cat.rsplit('/', 1)[1]
        first = fetch(cat, cache / 'cat' / f'{slug}.html')
        if first is None:
            print(f'!  catégorie indisponible : {cat}')
            continue
        pages = [first.decode('utf-8', 'replace')]
        # Pages suivantes : liens publiés par la pagination de la page 1.
        more = sorted({html.unescape(u) for u in re.findall(r'href="(' + re.escape(cat) + r'\?page&#x3D;\d+)"', pages[0])})
        for u in more:
            n = re.search(r'page=(\d+)$', u)
            if not n or n.group(1) == '1':
                continue
            body = fetch(u, cache / 'cat' / f'{slug}-p{n.group(1)}.html')
            if body is not None:
                pages.append(body.decode('utf-8', 'replace'))
        n = 0
        for page in pages:
            for url, thumb, name in _cards(page):
                if RD_SKIP_RE.search(name):
                    continue
                code = url.rstrip('/').rsplit('/', 1)[1]
                items.setdefault(code, {'code': code, 'kind': 'string', 'url': url, 'name': name, 'thumb': thumb,
                                        'categories': [cat]})
                n += 1
        print(f'   {slug} : {n} garnitures')
    return sorted(items.values(), key=lambda p: p['code'])


# Mots de coloris (liste « Colour: Natural, Orange, Grey and Black » de la description : plusieurs coloris vendus
# sous la même page ; la lecture s'arrête au premier mot qui n'en est pas un).
COLOUR_WORDS = {'grey', 'gray', 'natural', 'black', 'white', 'silver', 'green', 'blue', 'red', 'yellow', 'orange', 'pink',
                'purple', 'gold', 'bronze', 'lime', 'navy', 'brown', 'mint', 'lavender', 'teal', 'amber', 'neon', 'ice',
                'petrol', 'anthracite', 'light', 'dark', 'fluo', 'fluoro', 'metallic', 'gun', 'champagne', 'turquoise',
                'aqua', 'cream', 'clear', 'violet', 'burgundy', 'charcoal', 'copper', 'titanium', 'olive', 'sky', 'royal',
                'electric', 'coral', 'magenta', 'ruby', 'pearl', 'graphite', 'off', 'midnight', 'forest', 'ocean', 'desert'}


def colour_list(raw: str) -> list[str]:
    names, cur = [], []
    for tok in re.findall(r"[A-Za-z]+|[,/&]", raw):
        if tok.lower() in COLOUR_WORDS:
            cur.append(tok)
        elif tok in (',', '/', '&') or tok.lower() in ('or', 'and'):
            if cur:
                names.append(' '.join(cur))
            cur = []
        else:
            break
    if cur:
        names.append(' '.join(cur))
    return names


def facts_racquetdepot(page: str, prod: dict) -> dict:
    """Bloc de caractéristiques publié sous la description (« Type: … Colour: … Gauge: 1.25mm Length: Set »), liste
    des coloris de la description quand le bloc n'en donne pas, galerie d'images de la page (une par coloris,
    nom de fichier « …-grey__… »). L'image retenue est celle que désigne la décision (`imageId`, choisie sur la
    planche), sinon l'image annoncée en og:image ; toujours une variante publiée, la plus petite >= 600 px."""
    text = fab.page_text(page)
    facts: dict = {'_text': text}
    m = re.search(r'<h1[^>]*>(.*?)</h1>', page, re.S)
    facts['title'] = html.unescape(re.sub(r'<[^>]+>|\s+', ' ', m.group(1))).strip() if m else None
    spec = re.search(r'Type: ([A-Za-z ]+?) (?:Colour: (.+?) )?(?:Profile: [A-Za-z ]+? )?Gauge: ([\d.]+)mm(?: / [\w.]+)? Length: (\w[\w ]*?) '
                     r'(?:Series|Made In|Reviews)', text)
    colours: list[str] = []
    if spec:
        facts['type'], facts['length'] = spec.group(1), spec.group(4)
        facts['gaugesMm'] = [g for g in [fab.gauge_mm(spec.group(3))] if g]
        colours = colour_list(spec.group(2) or '')
    # Description : « Colour: Natural, Orange, Grey and Black » (le premier « Colour: » de la page peut être
    # l'étiquette du sélecteur, « Colour: (Required) … », qui ne donne aucun coloris).
    for d in ([] if colours else re.finditer(r'Colou?r:\s+(.{1,120})', text)):
        colours = colour_list(d.group(1))
        if colours:
            break
    if len(colours) == 1:
        facts['color'] = colours[0]
    elif colours:
        facts['colourOptions'] = colours
    og = re.search(r'<meta property="og:image" content="([^"]+)"', page)
    ids = re.search(r'/products/(\d+)/images/(\d+)/', og.group(1)) if og else None
    if ids:
        gallery: dict[str, dict] = {}
        rx = r'https://cdn11\.bigcommerce\.com/s-iiwjfnucrp/images/stencil/(\d+)w/products/' + ids.group(1) + r'/(\d+)/([^"\s?,]+)'
        for mm in re.finditer(rx, page):
            w, img, name = int(mm.group(1)), mm.group(2), mm.group(3)
            g = gallery.setdefault(img, {'file': name, 'variants': {}})
            g['variants'][mm.group(0)] = w
        for g in gallery.values():
            wide = sorted((w, u) for u, w in g['variants'].items() if w >= 600)
            g['url'] = (wide[0] if wide else max((w, u) for u, w in g['variants'].items()))[1]
            del g['variants']
        facts['gallery'] = {k: v['file'] for k, v in gallery.items()}
        chosen = prod.get('imageId') or ids.group(2)
        if chosen in gallery:
            facts['image'] = gallery[chosen]['url']
    return facts


# --------------------------------------------------------------------------
# Registre et contrôle
# --------------------------------------------------------------------------
DISCOVER = {'racquetdepot': discover_racquetdepot}
FACTS = {'racquetdepot': facts_racquetdepot}
# Même table que les fabricants pour la planche et les candidats (aucun filtre de marque : un détaillant vend
# toutes les marques ; le nom de marque de la fiche doit figurer dans l'intitulé du produit).
BRANDS = {k: {'label': v['label'], 'catalog_brands': None, 'host': v['host']} for k, v in SITES.items()}


def facts(site: str, page: str, prod: dict) -> dict:
    return FACTS[site](page, prod)


def image_url(site: str, page: str, prod: dict, fct: dict) -> str | None:
    """URL de l'image principale PUBLIÉE par la page (jamais composée) ; None si introuvable."""
    return fct.get('image')


def check(site: str, kind: str, item: dict, prod: dict, fct: dict, decision: dict) -> str | None:
    """Règles des sites de marque (fabricants_images.check), libellées « du détaillant », plus la marque de
    la fiche dans l'intitulé du produit et le format garniture."""
    name = f"{prod.get('name', '')} {fct.get('title') or ''}"
    if not set(fab.alias_tokens(item['brand'])) <= set(fab.alias_tokens(name)):
        return f"marque « {item['brand']} » absente de l'intitulé du détaillant « {prod.get('name')} »"
    if kind == 'string' and fct.get('length') and fct['length'].lower() != 'set':
        return f"format « {fct['length']} » : seule une garniture (Set) est photographiée"
    # Coloris présenté (arbitrage de l'orchestrateur du 23/10/2026, catégorie C) : un cordage peut être montré dans
    # un autre coloris que celui de la fiche ; la photo doit alors montrer CE coloris (vérifié comme celui de la
    # fiche), et la légende le dit.
    if kind == 'string' and decision.get('shownColour'):
        item = dict(item, color=decision['shownColour'])
    reason = fab.check(site, kind, item, prod, fct, decision)
    if reason:
        return re.sub(r'\bofficiel(?:le)?s?\b', 'du détaillant', reason)
    if kind == 'string':
        # Une page par jauge : la photo est celle d'UNE jauge ; si la fiche en liste plusieurs, la légende
        # « jauge présentée » le dit (attestation `shownGauge` du mapping, égale à la jauge de la page).
        shown = fct.get('gaugesMm') or []
        ours = {g for gs in item.get('gauges', []) for g in gs.split('/')}
        hybrid = any('/' in g for g in item.get('gauges', []))
        if len(shown) == 1 and len(ours) > 1 and not hybrid and decision.get('shownGauge') != shown[0]:
            return f"photo de la jauge {shown[0]} sur une fiche à plusieurs jauges : légende « jauge présentée » requise"
    return None
