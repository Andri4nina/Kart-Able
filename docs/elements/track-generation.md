# Coupes, circuits et génération procédurale

- **Type** : configuration + règles pures
- **Fichiers** : `src/config/cups.js`, `src/config/tracks.js`, `src/config/trackThemes.js`, `src/game/track/` (`trackPath.js`, `trackLayout.js`, `trackGeometry.js`, `trackOutline.js`, `lapRules.js`, `noise.js`), `src/game/race/startSlots.js`
- **Phase** : 1H

## Rôle

Un circuit n'est qu'une poignée de données. Tout le reste (route, terrain, eau, herbe, arbres, décor, grille de départ, checkpoints, mini-cartes) en est **généré par le code**, de façon déterministe : même graine, même circuit, sur toutes les machines (indispensable en réseau).

## Données

```js
CUPS = [{ id: 'kairos', trackIds: [4 circuits] }]   // 4 circuits par coupe, d'autres coupes viendront
TRACKS = [{
  id, theme, laps: 3, seed,
  path: [[x, z, largeur], ...],   // points de contrôle, boucle fermée dans le sens de course
  lakes: [{ x, z, rx, rz, angle }],
}]
TRACK_THEMES = { meadow, lake, forest, coast }  // couleurs, essences d'arbres, densités
```

Le premier point du chemin est la ligne de départ / arrivée, précédée d'une ligne droite assez longue pour la grille de 32 karts.

## Kairos Cup

| Circuit | Ambiance | Tour | Largeur | Checkpoints | Caractère |
| --- | --- | --- | --- | --- | --- |
| Prairie Kairos | prairie | 751 m | 17 à 20 m | 13 | tracé fluide autour d'un étang, pour débuter |
| Lac Miroir | lac | 978 m | 17 à 20 m | 16 | grande boucle autour du lac, chicane au bord de l'eau |
| Bois des Échos | forêt | 800 m | 16 à 18 m | 13 | S et épingles dans une forêt dense de pins |
| Côte Turquoise | côte | 1 046 m | 16 à 20 m | 17 | le long de la mer, épingle en S avant la ligne |

## Dimensionnement pour 32 joueurs

- Largeur de 16 à 20 m : 4 karts de front au départ, de la place pour doubler, mais assez étroit dans les sections techniques pour garder le contact.
- 750 à 1 050 m par tour (environ 35 à 45 s), 3 tours : la course reste courte et rejouable, le peloton ne s'étire pas trop.
- Grille : 4 colonnes en quinconce (une colonne sur deux en retrait de 3 m), 8 rangées tous les 6 m, derrière la ligne.
- Marges vérifiées par `measureTrackClearance` : au moins 27 m entre deux portions de route, au moins 14 m entre la route et l'eau.

## Géométrie (pur, sans Three.js)

- `buildTrackPath` : spline de Catmull-Rom **centripète** fermée (pas de boucle dans les virages serrés), largeur interpolée, rééchantillonnée tous les mètres (positions, tangentes, distances).
- `sampleTrack`, `getStartSlot` (place n° i, orientée dans le sens de course), `getCheckpointGates`, `getTrackBounds`, `getCurvature` (bordures et décor des virages).
- `getTrackOutline` : contour réduit à une boîte 100 x 100 pour les mini-cartes SVG.

## Checkpoints et anti-raccourci (`lapRules.js`)

- Une porte tous les ~60 m, la porte 0 étant la ligne d'arrivée ; chaque porte déborde de 12 m de chaque côté de la route.
- Un tour ne compte que si **toutes les portes ont été franchies dans l'ordre** : une porte hors d'ordre est ignorée, repasser à contresens la dernière porte validée l'annule.
- Les karts partent derrière la ligne : son premier franchissement lance le tour 1. La course se termine après le dernier tour.
- `getGateCrossing` (déplacement d'un point a à un point b) renvoie +1, -1 ou 0. Ces règles sont prêtes ; elles seront branchées sur le déplacement des karts en phase 2.

## Conformité règles d'or

- [x] Données dans `config/`, règles pures dans `game/` (aucun React, aucun store)
- [x] Aucun texte en dur (`cups.*`, `tracks.*` dans chaque locale)
- [x] Aucun emoji
- [x] Rien d'une phase suivante : pas de conduite, les règles de tour ne sont pas encore branchées

## Évolutions prévues

Nouvelles coupes ; relief (collines, ponts) ; branchement des checkpoints sur la physique (phase 2) ; circuits urbains avec des modèles téléchargés.
