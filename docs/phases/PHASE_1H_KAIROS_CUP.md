# Phase 1H — Kairos Cup : circuits procéduraux, choix du circuit, checkpoints

**Statut** : terminée (2026-10-08)
**Demande** : générer les maps en procédural avec les outils du portfolio (eau, herbe, arbres...) ; une première coupe de 4 maps, la « Kairos Cup », d'autres coupes viendront ; choisir la map après le personnage et le kart ; une map peut accueillir 32 joueurs (taille adaptée pour une course addictive et compétitive) ; des checkpoints contre les raccourcis ; la ligne de départ / arrivée.

## Fait

- Coupes et circuits en données (`config/cups.js`, `config/tracks.js`, `config/trackThemes.js`) ; génération pure dans `game/track` (spline, grille de 32, portes de checkpoint, règles de tour anti-raccourci, mini-cartes). Voir [track-generation.md](../elements/track-generation.md).
- Kairos Cup : Prairie Kairos, Lac Miroir, Bois des Échos, Côte Turquoise (750 à 1 050 m par tour, 16 à 20 m de large, 3 tours).
- Monde 3D généré (`components3d/Track`) : texture de données, terrain, eau et herbe portées du portfolio, route et marquages, arbres du pack en instances, décor Kenney (CC0). Voir [track-world.md](../elements/track-world.md).
- Écran « Circuits » après les véhicules (modes de course), P1 choisit ; lobby avec le circuit ; course sur le circuit (grille, caméras de poursuite dans le sens de course, vue d'ensemble). Voir [track-select.md](../elements/track-select.md).
- `docs/CREDITS.md` : licences des ressources.

## Décisions

- Un circuit = points de contrôle + lacs + ambiance + graine ; tout le reste est généré et déterministe (même résultat sur toutes les machines, prêt pour le réseau).
- Circuits plats (relief plus tard), grandes marges entre les portions de route.
- En local, P1 choisit le circuit ; vote en réseau plus tard.
- Pas de modèles de ville : les maisons procédurales seraient laides. Pour des circuits urbains, des modèles seront à télécharger (voir le rapport).

## Hors périmètre

Conduite et physique (les checkpoints sont prêts mais pas branchés), bots, objets, réseau.

## Dépendances ajoutées

Aucune.
