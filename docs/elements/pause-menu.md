# Menu pause et changement de circuit

- **Type** : écran (superposé au jeu) + système + store
- **Fichiers** : `smkw-ui/src/game/pauseMenu.js`, `smkw-ui/src/stores/pauseStore.js`, `smkw-ui/src/components/screens/race/PauseMenu.jsx`, `smkw-ui/src/game/raceFlow.js` (`changeTrack`), `raceSequence.js` (`buildChangedMatch`), `smkw-ui/src/components3d/Systems/RaceSystem.jsx`, `smkw-ui/src/components/ui/hud/HudActions.jsx`, `smkw-ui/src/hooks/useGlobalHotkeys.js`
- **Phase** : 2E

## Rôle

Pendant le départ et la course, START (n'importe quel joueur), Échap ou le bouton Pause du HUD ouvrent le menu. La course est alors figée. Le menu propose :
- **Reprendre** ;
- **Changer de circuit** : choisir une coupe, puis un circuit. La course en cours est abandonnée sans points et la nouvelle part aussitôt ; elle remplace la course en cours dans le programme ;
- **Quitter la partie**.

Navigation : haut / bas (ou gauche / droite), A pour valider, RETOUR pour la vue précédente, START pour reprendre. Tout est aussi cliquable. Après la course (résultats), Échap quitte la partie comme avant.

## Interface

- `pauseStore` : `open`, `view` ('menu' | 'cups' | 'tracks'), `index`, `cupId`.
- Sélecteurs : `#pause-menu[data-view]`, `[data-pause-item]`, `#hud-pause-btn`.

## Dépendances

`raceStore.phase` (pause seulement en course), `raceFlow.changeTrack`, `session.exitMatch`. Aucune dépendance npm.

## Performance

Monté seulement en course ; le panneau n'existe que menu ouvert.

## Conformité règles d'or

- [x] Aucun dégradé linéaire ; aucun emoji ; icônes lucide utiles (Pause, Play, ArrowLeftRight, LogOut, Trophy)
- [x] Tailwind uniquement ; zone qui défile : `scrollbar-game`
- [x] Animation Motion courte (mouvement réduit respecté par MotionConfig)
- [x] Aucun texte en dur (`pause.*`) ; actions abstraites (`src/input/`)
- [x] Rien d'une phase suivante

## Évolutions prévues

Pause partagée en réseau (vote) ; réglages rapides dans le menu.
