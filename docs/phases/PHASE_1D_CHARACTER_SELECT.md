# Phase 1D — Sélection des personnages façon Mario Kart, preview 3D, unicité

**Statut** : terminée (2026-10-01) ; logique et rendu vérifiés (voir progress.md)
**Objectif** : personnages au centre, joueurs sur les côtés, curseur par joueur, présélection affichée en 3D en haut de l'écran, confirmation indépendante, un personnage confirmé réservé à un seul joueur.

## Périmètre

Inclus :
- Séparation données / règles / état / contrôleur / UI / scène / preview / validation.
- État par joueur `selecting` / `confirmed`, avec `preselectedId` et `confirmedId`.
- Règle d'unicité appliquée par le store et revérifiée au départ (`duplicateCharacters`).
- Preview 3D dans la scène existante (plan caméra dédié, un modèle par joueur, animations légères).
- 8 personnages (2 par archétype) pour que 8 joueurs aient chacun un personnage unique.
- Découpage des fichiers touchés à environ 100 lignes ; nouvelle règle d'or sur la taille des fichiers.

Exclus : conduite, physique, gameplay, course, réseau.

## Décisions

- Pas de modèle GLB dans le projet : modèles low-poly en pièces partagées, avec un point d'extension unique (`CharacterModel`).
- Preview dans le Canvas existant plutôt qu'un second Canvas ou des `View` drei, qui auraient pris la main sur le rendu de la scène.
- Annuler une confirmation est autorisé : le personnage est libéré immédiatement.
- La navigation saute les personnages réservés. Un joueur déjà posé sur un personnage qui vient d'être réservé y reste, mais ne peut pas confirmer.

## Dépendances ajoutées

Aucune.

## Prêt pour la suite

- `sessionStore.match.players[].characterId` : personnage confirmé et unique de chaque joueur.
- `CharacterModel` réutilisable pour le kart en jeu (phase 2) ou remplaçable par un GLB.

> Remplacé en phase 1E ([PHASE_1E_VEHICLES.md](PHASE_1E_VEHICLES.md)) : personnage seul (`CharacterFigure`), véhicules GLB choisis à part.
