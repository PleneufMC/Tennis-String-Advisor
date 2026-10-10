"""Couvertures illustrées du blog (FR et EN) — générées, pas photographiées.

Produit des WebP 1200 x 630 (format og:image) dans public/blog/images/.
Aucune photo, aucun produit ni logo de marque, aucun joueur : un aplat aux
couleurs du site (vert Tailwind green-600/emerald-900), un motif dessiné
(tamis de cordage générique, coupe de monofilament, jauge de fermeté) et le
titre de l'article. Chaque fichier est listé dans public/blog/images/CREDITS.md.

Usage : python scripts/blog-covers/build-covers.py
Polices : Segoe UI (Windows) si présente, sinon DejaVu Sans (Linux).
"""
from __future__ import annotations

import math
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "blog" / "images"
W, H, S = 1200, 630, 2  # rendu en 2x puis réduction (anticrénelage)

BG_TOP = (6, 78, 59)       # emerald-900
BG_BOTTOM = (4, 120, 87)   # emerald-700
INK = (255, 255, 255)
INK_SOFT = (209, 250, 229)  # emerald-100
ACCENT = (190, 242, 100)    # lime-300, rappel de la balle
LINE = (255, 255, 255, 70)

FONT_CANDIDATES = {
    "bold": ["C:/Windows/Fonts/segoeuib.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"],
    "regular": ["C:/Windows/Fonts/segoeui.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"],
}


def font(kind: str, size: int) -> ImageFont.FreeTypeFont:
    for p in FONT_CANDIDATES[kind]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size * S)
    raise SystemExit(f"Aucune police {kind} trouvée")


def background() -> Image.Image:
    img = Image.new("RGB", (W * S, H * S), BG_TOP)
    d = ImageDraw.Draw(img)
    for y in range(H * S):
        t = y / (H * S - 1)
        c = tuple(round(BG_TOP[i] + (BG_BOTTOM[i] - BG_TOP[i]) * t) for i in range(3))
        d.line([(0, y), (W * S, y)], fill=c)
    return img


def overlay(img: Image.Image) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    return layer, ImageDraw.Draw(layer)


def motif_racquet(img: Image.Image) -> None:
    """Silhouette de raquette générique : tamis ovale cordé, coeur, manche."""
    layer, d = overlay(img)
    cx, cy, rx, ry = 930 * S, 250 * S, 175 * S, 215 * S
    box = [cx - rx, cy - ry, cx + rx, cy + ry]
    for i in range(-8, 9):
        dx = i * 20 * S
        h = ry * math.sqrt(max(0.0, 1 - (dx / rx) ** 2))
        d.line([(cx + dx, cy - h), (cx + dx, cy + h)], fill=(255, 255, 255, 130), width=3 * S)
    for j in range(-10, 11):
        dy = j * 20 * S
        w = rx * math.sqrt(max(0.0, 1 - (dy / ry) ** 2))
        d.line([(cx - w, cy + dy), (cx + w, cy + dy)], fill=(255, 255, 255, 100), width=3 * S)
    d.ellipse(box, outline=(255, 255, 255, 235), width=16 * S)
    # coeur et manche
    d.line([(cx - 70 * S, cy + ry - 30 * S), (cx - 18 * S, cy + ry + 95 * S)], fill=(255, 255, 255, 235), width=14 * S)
    d.line([(cx + 70 * S, cy + ry - 30 * S), (cx + 18 * S, cy + ry + 95 * S)], fill=(255, 255, 255, 235), width=14 * S)
    d.rounded_rectangle([cx - 24 * S, cy + ry + 90 * S, cx + 24 * S, cy + ry + 300 * S], radius=12 * S, fill=(255, 255, 255, 235))
    # balle
    bx, by, br = 735 * S, 470 * S, 46 * S
    ball(d, bx, by, br)
    img.paste(layer, (0, 0), layer)


def motif_mono_section(img: Image.Image) -> None:
    """Coupe de cordages monofilaments (polyester) : faisceau de disques pleins."""
    layer, d = overlay(img)
    cx, cy = 930 * S, 300 * S
    r = 58 * S
    pts = [(0, 0)] + [(math.cos(a) * 2.05 * r, math.sin(a) * 2.05 * r) for a in [k * math.pi / 3 for k in range(6)]]
    for k, (dx, dy) in enumerate(pts):
        x, y = cx + dx, cy + dy
        d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255, 40), outline=(255, 255, 255, 230), width=6 * S)
        # reflet : un monofilament est plein, une seule matière
        d.arc([x - r * 0.62, y - r * 0.62, x + r * 0.62, y + r * 0.62], 200, 280, fill=ACCENT + (255,), width=6 * S)
    # profil à arêtes suggéré sur le disque central
    for a in range(0, 360, 60):
        t = math.radians(a)
        d.line([(cx + math.cos(t) * r * 0.25, cy + math.sin(t) * r * 0.25), (cx + math.cos(t) * r * 0.85, cy + math.sin(t) * r * 0.85)], fill=(255, 255, 255, 140), width=3 * S)
    img.paste(layer, (0, 0), layer)


def motif_gauge(img: Image.Image) -> None:
    """Jauge de fermeté en cinq zones, du très confortable au très ferme (sans chiffre)."""
    layer, d = overlay(img)
    cx, cy, r = 930 * S, 400 * S, 230 * S
    zones = [(34, 197, 94), (132, 204, 22), (234, 179, 8), (249, 115, 22), (239, 68, 68)]
    for i, c in enumerate(zones):
        a0 = 180 + i * 36
        d.arc([cx - r, cy - r, cx + r, cy + r], a0 + 1.5, a0 + 36 - 1.5, fill=c + (255,), width=52 * S)
    ang = math.radians(180 + 3.0 * 36)
    d.line([(cx, cy), (cx + math.cos(ang) * (r - 60 * S), cy + math.sin(ang) * (r - 60 * S))], fill=(255, 255, 255, 255), width=12 * S)
    d.ellipse([cx - 20 * S, cy - 20 * S, cx + 20 * S, cy + 20 * S], fill=(255, 255, 255, 255))
    img.paste(layer, (0, 0), layer)


def motif_grid(img: Image.Image) -> None:
    """Tamis de cordage vu de face, en perspective douce, pour l'index du blog."""
    layer, d = overlay(img)
    x0, y0, x1, y1 = 720 * S, 60 * S, 1140 * S, 570 * S
    for i in range(15):
        x = x0 + (x1 - x0) * i / 14
        d.line([(x, y0), (x, y1)], fill=(255, 255, 255, 150), width=4 * S)
    for j in range(18):
        y = y0 + (y1 - y0) * j / 17
        d.line([(x0, y), (x1, y)], fill=(255, 255, 255, 110), width=3 * S)
    bx, by, br = 930 * S, 300 * S, 56 * S
    ball(d, bx, by, br)
    img.paste(layer, (0, 0), layer)


def ball(d: ImageDraw.ImageDraw, bx: int, by: int, br: int) -> None:
    """Balle de tennis générique : disque et deux coutures incurvées."""
    d.ellipse([bx - br, by - br, bx + br, by + br], fill=ACCENT + (255,))
    k = 1.55 * br
    rr = 1.12 * br
    d.arc([bx - k - rr, by - rr, bx - k + rr, by + rr], -42, 42, fill=(255, 255, 255, 255), width=max(2, br // 9))
    d.arc([bx + k - rr, by - rr, bx + k + rr, by + rr], 138, 222, fill=(255, 255, 255, 255), width=max(2, br // 9))


def wrap(draw: ImageDraw.ImageDraw, text: str, f: ImageFont.FreeTypeFont, max_w: int) -> list[str]:
    words, lines, cur = text.split(), [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if draw.textlength(test, font=f) <= max_w:
            cur = test
        else:
            lines.append(cur)
            cur = w
    lines.append(cur)
    return lines


def text_block(img: Image.Image, kicker: str, title: str, subtitle: str, site: str) -> None:
    d = ImageDraw.Draw(img)
    left, max_w = 64 * S, 600 * S
    fk = font("bold", 22)
    kw = d.textlength(kicker.upper(), font=fk)
    d.rounded_rectangle([left, 64 * S, left + kw + 36 * S, 108 * S], radius=22 * S, fill=ACCENT)
    d.text((left + 18 * S, 86 * S), kicker.upper(), font=fk, fill=BG_TOP, anchor="lm")
    size = 60
    while True:
        ft = font("bold", size)
        lines = wrap(d, title, ft, max_w)
        if len(lines) <= 3 or size <= 40:
            break
        size -= 4
    y = 140 * S
    for ln in lines:
        d.text((left, y), ln, font=ft, fill=INK)
        y += int(size * 1.16) * S
    fs = font("regular", 28)
    y += 14 * S
    for ln in wrap(d, subtitle, fs, max_w):
        d.text((left, y), ln, font=fs, fill=INK_SOFT)
        y += 38 * S
    fsite = font("bold", 24)
    d.text((left, (H - 64) * S), site, font=fsite, fill=INK, anchor="lm")


COVERS = [
    # (fichier, motif, kicker, titre, sous-titre)
    ("couverture-meilleures-raquettes-2026-fr.webp", motif_racquet, "Classement 2026",
     "Meilleures raquettes de tennis 2026", "Lues selon votre profil de joueur et la rigidité du cadre"),
    ("couverture-meilleures-raquettes-2026-en.webp", motif_racquet, "2026 ranking",
     "Best tennis racquets of 2026", "Read by player profile and frame stiffness"),
    ("couverture-meilleur-cordage-polyester-2026-fr.webp", motif_mono_section, "Classement 2026",
     "Meilleur cordage polyester 2026", "Le meilleur pour le jeu n'est pas le meilleur pour le bras"),
    ("couverture-meilleur-cordage-polyester-2026-en.webp", motif_mono_section, "2026 ranking",
     "Best polyester tennis strings of 2026", "The best for your game is not the best for your arm"),
    ("couverture-polyester-tennis-elbow-fr.webp", motif_gauge, "Bras sensible",
     "Cordage polyester et tennis elbow", "Triés par rigidité et par indice RCS, pas par note"),
    ("couverture-polyester-tennis-elbow-en.webp", motif_gauge, "Sensitive arm",
     "Polyester strings and tennis elbow", "Sorted by stiffness and RCS index, not by score"),
    ("couverture-blog-fr.webp", motif_grid, "Blog",
     "Cordage, tension et confort du bras", "Guides et analyses fondés sur des mesures publiées"),
    ("couverture-blog-en.webp", motif_grid, "Blog",
     "Strings, tension and arm comfort", "Guides and analysis built on published measurements"),
]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, motif, kicker, title, subtitle in COVERS:
        img = background()
        motif(img)
        text_block(img, kicker, title, subtitle, "tennisstringadvisor.org")
        img = img.resize((W, H), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=0.6, percent=40))
        path = OUT / name
        img.save(path, "WEBP", quality=82, method=6)
        print(f"{path.relative_to(ROOT)}  {path.stat().st_size // 1024} Ko")


if __name__ == "__main__":
    main()
