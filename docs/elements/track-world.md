# Monde 3D d'un circuit

- **Type** : scène 3D
- **Fichiers** : `src/components3d/Track/` (`TrackWorld.jsx`, `TrackGround.jsx`, `TrackGrass.jsx`, `TrackVegetation.jsx`, `TrackDecor.jsx`, `TrackAssetsPreload.jsx`, `InstancedParts.jsx`, `trackField.js`, `roadGeometry.js`, `markingsGeometry.js`, `surfaceMaterials.js`, `waterMaterial.js`, `grassField.js`, `vegetationScatter.js`, `decorPlacement.js`, `treeAssets.js`, `decorAssets.js`, `trackClock.js`), `src/scenes/DemoScene.jsx`
- **Phase** : 1H

## Rôle

Pendant une course sur circuit, la scène remplace l'arène du menu par le monde du circuit, entièrement généré depuis sa définition ([track-generation.md](track-generation.md)).

## Texture de données (`trackField.js`)

Même principe que le terrain du portfolio : une carte vue de dessus (512 x 512, environ 1,6 m par texel) dont chaque canal décrit le sol.

| Canal | Contenu |
| --- | --- |
| R | route et accotement (1 sur l'asphalte, fondu sur 9 m) |
| G | densité d'herbe (bruit fractal), nulle sur la route, le sable et l'eau |
| B | profondeur de l'eau (0 hors de l'eau, ~0,06 au rivage, 1 au large) |
| A | sable (plages autour de l'eau, lit des hauts-fonds) |

Le terrain, l'eau, l'herbe et le placement de la végétation lisent tous cette même carte.

## Couches

| Couche | Technique |
| --- | --- |
| Terrain | plan 192 x 192 ; couleur (herbe, accotement, sable) et lit des lacs creusé dans le shader |
| Eau | portée de l'eau du portfolio : vagues qui avancent vers la rive, écume brisée par le bruit, turquoise vers bleu profond |
| Route | ruban le long du chemin (largeur variable), asphalte grainé, lignes blanches de bord |
| Marquages | bordures rouge et blanc dans les virages serrés, damier de la ligne d'arrivée, repères des 32 places |
| Herbe | portée de l'herbe du portfolio : brins face caméra sur une grille qui boucle autour de la caméra ; chaque case de l'écran partagé pousse sa caméra avant son rendu |
| Végétation | pack d'arbres (15 essences, une palette par ambiance) et buissons, en instances, tirés le long du tracé |
| Décor | Kenney Racing Kit (CC0) : portique à feux, drapeaux à damier, tribunes, lampadaires, tours à bannière, murets à l'extérieur des virages |

Le brouillard s'éloigne sur circuit (140 à 520 m) pour cacher le bord du terrain ; la vue d'ensemble de l'écran partagé l'écarte le temps de sa case.

## Performance

- Rien n'est chargé pour le sol : tout est généré (environ 0,1 s par circuit au départ).
- Arbres, buissons et décor en instances : un maillage instancié par pièce, quel que soit le nombre de copies.
- Une seule horloge partagée (`trackTime`) pour les vagues et le vent dans l'herbe ; fixe en mouvement réduit.
- Herbe selon la qualité : rien en « basse », 170 x 170 brins en « moyenne », 240 x 240 en « haute ».
- Mesuré (CPU, une image) : environ 4 ms à 2 joueurs, 21 à 24 ms à 8 joueurs (8 rendus). À faire : fusionner les maillages des véhicules par matériau (le Flamant en compte 70).
- Arbres et décor préchargés pendant le choix du circuit et le lobby.

## Conformité règles d'or

- [x] Aucun dégradé linéaire (mélanges de couleurs dans les shaders uniquement) ; aucun emoji
- [x] `useFrame` seulement pour le temps des shaders ; mouvement réduit respecté
- [x] Un seul Canvas, une seule scène ; aucun import de `components/`
- [x] Rien d'une phase suivante : aucune collision, aucune conduite

## Évolutions prévues

Collisions des barrières et du terrain (phase 2) ; relief ; fusion des maillages des karts ; niveaux de détail pour 32 karts.
