#!/usr/bin/env python3
"""
Photos fournies à la main par Pierre (consigne de l'orchestrateur du 22/10/2026) : même pipeline que les
sources collectées (association contrôlée contre la fiche, aplatissement sur blanc, recadrage, manifeste,
crédit, purge par source), sous la source « upload:pierre ». Aucune connexion réseau.

Dossier d'entrée, HORS du dépôt (recommandé : C:\\Users\\plene\\Documents\\TSA_photos_a_importer\\) :
  <id de la fiche>.<jpg|jpeg|png|webp>   une image par fiche, nommée par l'id exact de la fiche
  photos.json                           une entrée par image (modèle : docs/photos-a-importer/modele-photos.json)

  python scripts/scraper/tw_product_images.py import-upload [<dossier>]   # contrôle, copie, décision au mapping
  python scripts/scraper/tw_product_images.py build                       # images et manifeste
  python scripts/scraper/tw_product_images.py purge upload:pierre         # retrait de tous les envois

Ce que l'import REFUSE (l'image n'entre pas) : id inconnu, fichier mal nommé ou absent, format hors liste,
page d'origine absente ou issue d'un moteur de recherche (un moteur n'est pas une source), mention
« watermark » dans une URL, attestation « sansFiligrane » absente, « fourniParPierre » ou « droits » absents
(Pierre prend la responsabilité des droits, comme pour les décisions du 29/09 et du 10/10), crédit absent ou
crédit au nom d'une marque pour une image prise ailleurs que sur un site de cette marque, caractéristiques
d'association absentes. Ce que le build met en QUARANTAINE : tamis, plan, poids, RA, jauge, coloris ou
génération déclarés qui contredisent la fiche (mêmes règles que les sites de marque). Ce qui est SIGNALÉ
(avertissement au mapping et au rapport) : génération de la photo que la fiche ne permet pas de vérifier.
"""
from __future__ import annotations

import json
import re
import shutil
import urllib.parse
from pathlib import Path

import fabricants_images as fab

SOURCE = 'upload:pierre'
ALLOWED_EXT = ('.jpg', '.jpeg', '.png', '.webp')
METADATA = 'photos.json'
SEARCH_ENGINE_RE = re.compile(r'(^|\.)(google|bing|yandex|duckduckgo|baidu|qwant|yahoo|ecosia|startpage|tineye)\.', re.I)
REQUIRED = ('id', 'fichier', 'pageOrigine', 'credit', 'fourniParPierre', 'droits', 'date', 'sansFiligrane', 'intitule')


def _host(url: str) -> str:
    return (urllib.parse.urlsplit(url).hostname or '').lower()


def _tokens(s: str) -> str:
    return re.sub(r'[^a-z0-9]', '', s.lower().replace('ö', 'o'))


def validate(entry: dict, item: dict | None, kind: str | None, folder: Path, brands: set[str]) -> list[str]:
    """Raisons de refus d'une entrée de photos.json (liste vide = acceptée à l'import)."""
    errs = [f'champ « {k} » absent' for k in REQUIRED if entry.get(k) in (None, '')]
    pid = entry.get('id') or '?'
    if item is None:
        return errs + [f'id « {pid} » inconnu du catalogue']
    name = entry.get('fichier') or ''
    stem, ext = Path(name).stem, Path(name).suffix.lower()
    if stem != pid or ext not in ALLOWED_EXT:
        errs.append(f'fichier « {name} » : attendu « {pid}.<jpg|jpeg|png|webp> »')
    elif not (folder / name).is_file():
        errs.append(f'fichier « {name} » absent du dossier')
    urls = [u for u in (entry.get('pageOrigine'), entry.get('imageOrigine')) if u]
    for u in urls:
        if not str(u).startswith('https://'):
            errs.append(f'URL non https : {u}')
        elif SEARCH_ENGINE_RE.search(_host(u)):
            errs.append(f'URL de moteur de recherche ({_host(u)}) : donner la page d\'origine de l\'image')
        if re.search(r'watermark|filigrane', str(u), re.I):
            errs.append(f'URL qui annonce un filigrane : {u}')
    if entry.get('fourniParPierre') is not True:
        errs.append('« fourniParPierre » doit valoir true')
    if entry.get('sansFiligrane') is not True:
        errs.append('« sansFiligrane » doit valoir true (une image filigranée est écartée, jamais retouchée)')
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', str(entry.get('date') or '')):
        errs.append('« date » au format AAAA-MM-JJ')
    credit = str(entry.get('credit') or '').strip()
    page_host = _host(entry.get('pageOrigine') or '')
    for b in brands:
        if _tokens(credit) == _tokens(b) and _tokens(b) not in _tokens(page_host):
            errs.append(f'crédit « {credit} » pour une image prise sur {page_host or "?"} : nommer la source réelle')
    if kind == 'racquet':
        if not isinstance(entry.get('tamis'), (int, float)):
            errs.append('raquette : « tamis » (in², nombre) absent')
        if not re.fullmatch(r'\d{2}x\d{2}', str(entry.get('plan') or '')):
            errs.append('raquette : « plan » (ex. 16x19) absent')
        if not isinstance(entry.get('poids'), int):
            errs.append('raquette : « poids » non cordé (g, entier) absent')
    elif kind == 'string':
        if not re.fullmatch(r'\d\.\d{2}(/\d\.\d{2})?', str(entry.get('jauge') or '')):
            errs.append('cordage : « jauge » (mm, ex. 1.25 ; hybride : 1.25/1.30) absente')
        if not str(entry.get('coloris') or '').strip():
            errs.append('cordage : « coloris » présenté par la photo absent')
    return errs


def generation_warning(item: dict, entry: dict) -> str | None:
    """Avertissement (pas un refus) quand la génération de la photo n'est pas vérifiable sur la fiche."""
    ours = f"{item.get('model', '')} {item.get('variant') or ''} {item['id']}"
    photo = f"{entry.get('intitule', '')} {entry.get('generation') or ''}"
    p_tok = fab.year_tokens(photo) | {f'v{v}' for v in fab.version_tokens(photo)}
    o_tok = fab.year_tokens(ours) | {f'v{v}' for v in fab.version_tokens(ours)}
    if p_tok and not o_tok:
        return f"génération de la photo ({', '.join(sorted(p_tok))}) que la fiche ne précise pas : à vérifier"
    if o_tok and not p_tok:
        return f"génération de la fiche ({', '.join(sorted(o_tok))}) non attestée par l'envoi : à vérifier"
    return None


def decision_from(entry: dict, item: dict, kind: str) -> dict:
    """Décision du mapping (versionnée) : attestations de Pierre, recopiées telles quelles."""
    d = {'source': SOURCE, 'code': entry['fichier'], 'page': entry['pageOrigine'], 'credit': str(entry['credit']).strip(),
         'droits': entry['droits'], 'date': entry['date'], 'sansFiligrane': True, 'intitule': entry['intitule']}
    for k in ('imageOrigine', 'generation', 'tamis', 'plan', 'poids', 'ra', 'jauge', 'coloris'):
        if entry.get(k) not in (None, ''):
            d[k] = entry[k]
    if kind == 'string':
        gauges = {g for gs in item.get('gauges') or [] for g in gs.split('/')}
        if len(gauges) > 1 and '/' not in entry['jauge']:
            d['shownGauge'] = entry['jauge']
        if not item.get('color'):
            d['shownColour'] = str(entry['coloris']).strip()
            d['colourVisual'] = True  # coloris attesté par Pierre ; la fiche n'en fixe aucun
    warning = generation_warning(item, entry)
    if warning:
        d['avertissement'] = warning
    return d


def check(kind: str, item: dict, decision: dict) -> str | None:
    """Association contre la fiche : mêmes règles que les sites de marque (fabricants_images.check)."""
    if decision.get('sansFiligrane') is not True:
        return 'envoi sans attestation « sansFiligrane »'
    facts: dict = {'title': f"{decision.get('intitule', '')} {decision.get('generation') or ''}".strip()}
    if kind == 'racquet':
        facts.update(headSize=float(decision['tamis']), stringPattern=decision['plan'], weight=int(decision['poids']))
        if decision.get('ra') is not None:
            facts['stiffness'] = int(decision['ra'])
    else:
        facts['gaugesMm'] = str(decision['jauge']).split('/')
        if item.get('color'):
            facts['color'] = decision['coloris']
    return fab.check('upload', kind, item, {'name': decision.get('intitule', '')}, facts, decision)


def import_folder(folder: Path, base: dict, mapping_ids: dict[str, str], raw_dir: Path) -> tuple[dict, list[dict]]:
    """Lit photos.json, refuse ou accepte chaque entrée, copie l'image acceptée dans le cache du collecteur.
    Renvoie ({section: {id: décision}}, rapport)."""
    entries = json.loads((folder / METADATA).read_text(encoding='utf-8'))
    if not isinstance(entries, list):
        raise SystemExit(f'{METADATA} doit contenir une liste d\'entrées')
    items = {it['id']: ('racquet', it) for it in base['racquets']} | {it['id']: ('string', it) for it in base['strings']}
    brands = {it['brand'] for _, it in items.values()}
    decisions: dict[str, dict] = {'racquets': {}, 'strings': {}}
    report = []
    for entry in entries:
        kind, item = items.get(entry.get('id'), (None, None))
        errs = validate(entry, item, kind, folder, brands)
        if errs:
            report.append({'id': entry.get('id'), 'statut': 'refusé', 'raisons': errs})
            continue
        if entry['id'] not in mapping_ids:
            report.append({'id': entry['id'], 'statut': 'refusé', 'raisons': ['aucune ligne pour cette fiche au mapping']})
            continue
        decision = decision_from(entry, item, kind)
        raw_dir.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(folder / entry['fichier'], raw_dir / entry['fichier'])
        decisions['racquets' if kind == 'racquet' else 'strings'][entry['id']] = decision
        report.append({'id': entry['id'], 'statut': 'importé', 'avertissement': decision.get('avertissement'),
                       'association': check(kind, item, decision) or 'conforme'})
    return decisions, report
