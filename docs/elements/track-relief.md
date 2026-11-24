# Relief des circuits (montées, descentes)

- **Type** : système + scène
- **Fichiers** : `smkw-ui/src/config/tracks.js` (hauteur, `hills`), `smkw-ui/src/game/track/trackPath.js` (y), `trackHeight.js` (grille de hauteurs), `lakes.js`, `smkw-ui/src/game/race/kartVertical.js`, `smkw-ui/src/components3d/Track/` (TrackGround, roadGeometry, markingsGeometry, heightTexture, grassField, TrackVegetation, TrackDecor), `Racers/kartPose.js`, `Camera/chaseCamera.js`
- **Phase** : 2B

## Rôle

Donner du dénivelé aux circuits sans toucher à la logique 2D de course (portes, tours, classement).

## Fonctionnement

- Point de contrôle `[x, z, largeur, hauteur]` ; la spline interpole la hauteur en douceur.
- `buildHeightField` : grille 320 x 320 ; route et accotements à la hauteur de la route, fondu sur 55 m vers des collines (`hills`), terrain ramené au niveau de l'eau sur les rives. Circuit plat : aucune grille.
- Course : `kartVertical.js` pose le kart sur le sol, la pente freine en montée et pousse en descente, et une crête prise vite fait décoller légèrement (gravité arcade `RELIEF.gravity`).
- Rendu : route et marquages à la hauteur du chemin, terrain déplacé (un peu sous la route), herbe via une texture de hauteurs, arbres et décor posés au sol, kart incliné selon la pente, caméra qui suit la hauteur.

Règles de conception (vérifiées par un script de test) : grille de départ à plat, route à 0 à moins de ~45 m des lacs, pentes de 19 % au maximum.

## Performance

Grille calculée une fois par circuit (70 à 140 ms) ; par pas : une interpolation bilinéaire et une pente par kart.

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji
- [x] Tailwind non concerné
- [x] useFrame : tangage et caméra amortis
- [x] UI / 3D séparées
- [x] Rien d'une phase suivante (pas de rampes ni de raccourcis)

## Évolutions prévues

Rampes (vrais sauts, figures), ponts et tunnels (nécessiteraient une route à plusieurs niveaux).
