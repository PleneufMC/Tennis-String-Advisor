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

Étapes
------
  python scripts/scraper/tw_product_images.py discover    # pages catégorie -> catalogue TW
  python scripts/scraper/tw_product_images.py candidates  # aide à la décision (lecture humaine)
  python scripts/scraper/tw_product_images.py build       # pages produit, contrôles, images, manifeste
  python scripts/scraper/tw_product_images.py purge       # RETRAIT : supprime images et manifeste

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
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'scripts' / 'scraper' / 'out'
CACHE = OUT / 'tw-images'
MAPPING = ROOT / 'scripts' / 'scraper' / 'product-images-mapping.json'
QUARANTINE = OUT / 'product-images-quarantaine.json'
MANIFEST_TS = ROOT / 'src' / 'data' / 'product-images.ts'
PUBLIC = ROOT / 'public' / 'images' / 'products'

BASE = 'https://www.tennis-warehouse.com'
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


def fetch(url: str, dest: Path, binary: bool = False) -> bytes | None:
    """GET poli, avec cache disque. Renvoie None si la ressource est indisponible."""
    global _last_request
    if dest.exists() and dest.stat().st_size > 0:
        return dest.read_bytes()
    for attempt in (1, 2):
        wait = MIN_INTERVAL_S - (time.monotonic() - _last_request)
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
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(body)
            return body
        except urllib.error.HTTPError as err:
            print(f'   HTTP {err.code} {url}')
            if err.code in (404, 410) or attempt == 2:
                return None
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
    req = decision.get('requireText')
    if req and not re.search(req, facts.get('_text', '')):
        return f"mention exigée « {req} » introuvable sur la page produit TW"
    if kind == 'racquet':
        hs, sp = facts.get('headSize'), facts.get('stringPattern')
        if hs is None or sp is None:
            return 'tamis ou plan de cordage illisible sur la page TW : association non vérifiable'
        if abs(hs - float(item['headSize'])) > 0.6:
            return f"tamis TW {hs:g} in² != fiche {item['headSize']} in²"
        if item.get('stringPattern') and sp != item['stringPattern']:
            return f"plan de cordage TW {sp} != fiche {item['stringPattern']}"
        # Rigidité : un écart de 4 points RA ou plus signale plus probablement
        # une autre génération de cadre qu'une imprécision de mesure.
        ra, ours = facts.get('stiffness'), item.get('stiffness')
        if ra is not None and ours is not None and abs(ra - ours) >= 4:
            return f"rigidité TW {ra} RA != fiche {ours} RA (génération probablement différente)"
        return None
    # Cordage : la jauge montrée doit figurer dans la fiche, la couleur ne pas la contredire.
    shown = facts.get('gaugesMm') or []
    if not shown:
        return 'jauge illisible sur la page TW : association non vérifiable'
    ours = {g for gs in item.get('gauges', []) for g in gs.split('/')}
    ours_num = {round(float(g), 2) for g in ours if re.match(r'^\d\.\d+$', g)}
    if not all(round(float(g), 2) in ours_num for g in shown):
        return f"jauge TW {'/'.join(shown)} mm absente de la fiche ({', '.join(item.get('gauges', []))})"
    options = facts.get('colorOptions') or []
    tw_color = facts.get('color') or ''
    if facts.get('colourImage'):
        return None  # coloris de la fiche retrouvé parmi les photos de la page TW
    if len(options) > 1 or ',' in tw_color or tw_color.lower() == 'multiple':
        shown_c = ', '.join(options) if len(options) > 1 else tw_color
        return f"plusieurs coloris vendus sous la fiche TW ({shown_c}) ; la photo n'en montre qu'un"
    if not tw_color and len(options) == 1:
        tw_color = options[0]
    our_color = item.get('color') or ''
    if our_color and not tw_color:
        return 'couleur illisible sur la page TW : association non vérifiable'
    if tw_color and our_color and not (color_tokens(tw_color) & color_tokens(our_color)):
        return f"couleur TW « {tw_color} » != fiche « {our_color} »"
    return None


def to_webp(raw: bytes, dest: Path) -> tuple[int, int, int]:
    from PIL import Image
    img = Image.open(io.BytesIO(raw))
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
            prod = catalog.get(decision['code'])
            if prod is None:
                quarantine.append({'id': pid, 'kind': kind,
                                   'reason': f"code {decision['code']} absent des pages catégorie lues"})
                continue
            body = fetch(prod['url'], CACHE / 'descpages' / f"{prod['code']}.html")
            if body is None:
                quarantine.append({'id': pid, 'kind': kind, 'reason': f"page produit indisponible {prod['url']}"})
                continue
            page_html = body.decode('utf-8', 'replace')
            facts = product_facts(page_html)
            if kind == 'string':
                facts['colourImage'] = colour_image(it, facts, page_html, prod['thumb'])
            reason = check(kind, it, decision, facts)
            if reason:
                quarantine.append({'id': pid, 'kind': kind, 'reason': reason,
                                   'twProduct': prod['name'], 'sourcePageUrl': prod['url']})
                continue
            image_url = facts.get('colourImage') or prod['thumb']
            raw_name = re.sub(r'[^A-Za-z0-9_-]+', '_', image_url.split('path=')[-1])
            raw_file = f"{prod['code']}.jpg" if image_url == prod['thumb'] else f"{prod['code']}__{raw_name}.jpg"
            raw = fetch(image_url, CACHE / 'raw' / raw_file, binary=True)
            if raw is None:
                quarantine.append({'id': pid, 'kind': kind, 'reason': f"image indisponible {image_url}"})
                continue
            rel = f'/images/products/{folder}/{pid}.webp'
            w, h, size = to_webp(raw, PUBLIC / folder / f'{pid}.webp')
            prev = (CACHE / 'retrieved.json')
            retrieved = json.loads(prev.read_text(encoding='utf-8')) if prev.exists() else {}
            retrieved.setdefault(prod['code'], today)
            prev.write_text(json.dumps(retrieved, indent=1), encoding='utf-8')
            manifest[pid] = {
                'file': rel, 'width': w, 'height': h, 'bytes': size,
                'sourcePageUrl': prod['url'], 'sourceImageUrl': image_url,
                'retrievedAt': retrieved[prod['code']], 'source': 'tennis-warehouse',
                'twProduct': prod['name'],
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


def write_manifest(manifest: dict) -> None:
    lines = [
        '// FICHIER GÉNÉRÉ par scripts/scraper/tw_product_images.py — ne pas éditer à la main.',
        '//',
        '// Photos produit Tennis Warehouse, hébergées chez nous (public/images/products/).',
        '// Retrait : PRODUCT_IMAGES_ENABLED = false (src/lib/product-images.ts),',
        '// puis : python scripts/scraper/tw_product_images.py purge',
        '',
        "export type ProductImageSource = 'tennis-warehouse';",
        '',
        'export interface ProductImageEntry {',
        '  file: string;',
        '  width: number;',
        '  height: number;',
        '  sourcePageUrl: string;',
        '  sourceImageUrl: string;',
        '  retrievedAt: string;',
        '  source: ProductImageSource;',
        '  /** Intitulé du produit chez TW, pour l\'audit de l\'association. */',
        '  twProduct: string;',
        '}',
        '',
        'export const PRODUCT_IMAGES: Readonly<Record<string, ProductImageEntry>> = {',
    ]
    # Une ligne par produit : le manifeste reste lisible en revue de diff.
    for pid in sorted(manifest):
        e = manifest[pid]
        fields = ', '.join(f'{k}: {json.dumps(e[k], ensure_ascii=False)}' for k in (
            'file', 'width', 'height', 'sourcePageUrl', 'sourceImageUrl', 'retrievedAt', 'source', 'twProduct'))
        lines.append(f'  {json.dumps(pid)}: {{ {fields} }},')
    lines += ['};', '']
    MANIFEST_TS.write_text('\n'.join(lines), encoding='utf-8', newline='\n')


def purge() -> None:
    """Retrait : supprime les images hébergées, le cache brut et vide le manifeste."""
    import shutil
    for path in (PUBLIC, CACHE / 'raw'):
        if path.exists():
            shutil.rmtree(path)
            print(f'   supprimé {path.relative_to(ROOT)}')
    write_manifest({})
    print(f'   manifeste vidé : {MANIFEST_TS.relative_to(ROOT)}')


if __name__ == '__main__':
    step = sys.argv[1] if len(sys.argv) > 1 else ''
    CACHE.mkdir(parents=True, exist_ok=True)
    {'discover': discover, 'candidates': candidates, 'build': build, 'purge': purge}.get(
        step, lambda: sys.exit(__doc__))()
