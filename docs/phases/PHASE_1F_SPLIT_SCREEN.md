# Phase 1F — Prêt par joueur, écran partagé

**Statut** : terminée (2026-10-08)
**Demande** : « la distinction des cases par joueur : on fait prêt et prêt puis on va dans le split screen ».

## Flow local

Joueurs locaux, personnages, véhicules, puis **lobby : chaque joueur se déclare prêt**, puis la course s'ouvre en **écran partagé** (une case par joueur).

## Fait

- Lobby : bouton et entrée « Prêt » par joueur (START / A, RETOUR pour annuler), départ automatique quand tous sont prêts. Voir [lobby-ready.md](../elements/lobby-ready.md).
- Écran partagé : découpage 1 à 8 joueurs (paysage / portrait), une caméra de poursuite par case, vue d'ensemble pour une case vide, cadre et HUD à la couleur de chaque joueur. Voir [split-screen.md](../elements/split-screen.md).
- Grille de départ : véhicule + personnage de chaque joueur sur sa case peinte. Voir [start-grid.md](../elements/start-grid.md).
- HUD adapté à la taille de chaque case (requêtes de conteneur en largeur et en hauteur).

## Décisions

- 2 joueurs : l'un au-dessus de l'autre (comme les jeux de kart de salon), y compris en paysage ; le cadrage garde l'angle du 16:9 pour éviter la déformation.
- Position affichée = ordre sur la grille de départ (pas encore de course).
- La mention « démo » du HUD n'apparaît qu'en solo.

## Hors périmètre (phases suivantes)

Conduite, physique, circuit, compte à rebours, objets, classement réel.

## Dépendances ajoutées

Aucune.
