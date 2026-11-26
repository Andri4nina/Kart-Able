# Mini-carte de course

- **Type** : composant UI (HUD)
- **Fichiers** : `smkw-ui/src/components/ui/hud/RaceMinimap.jsx`, `components/tracks/TrackMinimap.jsx`, `game/track/trackOutline.js` (`transform`), `stores/telemetryStore.js` (`racers`), `game/race/racePublish.js`, `components/screens/split/PlayerViewportHud.jsx`
- **Phase** : 3D

## Rôle

Voir où l'on est sur le circuit et où sont les autres : la carte du circuit (lacs, route, ligne de départ), en bas à droite de la case du joueur, au-dessus de sa place, avec un point par kart :
- pilotes ordinateur en gris ;
- joueurs à leur couleur ;
- le joueur de la case plus gros, cerclé et au premier plan.

## Interface

- `telemetryStore.racers` : `{ count, x, z }`, tableaux réutilisés dans l'ordre de la grille (`getRaceRoster`).
- `getTrackOutline(id).transform` : `{ minX, minZ, scale, pad }` (monde vers carte).
- Sélecteur : `[data-hud=minimap]`, un `circle` par kart.

## Performance

Points déplacés en transitoire (attributs SVG), aucun re-render par frame ; masquée dans les très petites cases.

## Conformité règles d'or

- [x] Aucun dégradé, aucun emoji ; couleurs des joueurs par classes Tailwind (`fill-player-*`)
- [x] Texte d'accessibilité par `t('hud.minimap')`
- [x] L'UI lit la télémétrie (store) ; aucune importation de la 3D
