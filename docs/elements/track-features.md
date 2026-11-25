# Éléments de circuit : pads, rochers, eau, herbe écrasée

- **Type** : système + objet 3D
- **Fichiers** : `smkw-ui/src/config/tracks.js` (`pads`, `obstacles`, `lakes`), `smkw-ui/src/game/track/trackFeatures.js`, `trackFences.js`, `smkw-ui/src/game/race/kartFeatures.js`, `botLine.js`, `trackTracking.js`, `smkw-ui/src/components3d/Track/TrackFeatures.jsx`, `featureResources.js`, `grassTrample.js`, `grassField.js`, `grassShaders.js`
- **Phase** : 2C

## Rôle

Donner du défi aux circuits avec 32 karts : choix de trajectoire, risque et récompense.
- **Pads d'accélération** : plaque sombre à trois chevrons lumineux ; rouler dessus (au sol) donne le turbo `BOOSTS.pad`, une fois par passage.
- **Rochers** : cylindres sur la route ; le kart rebondit et perd de la vitesse comme sur un mur, secousse, drift cassé sur un choc franc.
- **Eau au bord des virages** : là où un lac est à moins de `RACE.waterFence.reach` (8 m) du bord, la barrière invisible s'ouvre jusqu'à 4 m dans l'eau ; sortir de la route à cet endroit fait tomber à l'eau (gerbe, réapparition).
- **Herbe écrasée** : les roues couchent l'herbe (carte 512 x 512 au CPU), qui se relève en ~40 s.

## Tracés

Les 8 circuits ont été retouchés (points de contrôle) : épingles en baie vers l'intérieur, chicanes, sections techniques de 13 à 15 m (grille de départ à 20 m), un lac au bord d'un virage par circuit (sauf Col Alpin : lac au bord de la dernière courbe). Contrôle avec `measureTrackClearance` : routes séparées d'au moins 23 m, eau à 3,6 à 7,9 m du bord aux endroits voulus. Courses complètes à 32 karts simulées sur les 8 circuits : aucun kart bloqué durablement (3,5 s au pire, bouchon dans une épingle), aucun bot à l'eau.

## Interface

- `tracks.js` : `pads: [[fraction, latéral -1..1]]`, `obstacles: [[fraction, latéral, rayon?]]`.
- Géométrie (`getTrackGeometry`) : `pads`, `obstacles` (positions monde, `lateral`, `distance`), `fences.left/right` (m depuis le bord, par échantillon).
- `render_game_to_text().race` : `pads`, `obstacles`.

## Dépendances

`applyBoost`, `cancelDrift`, `WALL` / `COLLISION` (kartTuning), `RACE.fence` / `RACE.waterFence`. Bots : `chooseBotLateral` contourne les rochers et prend les pads proches de leur trajectoire.

## Performance

Pads et rochers : quelques maillages par circuit. Herbe : texture 8 bits envoyée 20 fois par seconde, repousse calculée deux fois par seconde.

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji
- [x] Sans objet (pas d'UI)
- [x] Pulsation des chevrons coupée en mouvement réduit
- [x] Séparation UI / état / 3D respectée
- [x] Rien d'une phase suivante au-delà de la demande (pads et rochers demandés pour le défi des circuits)

## Évolutions prévues

Rampes (vrais sauts), raccourcis, pièces.
