# Phase 2E : sensations de course, tremplins, deltaplane, programme et points

## Demande

Roues qui tournent ; fumée d'échappement ; traînées de drift et drift plus fidèle aux jeux de kart de référence ; nouveau design des cases à objets ; hors-piste sans raccourci (muret là où une autre route est proche) ; choisir la coupe puis les circuits (1, 5, comme on veut) et pouvoir changer de circuit en pleine course ; circuits plus grands pour dépasser à 32 ; points additionnés à chaque course ; tremplins et deltaplane. Personnages et identité propres au jeu.

## Fait

- **Roues** animées, roues avant qui braquent (détection automatique dans les modèles). [elements/kart-wheels.md](../elements/kart-wheels.md)
- **Fumée d'échappement**, **marques de pneus** et **traînées lumineuses** du drift, palier violet. [elements/race-effects.md](../elements/race-effects.md)
- **Drift** : lancé dès qu'on braque tant que Drift est tenu (plus besoin de braquer pendant le saut), plus serré dedans, plus large dehors, trois paliers (bleu, orange, violet). [elements/kart-driving.md](../elements/kart-driving.md)
- **Case à objets** : cube de verre irisé, arêtes lumineuses, point d'interrogation. [elements/items.md](../elements/items.md)
- **Circuits agrandis** (`TRACK_SCALE` : x1,5 en surface, routes x1,3 : 17 à 26 m de large, tours de 1 200 à 1 580 m). **Clôture** visible au bout du hors-piste (12 m) et **murets anti-raccourci**. [elements/track-barriers.md](../elements/track-barriers.md)
- **Tremplins à figures** (petit turbo à l'atterrissage) et **deltaplane** au-dessus de brèches d'eau (4 circuits). [elements/jumps-gliders.md](../elements/jumps-gliders.md)
- **Choix coupe puis circuits** avec programme libre. [elements/track-select.md](../elements/track-select.md)
- **Menu pause** (START, Échap, bouton) : reprendre, changer de circuit, quitter. [elements/pause-menu.md](../elements/pause-menu.md)
- **Points** à chaque course, cumulés toute la partie. [elements/race-flow.md](../elements/race-flow.md)

## Vérifié

- `npm run check`, `npm run build` : OK.
- Simulation (Node), 8 circuits, 32 karts, 3 tours : tous arrivent ; 100 à 225 figures, 155 à 160 vols en deltaplane par course sur les circuits concernés, 0 ou 1 chute ; blocage maximal 5 s ; 58 à 182 mini-turbos des bots.
- En jeu (clavier simulé) : roues détectées sur les 7 véhicules ; vol en deltaplane au-dessus de l'eau ; figures des bots ; marques de pneus ; nouvelles cases ; programme de 3 circuits sur deux coupes ; lobby ; pause, changement de circuit (le programme est mis à jour) ; résultats avec points et total reporté sur la course suivante.

## Limites connues

- Panneau de test lent (environ 3 images/s, la version précédente aussi) : la fluidité réelle n'a pas pu être jugée ici.
- Les bots visent les mini-turbos bleus surtout (orange rare sur ces virages plus larges, violet jamais).
- Le deltaplane suit une ligne droite (brèche elliptique) : les sections courbes ne sont pas prévues.
- `config/tracks.js` dépasse 100 lignes (données des 8 circuits).
