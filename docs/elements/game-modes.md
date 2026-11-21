# Modes de jeu et configuration de partie

- **Type** : configuration + règles + stores
- **Fichiers** : `src/config/gameModes.js`, `src/game/matchRules.js`, `src/stores/matchSetupStore.js`, `src/game/session.js`, `src/stores/sessionStore.js`, `src/components/menu/modeVisuals.js`
- **Phase** : 1B (menu)

## Configuration (`gameModes.js`)

```js
GAME_MODES = [
  { id: 'race',      players: { local: 8, online: 32 }, teams: false },
  { id: 'timeTrial', players: { local: 1, online: 0 },  teams: false },
  { id: 'battle',    players: { local: 8, online: 32 }, teams: false },
  { id: 'rocketGol', players: { local: 8, online: 32 }, teams: true },
]
```

- Plafonds globaux : `MAX_LOCAL_PLAYERS = 8`, `MAX_ONLINE_PLAYERS = 32`.
- `players.<type> = 0` rend le type indisponible pour ce mode (Contre-la-montre : solo, pas de réseau). À ajuster ici si besoin.
- Textes : `modes.<id>.name` et `modes.<id>.description` dans chaque locale.
- Présentation (icône, couleur d'accent) : `modeVisuals.js`, avec un visuel de repli pour un mode sans entrée.
- Teinte 3D de l'objet vitrine : `MODE_COLORS` dans `components3d/World/palette.js`.

## Ajouter un mode

1. Ajouter l'entrée dans `GAME_MODES`.
2. Ajouter `modes.<id>.name` / `.description` dans `fr.json`, `en.json`, `mg.json` (`npm run check:i18n`).
3. (Optionnel) icône et accent dans `modeVisuals.js`, couleur dans `MODE_COLORS`.

La grille du menu, les limites de joueurs, l'écran Type et le Lobby s'adaptent seuls.

## Règles (`matchRules.js`, fonctions pures)

`getGameMode`, `getPlayerLimit(mode, type)`, `isPlayTypeAvailable`, `normalizeRoomCode` / `isValidRoomCode` (6 caractères A-Z 0-9), `getStartBlocker(setup)` (`noMode`, `noPlayType`, `tooManyPlayers`, `serverRequired`), `buildMatchConfig(setup)` (configuration figée).

## Stores

- `matchSetupStore` : `modeId`, `playType`, `online { role, code }`. Changer de mode réduit les joueurs locaux (`localPlayersStore`) à la nouvelle limite et annule un type devenu indisponible.
- `sessionStore` : `match` (config figée) posée par `startMatch()`, effacée par `exitMatch()`. C'est l'entrée des futurs systèmes de jeu : `players: [{ id: 'P1', index, deviceId, deviceKind, characterId }]`.
- Blocages de départ en local : `noPlayers`, `tooManyPlayers`, `charactersPending` (tous les personnages doivent être confirmés), `duplicateCharacters` (deux joueurs sur le même personnage), `vehiclesPending` (véhicules non confirmés). `getStartBlocker(setup, slots, picks)` et `buildMatchConfig(setup, slots, picks)` lisent les sélections confirmées (`picks = { characters, vehicles }`, voir `session.getCurrentPicks`). `match.players[]` contient `characterId` et `vehicleId`.

## Conformité règles d'or

- [x] Aucun emoji
- [x] Modes définis une seule fois, aucun mode codé en dur dans les composants
- [x] Config sans React ni classes CSS (présentation séparée)
- [x] Rien d'une phase suivante (aucun gameplay, aucun appel réseau)

## Évolutions prévues

Options par mode (tours, durée, équipes) quand le gameplay arrivera ; `serverRequired` levé par le client Colyseus.
