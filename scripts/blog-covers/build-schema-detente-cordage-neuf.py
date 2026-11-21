"""Schéma de la section « cordage neuf qui perd de la tension » (FR et EN).

Écrit deux SVG dans public/blog/images/, au format des schémas du blog
(symbole « schema » appelé par <use>, couleurs par variables --tsa-* de
public/blog/blog-figures.css, texte en currentColor) :

- schema-detente-cordage-neuf-{fr,en}.svg : tension d'une corde seule, tendue
  puis serrée à longueur fixe sur un banc, en fonction du temps (échelle
  logarithmique). Seuls les trois points écrits dans le texte de Cross et
  Bower sont tracés, pour chacune des deux tensions de départ (dossier
  docs/redaction/combien-de-temps-dure-un-cordage.md, fait F5) :
    28,0 kg -> 24,8 kg après 1 000 s -> 21,9 kg après 72 h ;
    18,0 kg -> 15,86 kg après 1 000 s -> 14 kg après 72 h.
  Le départ est placé à 10 s (la corde est restée 10 s à la tension).
  Entre 1 000 s et 72 h, la source décrit une décroissance linéaire en
  logarithme du temps : trait plein. Entre le départ et 1 000 s, la source
  ne publie pas de point intermédiaire : trait pointillé.
  La figure 3 de l'article n'est pas numérisée.

Usage : python scripts/blog-covers/build-schema-detente-cordage-neuf.py
"""
from __future__ import annotations

import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "blog" / "images"
FONT = "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"

A1 = "var(--tsa-a1,#047857)"
A3 = "var(--tsa-a3,#1d4ed8)"
MUTED = "var(--tsa-muted,#4b5563)"
GRID = "var(--tsa-grid,#d1d5db)"
CARD = "var(--tsa-card,#ffffff)"

T72H = 72 * 3600  # 259 200 s

# (temps en secondes, tension en kg, libellé FR, libellé EN) — F5, Cross et Bower 2001
SERIES = [
    ("28", A1, [(10, 28.0, "28,0", "28.0"), (1000, 24.8, "24,8", "24.8"), (T72H, 21.9, "21,9", "21.9")]),
    ("18", A3, [(10, 18.0, "18,0", "18.0"), (1000, 15.86, "15,86", "15.86"), (T72H, 14.0, "14", "14")]),
]

LABELS = {
    "fr": {
        "title": "Tension d'une corde seule serrée à longueur fixe, en fonction du temps : de 28,0 à 24,8 kg après 1 000 secondes puis 21,9 kg après 72 heures ; de 18,0 à 15,86 kg puis 14 kg",
        "legend": ("tendue à 28,0 kg", "tendue à 18,0 kg"),
        "yaxis": "Tension (kg)",
        "xaxis": "Temps écoulé (échelle logarithmique)",
        "ticks": ("départ (10 s)", "1 000 s ≈ 17 min", "72 h"),
    },
    "en": {
        "title": "Tension of a single string clamped at fixed length, over time: from 28.0 to 24.8 kg after 1,000 seconds, then 21.9 kg after 72 hours; from 18.0 to 15.86 kg, then 14 kg",
        "legend": ("pulled to 28.0 kg", "pulled to 18.0 kg"),
        "yaxis": "Tension (kg)",
        "xaxis": "Elapsed time (log scale)",
        "ticks": ("start (10 s)", "1,000 s ≈ 17 min", "72 h"),
    },
}


def text(x: float, y: float, s: str, size: float = 17, anchor: str = "start", weight: str = "normal", muted: bool = False) -> str:
    fill = f'style="fill:{MUTED}"' if muted else 'fill="currentColor"'
    return f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" text-anchor="{anchor}" font-weight="{weight}" {fill}>{s}</text>'


def wrap(title: str, w: int, h: int, body: list[str]) -> str:
    return "\n".join([
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">',
        f"<title>{title}</title>",
        f'<symbol id="schema" viewBox="0 0 {w} {h}">',
        f'<g font-family="{FONT}">',
        *body,
        "</g>",
        "</symbol>",
        f'<use href="#schema" width="{w}" height="{h}"/>',
        "</svg>",
        "",
    ])


def build(lang: str) -> str:
    t = LABELS[lang]
    w, h = 640, 380
    x0, x1 = 64.0, 600.0
    top, bottom = 70.0, 300.0
    vmin, vmax = 10.0, 30.0
    lmin, lmax = math.log10(10), math.log10(T72H)

    def sx(sec: float) -> float:
        return x0 + (math.log10(sec) - lmin) / (lmax - lmin) * (x1 - x0)

    def sy(kg: float) -> float:
        return bottom - (kg - vmin) / (vmax - vmin) * (bottom - top)

    body: list[str] = []
    # légende (deux séries : toujours présente)
    body.append(f'<rect x="{x0:.1f}" y="12" width="16" height="16" rx="3" style="fill:{A1}"/>')
    body.append(text(x0 + 24, 26, t["legend"][0]))
    lx = 330.0
    body.append(f'<rect x="{lx:.1f}" y="12" width="16" height="16" rx="3" style="fill:{A3}"/>')
    body.append(text(lx + 24, 26, t["legend"][1]))
    body.append(text(x0 - 8, top - 18, t["yaxis"], 16, muted=True, anchor="start"))
    # grille horizontale et graduations en kg
    for v in range(10, 31, 5):
        y = sy(v)
        body.append(f'<line x1="{x0:.1f}" y1="{y:.1f}" x2="{x1:.1f}" y2="{y:.1f}" style="stroke:{GRID};stroke-width:1;fill:none"/>')
        body.append(text(x0 - 10, y + 6, str(v), 16, "end", muted=True))
    # repères verticaux : décades, sans libellé (l'échelle est logarithmique)
    for sec in (100, 10_000, 100_000):
        x = sx(sec)
        body.append(f'<line x1="{x:.1f}" y1="{top:.1f}" x2="{x:.1f}" y2="{bottom:.1f}" style="stroke:{GRID};stroke-width:1;stroke-dasharray:2 4;fill:none"/>')
    # repères aux trois instants publiés, libellés
    for (sec, anchor), label in zip(((10, "start"), (1000, "middle"), (T72H, "end")), t["ticks"]):
        x = sx(sec)
        body.append(f'<line x1="{x:.1f}" y1="{top:.1f}" x2="{x:.1f}" y2="{bottom + 6:.1f}" style="stroke:{GRID};stroke-width:1.5;fill:none"/>')
        body.append(text(x, bottom + 26, label, 16, anchor, muted=True))
    body.append(text((x0 + x1) / 2, bottom + 58, t["xaxis"], 16, "middle", muted=True))
    # courbes
    for key, colour, pts in SERIES:
        (s0, v0, *_), (s1, v1, *_), (s2, v2, *_) = pts
        body.append(f'<line x1="{sx(s0):.1f}" y1="{sy(v0):.1f}" x2="{sx(s1):.1f}" y2="{sy(v1):.1f}" style="stroke:{colour};stroke-width:3;stroke-dasharray:6 6;fill:none;stroke-linecap:round"/>')
        body.append(f'<line x1="{sx(s1):.1f}" y1="{sy(v1):.1f}" x2="{sx(s2):.1f}" y2="{sy(v2):.1f}" style="stroke:{colour};stroke-width:3;fill:none;stroke-linecap:round"/>')
        above = key == "28"
        for i, (sec, kg, lab_fr, lab_en) in enumerate(pts):
            x, y = sx(sec), sy(kg)
            body.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="6" style="fill:{colour};stroke:{CARD};stroke-width:2"/>')
            anchor = "start" if i == 0 else ("end" if i == 2 else "middle")
            dx = 4 if i == 0 else (-4 if i == 2 else 0)
            dy = -14 if above else 28
            body.append(text(x + dx, y + dy, lab_fr if lang == "fr" else lab_en, 17, anchor, weight="600"))
    return wrap(t["title"], w, h, body)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for lang in ("fr", "en"):
        path = OUT / f"schema-detente-cordage-neuf-{lang}.svg"
        path.write_text(build(lang), encoding="utf-8", newline="\n")
        print(path.relative_to(ROOT))


if __name__ == "__main__":
    main()
