# Écran partagé (une case par joueur)

- **Type** : système 3D + composants UI + configuration
- **Fichiers** : `src/config/splitScreen.js`, `src/components3d/Camera/SplitScreenRenderer.jsx`, `chaseCamera.js`, `splitViews.js`, `src/components/screens/GameScreen.jsx`, `src/components/screens/split/SplitScreenHud.jsx`, `PlayerViewportHud.jsx`, variantes `cell-short:` / `cell-low:` (`src/index.css`)
- **Phase** : 1F

## Rôle

Pendant la partie, chaque joueur local a **sa case** : sa vue 3D (caméra derrière son kart), un cadre à sa couleur et son propre HUD. Les cases sont séparées par un trait sombre.

## Découpage (`config/splitScreen.js`)

| Joueurs | Paysage (colonnes x rangées) | Portrait |
| --- | --- | --- |
| 1 | 1x1 | 1x1 |
| 2 | 1x2 (l'un au-dessus de l'autre) | 1x2 |
| 3-4 | 2x2 | 2x2 |
| 5-6 | 3x2 | 2x3 |
| 7-8 | 4x2 | 2x4 |

- Ordre de lecture (gauche à droite, puis haut en bas) = ordre des joueurs dans la partie = place sur la grille de départ.
- Une case sans joueur (3, 5, 7 joueurs) affiche une **vue d'ensemble** de la grille (`OverviewCell`, caméra haute).
- Portrait = hauteur >= largeur, même règle que la media query CSS `orientation: portrait`.
- L'UI utilise une grille CSS (`GRID_CLASSES`, clé `getSplitGridKey`) et la 3D les rectangles de `getViewportRect` : même découpage, vérifié au pixel près (`render_game_to_text().splitScreen` contre les cases du DOM).

## Rendu 3D (`SplitScreenRenderer`)

- Monté seulement sur l'écran de jeu avec des joueurs locaux. Son `useFrame` a la **priorité 1** : R3F cesse son rendu automatique et la scène est dessinée une fois par case (`setViewport` + `setScissor`). Démonté, R3F reprend son rendu habituel (caméra du menu).
- Caméras allouées une fois au niveau module (`splitViews.js`), vecteurs réutilisés : aucune allocation par frame.
- `chaseCamera.js` (fonctions pures) : caméra de poursuite derrière la place de départ du joueur, dans le sens de course (`game/race/startSlots.js`), vue d'ensemble pour une case vide (tout le circuit, reculée dans les cases étroites ; le brouillard est écarté le temps de cette case).
- `fitCellFraming` : au-delà du 16:9 (ex. 2 joueurs en paysage, cases très larges), l'angle horizontal du 16:9 est conservé et la caméra recule d'autant. Sans cela, les bords de l'image sont fortement déformés.
- FOV des joueurs : réglage du joueur (`settingsStore.fov`).

## HUD par case (`PlayerViewportHud`)

- Étiquette du joueur (numéro sur sa couleur, visage et nom du personnage), objet, tour + temps, vitesse, position (ordre sur la grille, sur le nombre de joueurs).
- La case est un conteneur `[container-type:size]` : les tailles suivent la **largeur** de la case (`@xs`, `@md`, `@3xl`...) et sa **hauteur** (`cell-short:` < 15rem masque l'objet, `cell-low:` < 24rem masque la vitesse). `overflow-hidden` : un HUD ne déborde jamais sur la case voisine.
- Actions communes (paramètres, quitter) en haut à droite de l'écran ; la mention « démo » seulement en solo. Le nom du personnage est masqué dans les cases étroites (< 20rem), pour laisser la place à ces actions.

## Interface et tests

- `render_game_to_text()` : `splitScreen` (par case : `playerId` ou null, `pixels` [gauche, haut, largeur, hauteur], position de la caméra), `hud.viewports` (position de chaque joueur), `scene.racers`.
- Sélecteurs : `section[data-player="P1"]`, `#hud-settings-btn`, `#hud-exit-btn`.

## Performance

Une passe de rendu par case (jusqu'à 8). La scène reste légère (formes partagées, 7 GLB clonés). Le pixel ratio reste plafonné par le preset de qualité. Le HUD ne se re-rend pas par frame (chrono et vitesse en transitoire).

## Conformité règles d'or

- [x] Aucun dégradé linéaire ; séparations et cadres en couleurs pleines
- [x] Aucun emoji ; icône Map pour la vue d'ensemble
- [x] Tailwind uniquement (variantes de hauteur déclarées dans `index.css` via `@custom-variant`)
- [x] Apparition du HUD par Motion (variantes existantes), aucune animation 3D ajoutée
- [x] UI et 3D séparées : elles partagent seulement `config/splitScreen.js` et les stores
- [x] Rien d'une phase suivante : karts immobiles, caméras fixes

## Évolutions prévues

Phase 2 : les caméras de poursuite suivent les karts en mouvement ; vitesse et position réelles par joueur.
