# Phase 2D : bots qui driftent, coupe complète, résultats et vote

## Demande

Les bots driftent ; au choix des circuits, choisir la coupe (sans circuit précis : les 4 à la suite) ; à la fin d'une course, les joueurs votent pour le circuit suivant parmi les autres, le plus choisi est couru.

## Fait

- **Bots** : drift avec mini-turbos, mêmes règles que les joueurs. [elements/kart-driving.md](../elements/kart-driving.md)
- **Coupe complète** : carte en tête de chaque rangée (présélectionnée), aperçu des 4 circuits, récapitulatif du lobby ; points de coupe cumulés.
- **Résultats** (manquaient jusqu'ici), **course suivante** de la coupe, **vote** du circuit suivant avec annonce du circuit élu. [elements/race-flow.md](../elements/race-flow.md)
- Paliers de drift un peu plus proches pour tous (0,7 / 1,7).

## Vérifié

- `npm run check`, `npm run build` : OK ; console sans erreur.
- Simulation (Node) des 8 circuits à 32 karts : 110 à 300 mini-turbos des bots par course, hors-piste en baisse, blocage maximal 8,6 s.
- Règles pures (raceSequence) : majorité, égalités (tirage), aucun vote, points et classement cumulés, dernière course, options sans le circuit couru.
- En jeu (clavier simulé) : Kairos Cup complète (4 courses, points reportés, classement final), START ignoré juste après l'arrivée puis accepté, vote au clavier, annonce, course sur le circuit élu ; écran des circuits avec les cartes de coupe.

## Limites connues

- Le vote ne propose que des circuits (pas une autre coupe).
- Les bots ne votent pas (vote des joueurs locaux seulement).
