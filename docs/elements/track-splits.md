# Embranchements (Duet Cup)

- **Type** : système + objet 3D
- **Fichiers** : `game/track/trackSplits.js`, `game/race/kartIsland.js`, `game/race/botLine.js`, `components3d/Track/TrackIslands.jsx`, `components3d/Track/islandGeometry.js` ; données `config/trackData/duetCup.js`
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

## Équilibre (simulation, 31 pilotes ordinateur, 3 tours)

Temps de l'entrée du terre-plein à 90 m après sa fin, par voie :
- Prairies Duo : 7,11 s et 7,17 s ;
- Canyon de la Fourche : 7,13 s et 7,15 s ;
- Îles Jumelles : 7,06 s et 7,31 s (1er), 7,03 s et 7,12 s (2e) ;
- Fourche du Ciel : 7,58 s et 7,52 s.
Réglage : ajouter ou retirer un rocher, déplacer le pad ou le tremplin d'une voie.

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
