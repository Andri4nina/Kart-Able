# Embranchements et croisements (Duet Cup)

- **Type** : système + objet 3D
- **Fichiers** : `game/track/trackSplits.js`, `game/track/trackCrossings.js`, `game/race/kartIsland.js`, `game/race/kartCrossing.js`, `game/race/botLine.js`, `components3d/Track/TrackIslands.jsx`, `components3d/Track/islandGeometry.js`, `components3d/Track/TrackCrossings.jsx`, `components3d/Track/crossingGeometry.js` ; données `config/trackData/duetCup.js`
- **Phase** : introduit en phase 3G

## Rôle

Un embranchement coupe la route en deux voies de même longueur par un terre-plein central. Chaque voie porte son propre défi (pad et rochers d'un côté, tremplin à figure de l'autre) : le joueur choisit, et les deux choix se valent.

## Interface

- Donnée de circuit `splits: [[fraction, longueur m, largeur m]]` ; élargir la route à cet endroit (points de contrôle, 34 avant échelle).
- `geometry.island` : demi-largeur du terre-plein par échantillon ; bouts effilés sur `SPLIT.taper` m ; au moins 7 m de voie de chaque côté.
- Collision : `applyIsland` repousse le kart vers la voie de son côté (comme la barrière) ; on le survole en deltaplane.
- Pilotes ordinateur : `kart.splitSide` (un sur deux à gauche) avant le terre-plein ; une fois dedans, ils gardent la voie où ils sont.
- Cases à objets et réapparition : jamais sur le terre-plein.

## Dépendances

Aucune dépendance npm.

## Performance

Calcul une fois par circuit ; collision : une comparaison par kart et par pas.

## Styles de séparation

`splits: [[fraction, longueur m, largeur m, style]]` ; même collision pour tous :
- `grass` : terre-plein d'herbe (0,55 m) ;
- `hedge` : haie (1,4 m) ;
- `wall` : muret étroit (1,1 m, largeur 6) ;
- `canal` : canal d'eau entre deux margelles ;
- `rocks` : bande basse et blocs de rocher.

## Croisements (pont et tranchée)

- `crossings: [[fraction, longueur m]]` sur une route large (34 avant échelle), à hauteur 0.
- La voie partie de gauche monte sur un pont (+4,5 m), celle de droite descend dans une tranchée (-5 m) et passe dessous ; les deux échangent leurs côtés (centres en cosinus, hauteurs en sinus). Même longueur.
- `kart.branch` : voie prise à l'entrée, gardée jusqu'à la sortie ; murs de la voie (`applyCrossing`) ; sol = route + hauteur de la voie (`kartVertical`).
- Collisions entre karts ignorées au-delà de 2 m d'écart vertical (l'un passe sur l'autre).
- Terrain creusé sous la voie basse (`crossingCutHeight`, lu par le relief).
- Rendu : voies (revêtement de la route), garde-corps, murs, dessous du tablier à l'ombre, piles hors de la voie basse.
- Placer le croisement au milieu d'un grand virage : chaque kart en fait la moitié à l'intérieur et la moitié à l'extérieur. Sinon, la voie extérieure perd jusqu'à 3 s.

## Équilibre (simulation, 31 pilotes ordinateur, 3 tours)

Temps sur toute la partie à deux voies (environ 32 s), selon le côté de départ :
- Prairies Duo : 31,43 s et 31,33 s ;
- Canyon de la Fourche : 32,01 s et 31,60 s ;
- Îles Jumelles : 32,58 s et 32,37 s ;
- Fourche du Ciel : 32,22 s et 31,71 s.

Ponts et tranchées : au plus 0,2 s d'écart. Les voies coupées couvrent environ 50 % du tour.

## Deltaplane

Un vol dure environ 200 m : deux rampes de vol doivent être espacées d'au moins 240 m, sinon les karts survolent la suivante et tombent dans sa brèche.

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji ; icône lucide `Split` / `Waves` pour l'emblème de la coupe
- [x] Tailwind uniquement (aucun style dans ces fichiers)
- [x] Animations : useFrame seulement pour l'état du kart ; mouvement réduit respecté
- [x] Séparation UI / état / 3D respectée (données dans config/, calcul pur dans game/, rendu dans components3d/)
- [x] Rien d'une phase suivante

## Évolutions prévues

Rien de prévu.
