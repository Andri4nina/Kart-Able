# Grille de départ (karts des joueurs)

- **Type** : objets 3D + configuration
- **Fichiers** : `src/config/startGrid.js`, `src/components3d/Racers/StartGrid.jsx`, `RacerKart.jsx`, `src/components3d/Vehicles/vehicleAssets.js` (`seat`, `yaw`)
- **Phase** : 1F, pilotes GLB et karts peints en 1G

## Rôle

Pendant une partie, chaque joueur a son kart sur la grille de départ : le véhicule GLB choisi **peint à la couleur de son personnage** ([kart-paint.md](kart-paint.md)), son personnage GLB au volant (hauteur selon son gabarit, animation d'attente), et une **case de départ peinte à la couleur du joueur**. Les karts sont immobiles (la conduite arrive en phase 2).

## Disposition

Sur circuit : grille de 32 places (4 colonnes en quinconce, 8 rangées) derrière la ligne, orientée dans le sens de course (`game/track/trackLayout.js`, voir [track-generation.md](track-generation.md)). Les joueurs locaux prennent les premières places. Dans l'arène (modes sans circuit), la grille de démonstration ci-dessous (`config/startGrid.js`) :


- Deux colonnes (x = -1,6 / +1,6), une rangée tous les 4,5 m à partir de z = 9,5 : P1 devant à gauche, P2 devant à droite, etc.
- Les karts regardent -Z (vers le centre de l'arène) ; la caméra de poursuite est derrière eux (+Z).
- Ordre = ordre des joueurs dans la partie (`sessionStore.match.players`).

## Véhicule et pilote

- `yaw` corrige l'orientation de chaque GLB (le Flamant est exporté dans la longueur en X : un quart de tour).
- `seat` (hauteur des pieds, recul) place le pilote, réglé à l'œil pour chaque véhicule depuis une vue de côté.
- Le pilote est le modèle de la sélection (`CharacterModel`), à 1 unité de haut pour un grand : il se tient debout, le bas du corps caché dans la carrosserie.

## Interface et tests

- Groupe `start-grid`, un groupe `racer-P<n>` par joueur ; `render_game_to_text().scene.racers`.
- Absente hors partie : le menu garde sa scène décorative.

## Performance

Formes et matériaux partagés (`characterResources`), GLB clonés depuis le cache. Aucun `useFrame`.

## Conformité règles d'or

- [x] Aucun dégradé linéaire ; couleurs pleines (couleurs des joueurs)
- [x] Aucun emoji
- [x] Aucune animation (karts immobiles)
- [x] Lecture de la partie via `sessionStore` uniquement
- [x] Rien d'une phase suivante : ni physique, ni conduite, ni circuit

## Évolutions prévues

Phase 2 : le kart devient un objet physique piloté, sa case reste le point de départ.
