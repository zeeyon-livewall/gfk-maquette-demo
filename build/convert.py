#!/usr/bin/env python3
"""Convertit les 14 écrans de la maquette GFK (fichiers .dc.html du canevas)
en pages HTML autonomes, publiables sur n'importe quel hébergeur statique.

Usage : python3 build/convert.py   (écrit les pages dans docs/)
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "source"
OUT = ROOT / "docs"

# Fichier du canevas -> page du site
PAGES = {
    "Connexion.dc.html": "index.html",
    "Main.dc.html": "tableau-de-bord.html",
    "Planning.dc.html": "planning.html",
    "Commandes.dc.html": "commandes.html",
    "Clients.dc.html": "clients.html",
    "Flotte.dc.html": "flotte.html",
    "Chauffeurs.dc.html": "chauffeurs.html",
    "Atelier.dc.html": "atelier.html",
    "Facturation.dc.html": "facturation.html",
    "Conformite.dc.html": "conformite.html",
    "Rapports.dc.html": "rapports.html",
    "Parametres.dc.html": "parametres.html",
    "AppChauffeur.dc.html": "app-chauffeur.html",
    "Charte.dc.html": "charte.html",
}

MENU_ICON = (
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" '
    'stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'
)
NAV_TOGGLE = (
    '<button class="nav-toggle" type="button" aria-label="Ouvrir le menu" aria-expanded="false">'
    + MENU_ICON + "</button>"
)


def extract(text: str):
    """Sépare le titre, le contenu du <helmet> (styles) et le corps de l'écran."""
    title = re.search(r"<title>(.*?)</title>", text, re.S).group(1).strip()
    helmet = re.search(r"<helmet>(.*?)</helmet>", text, re.S).group(1)
    body = text[text.index("</helmet>") + len("</helmet>"): text.rindex("</x-dc>")]
    return title, helmet.strip(), body.strip()


def relink(body: str) -> str:
    for src, page in PAGES.items():
        body = body.replace(f'href="{src}"', f'href="{page}"')
    return body


def add_nav_toggle(body: str) -> str:
    marker = '<span class="wm">Transports &amp; logistics</span>\n</a>'
    return body.replace(marker, marker + "\n" + NAV_TOGGLE, 1)


def commandes(body: str) -> str:
    """L'écran Commandes était rendu par le moteur du canevas : on remplace les
    gabarits par des conteneurs que commandes.js remplit."""
    body = re.sub(
        r'<div class="tabs" role="tablist" aria-label="Filtrer par statut">\s*<sc-for.*?</sc-for>\s*</div>',
        '<div class="tabs" role="tablist" aria-label="Filtrer par statut" id="tabs"></div>',
        body, count=1, flags=re.S,
    )
    body = re.sub(
        r'<tbody>\s*<sc-for list="\{\{list\}\}".*?</sc-for>\s*</tbody>',
        '<tbody id="rows"></tbody>', body, count=1, flags=re.S,
    )
    body = body.replace("{{count}} commandes affichées", '<span id="count">12</span> commandes affichées', 1)
    start = body.index('<div class="card" style="min-width:0">\n<div class="ch" style="margin-bottom:10px">')
    end = body.index("\n</main>", start)
    body = body[:start] + '<div class="card" id="detail" style="min-width:0"></div>\n</div>' + body[end:]
    assert "{{" not in body, "il reste un gabarit non converti dans Commandes"
    return body


def connexion(body: str) -> str:
    old = "GFK · version 1.0 · données hébergées au Canada</div>"
    new = ('GFK · version 1.0 · données hébergées au Canada · '
           '<a href="charte.html" style="color:#AEB8C6">Charte graphique de la maquette</a></div>')
    return body.replace(old, new, 1)


def app_chauffeur(body: str) -> str:
    bar = ('<div class="phone-bar"><a href="tableau-de-bord.html">&larr; Retour au logiciel</a>'
           '<span>Application chauffeur · aperçu sur téléphone</span></div>')
    return '<div class="phone-stage">' + bar + '<div class="phone">' + body + "</div></div>"


def charte(body: str) -> str:
    bar = ('<div class="board-bar"><a href="tableau-de-bord.html">&larr; Retour au logiciel</a>'
           '<span>Charte graphique de la maquette · planche 1440 × 960</span></div>')
    return ('<div class="board-stage">' + bar + '<div class="board-outer"><div class="board-scale" id="board-scale">'
            + body + "</div></div></div>")


def page(title: str, helmet: str, body: str, extra_scripts=()) -> str:
    scripts = "".join(f'<script src="{s}"></script>\n' for s in ("demo.js", *extra_scripts))
    return (
        "<!doctype html>\n<html lang=\"fr\">\n<head>\n<meta charset=\"utf-8\">\n"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
        f"<title>{title}</title>\n"
        "<meta name=\"robots\" content=\"noindex\">\n"
        "<link rel=\"icon\" type=\"image/svg+xml\" href=\"favicon.svg\">\n"
        f"{helmet}\n"
        "<link rel=\"stylesheet\" href=\"demo.css\">\n"
        "</head>\n<body>\n"
        f"{body}\n"
        f"{scripts}"
        "</body>\n</html>\n"
    )


def main():
    OUT.mkdir(exist_ok=True)
    for src, name in PAGES.items():
        title, helmet, body = extract((SRC / src).read_text(encoding="utf-8"))
        body = relink(body)
        extra = ()
        if src == "Commandes.dc.html":
            body = commandes(body)
            extra = ("commandes.js",)
        if src == "Connexion.dc.html":
            body = connexion(body)
        if src == "AppChauffeur.dc.html":
            body = app_chauffeur(body)
        elif src == "Charte.dc.html":
            body = charte(body)
        elif src != "Connexion.dc.html":
            body = add_nav_toggle(body)
        (OUT / name).write_text(page(title, helmet, body, extra), encoding="utf-8")
        print(f"{src:24s} -> {name}")
    (OUT / ".nojekyll").write_text("", encoding="utf-8")


if __name__ == "__main__":
    main()
