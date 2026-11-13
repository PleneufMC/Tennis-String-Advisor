"""Schémas de l'article « comparer deux montages de cordage » (FR et EN).

Écrit quatre SVG dans public/blog/images/, au format des schémas du blog
(symbole « schema » appelé par <use>, couleurs par variables --tsa-* de
public/blog/blog-figures.css, texte en currentColor) :

- schema-raideur-tamis-trois-cordages-{fr,en}.svg : barres, raideur du tamis
  sur un même cadre à 60 lb selon le cordage, à la pose puis 24 h plus tard.
  Valeurs : essais de cordage USRSA repris par Tennis Warehouse (dossier
  docs/redaction/comparer-deux-montages-cordage-tension.md, faits F4 et F6).
- schema-meme-consigne-deux-tamis-{fr,en}.svg : schéma de principe, sans
  chiffre et non à l'échelle (aucune mesure n'isole l'effet du tamis, F18).

Usage : python scripts/blog-covers/build-schemas-comparer-montages.py
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


def text(x: float, y: float, s: str, size: float = 18, anchor: str = "start", weight: str = "normal", muted: bool = False) -> str:
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


# --- 1. Barres : trois cordages, même cadre, même consigne -----------------

# (nom du cordage, famille FR, famille EN, raideur à la pose, raideur 24 h après), en unités RDC
STRINGS = [
    ("Tourna Poly Big Hitter 16", "monofilament « poly »", "“poly” monofilament", 69, 65),
    ("Prince Synthetic Gut Original Gold 16", "nylon (témoin)", "nylon (control)", 78, 71),
    ("Head FiberGel Power 16", "multifilament", "multifilament", 80, 73),
]

BARS = {
    "fr": {
        "title": "Raideur du tamis sur un même cadre à 60 lb, selon le cordage",
        "legend": ("juste après la pose", "24 h plus tard, sans jouer"),
        "axis": "Raideur du tamis, en unités de l'appareil RDC",
    },
    "en": {
        "title": "Stringbed stiffness on the same frame at 60 lb, by string",
        "legend": ("right after stringing", "24 hours later, no play"),
        "axis": "Stringbed stiffness, in RDC device units",
    },
}


def bar(x0: float, y: float, w: float, h: float, colour: str) -> str:
    """Barre horizontale : base carrée, extrémité de donnée arrondie (4 px)."""
    r = 4
    d = f"M{x0:.1f},{y:.1f} H{x0 + w - r:.1f} Q{x0 + w:.1f},{y:.1f} {x0 + w:.1f},{y + r:.1f} V{y + h - r:.1f} Q{x0 + w:.1f},{y + h:.1f} {x0 + w - r:.1f},{y + h:.1f} H{x0:.1f} Z"
    return f'<path d="{d}" style="fill:{colour}"/>'


def build_bars(lang: str) -> str:
    t = BARS[lang]
    w, h = 640, 360
    x0, x1, vmax = 30.0, 560.0, 90
    sx = (x1 - x0) / vmax
    top, bottom = 58.0, 292.0
    body: list[str] = []
    # légende (deux séries : toujours présente)
    body.append(f'<rect x="{x0:.1f}" y="14" width="16" height="16" rx="3" style="fill:{A1}"/>')
    body.append(text(x0 + 24, 28, t["legend"][0], 17))
    lx = 300.0
    body.append(f'<rect x="{lx:.1f}" y="14" width="16" height="16" rx="3" style="fill:{A3}"/>')
    body.append(text(lx + 24, 28, t["legend"][1], 17))
    # grille et graduations
    for v in range(0, vmax + 1, 20):
        x = x0 + v * sx
        # la grille ne passe que derrière les barres, pas derrière les noms des cordages
        for g in range(len(STRINGS)):
            y = top + g * 78 + 18
            body.append(f'<line x1="{x:.1f}" y1="{y:.1f}" x2="{x:.1f}" y2="{y + 46:.1f}" style="stroke:{GRID};stroke-width:1;fill:none"/>')
        body.append(text(x, bottom + 22, str(v), 17, "middle", muted=True))
    body.append(text(x0, bottom + 50, t["axis"], 17, muted=True))
    # groupes
    gy = top
    for name, fam_fr, fam_en, v0, v24 in STRINGS:
        fam = fam_fr if lang == "fr" else fam_en
        body.append(text(x0, gy + 14, f"{name} · {fam}", 17, weight="600"))
        y_a, y_b, bh = gy + 22, gy + 42, 18  # 2 px d'air entre les deux barres
        body.append(bar(x0, y_a, v0 * sx, bh, A1))
        body.append(text(x0 + v0 * sx + 8, y_a + 14, str(v0), 17, weight="600"))
        body.append(bar(x0, y_b, v24 * sx, bh, A3))
        body.append(text(x0 + v24 * sx + 8, y_b + 14, str(v24), 17, weight="600"))
        gy += 78
    return wrap(t["title"], w, h, body)


# --- 2. Schéma de principe : même consigne, deux tamis ---------------------

HEADS = {
    "fr": {
        "title": "À consigne égale, un tamis plus grand a des cordes plus longues",
        "top": "Même consigne sur la machine",
        "small": "Tamis plus petit",
        "large": "Tamis plus grand",
        "short": "cordes plus courtes",
        "long": "cordes plus longues",
        "force": "même force",
        "less": "la corde cède moins",
        "more": "la corde cède davantage",
    },
    "en": {
        "title": "At the same reference tension, a larger head has longer strings",
        "top": "Same reference tension on the machine",
        "small": "Smaller head",
        "large": "Larger head",
        "short": "shorter strings",
        "long": "longer strings",
        "force": "same force",
        "less": "the string gives less",
        "more": "the string gives more",
    },
}


def head(cx: float, cy: float, rx: float, ry: float, n_mains: int, n_cross: int) -> list[str]:
    out: list[str] = []
    for i in range(n_mains):
        dx = (i - (n_mains - 1) / 2) * (2 * rx * 0.86 / (n_mains - 1))
        hh = ry * math.sqrt(max(0.0, 1 - (dx / rx) ** 2))
        out.append(f'<line x1="{cx + dx:.1f}" y1="{cy - hh:.1f}" x2="{cx + dx:.1f}" y2="{cy + hh:.1f}" style="stroke:{GRID};stroke-width:1.5;fill:none"/>')
    for j in range(n_cross):
        dy = (j - (n_cross - 1) / 2) * (2 * ry * 0.86 / (n_cross - 1))
        ww = rx * math.sqrt(max(0.0, 1 - (dy / ry) ** 2))
        out.append(f'<line x1="{cx - ww:.1f}" y1="{cy + dy:.1f}" x2="{cx + ww:.1f}" y2="{cy + dy:.1f}" style="stroke:{GRID};stroke-width:1.5;fill:none"/>')
    # corde centrale mise en avant : c'est sa longueur que le schéma compare
    out.append(f'<line x1="{cx:.1f}" y1="{cy - ry:.1f}" x2="{cx:.1f}" y2="{cy + ry:.1f}" style="stroke:{A1};stroke-width:4;fill:none;stroke-linecap:round"/>')
    out.append(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" style="stroke:currentColor;stroke-width:5;fill:none"/>')
    return out


def side_view(cx: float, y: float, half: float, sag: float, label_force: str) -> list[str]:
    """Corde vue de profil entre deux appuis, enfoncée en son milieu par la même force."""
    out = [
        f'<line x1="{cx - half:.1f}" y1="{y:.1f}" x2="{cx + half:.1f}" y2="{y:.1f}" style="stroke:{GRID};stroke-width:1.5;fill:none"/>',
        f'<polyline points="{cx - half:.1f},{y:.1f} {cx:.1f},{y + sag:.1f} {cx + half:.1f},{y:.1f}" style="stroke:{A1};stroke-width:4;fill:none;stroke-linecap:round;stroke-linejoin:round"/>',
        f'<circle cx="{cx - half:.1f}" cy="{y:.1f}" r="6" style="fill:currentColor"/>',
        f'<circle cx="{cx + half:.1f}" cy="{y:.1f}" r="6" style="fill:currentColor"/>',
        # flèche de la force, de même longueur des deux côtés
        f'<line x1="{cx:.1f}" y1="{y - 34:.1f}" x2="{cx:.1f}" y2="{y - 8:.1f}" style="stroke:currentColor;stroke-width:3;fill:none"/>',
        f'<path d="M{cx - 7:.1f},{y - 12:.1f} L{cx:.1f},{y - 1:.1f} L{cx + 7:.1f},{y - 12:.1f} Z" style="fill:currentColor"/>',
        text(cx + 12, y - 20, label_force, 16, muted=True),
    ]
    return out


def build_heads(lang: str) -> str:
    t = HEADS[lang]
    w, h = 640, 330
    body: list[str] = []
    body.append(text(w / 2, 20, t["top"], 18, "middle", weight="600"))
    lx, rx_ = 170.0, 470.0
    body += head(lx, 118, 52, 66, 9, 11)
    body += head(rx_, 118, 70, 80, 9, 11)
    body.append(text(lx, 220, t["small"], 18, "middle", weight="600"))
    body.append(text(rx_, 220, t["large"], 18, "middle", weight="600"))
    body.append(text(lx, 240, t["short"], 16, "middle", muted=True))
    body.append(text(rx_, 240, t["long"], 16, "middle", muted=True))
    body += side_view(lx, 286, 66, 8, t["force"])
    body += side_view(rx_, 286, 80, 16, t["force"])
    body.append(text(lx, 322, t["less"], 16, "middle"))
    body.append(text(rx_, 322, t["more"], 16, "middle"))
    return wrap(t["title"], w, h, body)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for lang in ("fr", "en"):
        for name, build in (("schema-raideur-tamis-trois-cordages", build_bars), ("schema-meme-consigne-deux-tamis", build_heads)):
            path = OUT / f"{name}-{lang}.svg"
            path.write_text(build(lang), encoding="utf-8", newline="\n")
            print(path.relative_to(ROOT))


if __name__ == "__main__":
    main()
