# Tremplins, figures et deltaplane

- **Type** : système + objet 3D
- **Fichiers** : `smkw-ui/src/config/tracks.js` (`ramps`, `gliders`), `smkw-ui/src/config/airTuning.js` (`RELIEF`, `TRICK`, `GLIDE`), `smkw-ui/src/game/track/trackJumps.js`, `trackGeometry.js` (`ramps`, `gaps`, lacs des brèches), `smkw-ui/src/game/race/kartAir.js`, `kartVertical.js`, `kartDrift.js` (appui = figure), `trackTracking.js` (réapparition après une brèche), `raceWorld.js` (chute), `botDriver.js` (figures des bots), `smkw-ui/src/components3d/Track/TrackRamps.jsx`, `rampResources.js`, `roadGeometry.js` / `markingsGeometry.js` / `trackField.js` (route interrompue), `smkw-ui/src/components3d/Racers/KartGlider.jsx`, `kartAirPose.js`, `smkw-ui/src/components3d/Camera/chaseCamera.js`
- **Phase** : 2E

## Rôle

- **Tremplins à figures** (jaunes) : un coin posé sur une partie de la route. Le kart suit sa pente et décolle au bout. Appuyer sur Drift juste après le décollage (`TRICK.window` 0,45 s) fait une figure : tonneau, salto ou vrille, à tour de rôle. À l'atterrissage, petit turbo `BOOSTS.trick`. Les crêtes prises vite (vitesse verticale >= `TRICK.minLaunch`) ouvrent aussi la fenêtre.
- **Deltaplane** (rampe bleue sur toute la largeur) : la route s'interrompt ensuite au-dessus de l'eau (un lac est ajouté sous la brèche). Quitter la rampe déploie le deltaplane : descente lente (`GLIDE.gravity`, `GLIDE.sink`), vitesse entretenue, braquage un peu plus doux. Il se replie à l'atterrissage. Sans deltaplane (rampe évitée), le kart tombe à l'eau et réapparaît après la brèche.
- Circuits : 1 ou 2 tremplins sur chacun des 8 ; deltaplane sur Lac Miroir, Côte Turquoise, Col Alpin et Crête des Nuages.

## Interface

- Configuration : `ramps: [[fraction, latéral -1..1, largeur ?]]`, `gliders: [[fraction, longueur m]]` (ligne droite, route à hauteur 0).
- État du kart : `gliding`, `trick` (s restantes d'animation), `trickWindow`, `trickPending`, `trickStyle`, `rampGlide`.
- Géométrie : `geometry.ramps[]` (`x, z, tx, tz, width, length, height, glide`), `geometry.gaps` (1 par échantillon sans route).
- Scène : `glide-ramp`, `trick-ramp` (groupes), `kart-glider` (par kart).

## Dépendances

Relief (`trackHeight.js`), turbo (`kartBoost.js`), lacs (`lakes.js`) ; aucune dépendance npm.

## Performance

Lecture des rampes : quelques comparaisons par kart et par pas. Rendu : 5 maillages par tremplin, aile du deltaplane cachée (échelle 0) hors vol.

## Conformité règles d'or

- [x] Aucun dégradé linéaire (couleurs pleines, bandes émissives)
- [x] Aucun emoji ; aucune icône
- [x] Tailwind sans objet (3D uniquement)
- [x] Animations `useFrame` (figure, déploiement) ; mouvement réduit : la figure devient un soubresaut, pas de rotation complète
- [x] Séparation : règles pures dans `game/`, rendu dans `components3d/`
- [x] Rien d'une phase suivante

## Évolutions prévues

Figures plus variées (direction du stick), rampes sur les objets, sections de deltaplane plus longues avec courants ascendants.
