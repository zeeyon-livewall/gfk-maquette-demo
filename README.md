# Maquette de démonstration — logiciel GFK

Site statique reprenant les 14 écrans de la maquette du logiciel de gestion GFK
(transport routier) : connexion, tableau de bord, planning et dispatch, commandes,
clients, flotte, chauffeurs, atelier, facturation, conformité, rapports, paramètres,
application chauffeur et charte graphique. Toutes les données sont fictives.

- `source/` : les écrans d'origine du canevas Design (`.dc.html`) et son index.
- `build/convert.py` : convertit ces écrans en pages HTML autonomes.
- `docs/` : le site publié (GitHub Pages sert ce dossier).

Régénérer le site après une modification des sources :

    python3 build/convert.py
