# Limites du circuit : murets anti-raccourci et clôture du hors-piste

- **Type** : système + objet 3D
- **Fichiers** : `smkw-ui/src/config/race.js` (`fence`, `waterFence`, `shortcut`), `smkw-ui/src/game/track/trackFences.js`, `smkw-ui/src/game/race/trackTracking.js` (`applyFence`), `smkw-ui/src/components3d/Track/barrierPlacement.js`, `TrackBarriers.jsx`, `decorPlacement.js`
- **Phase** : 2E

## Rôle

On peut sortir de la route (herbe, terre : lent), mais sans tricher :
- **Clôture basse** (blanche) à `RACE.fence` (12 m) du bord : la limite du hors-piste, visible ;
- **Muret rouge et blanc** au ras de la route (`shortcut.fence`, 1,6 m) là où une autre portion de la route passe à moins de `shortcut.gap` (34 m) en étant à plus de `shortcut.separation` (70 m) sur le tour : impossible de couper vers elle. Le muret est prolongé de 8 m à chaque bout ;
- près de l'eau, la limite reste ouverte : on peut tomber dans le lac. L'eau barre déjà le raccourci.

Les limites visibles et les limites de la course sont les mêmes données (`geometry.fences`). Le décor (tribunes, tours, lampadaires, drapeaux) est posé au-delà de la clôture : plus aucun décor qu'on traverse. Les anciens murets de virage du décor sont retirés.

## Interface

- `geometry.fences` : `left`, `right` (m depuis le bord, par échantillon), `walls.left / right` (1 = muret).
- Scène : `shortcut-walls`, `offroad-fence` (InstancedMesh).

## Dépendances

`trackHeight.js` (pose sur le relief), lacs. Aucune dépendance npm.

## Performance

Calcul une fois par circuit (comparaison des échantillons, quelques millisecondes). Rendu : 2 maillages instanciés (environ 1 000 pièces).

## Conformité règles d'or

- [x] Aucun dégradé linéaire ; aucun emoji
- [x] Couleurs du thème (rouge, blanc)
- [x] Séparation : règles dans `game/track`, rendu dans `components3d/Track`
- [x] Rien d'une phase suivante

## Évolutions prévues

Variantes de clôture par thème (rondins, rochers, haies).
