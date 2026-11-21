# Stores (Zustand)

- **Type** : état
- **Fichiers** : `src/stores/*.js`
- **Phase** : 1, étendu en 1B

## Rôle

Seul canal de communication entre l'UI et la scène 3D, et entre les couches navigation / configuration / systèmes.

| Store | Couche | Contenu | Persisté | Lecture recommandée |
| --- | --- | --- | --- | --- |
| `navigationStore` | Navigation | `stack`, `direction`, `wipeId`, `settingsOpen` ; `navigate`, `back`, `resetTo`, `openSettings`, `closeSettings` | Non | UI : `selectCurrentScreen` ; 3D : `getState()` |
| `matchSetupStore` | Configuration | `modeId`, `playType`, `online` ; `selectMode` (réduit aussi les joueurs locaux à la limite du mode), `selectPlayType`, `hostOnlineMatch`, `joinOnlineMatch` | Non | Sélecteurs + `useShallow` |
| `localPlayersStore` | Joueurs | `slots` (PlayerSlot[] P1...P8) ; `join`, `markReady`, `leave`, `trimTo`, `reset` | Non | Sélecteurs ; slots inchangés = même référence (composants mémoïsés) |
| `characterSelectionStore` | Sélection | Instance de `createSelectionStore` (unique) : `selections[playerId]` = `{ status: 'selecting'/'confirmed', preselectedId, confirmedId, lastMove, rejections }` ; `begin`, `move`, `confirm` (refuse un personnage réservé), `cancel`, `reset` | Non | Sélecteur par joueur ; règles dans `game/selection/selectionRules.js` |
| `vehicleSelectionStore` | Sélection | Instance de `createSelectionStore` (non unique) pour les véhicules | Non | Idem |
| `lobbyReadyStore` | Lobby | `ready` ({ [playerId]: true }) ; `begin`, `setReady` | Non | Sélecteur par joueur ; orchestration dans `game/lobbyReady.js` |
| `portraitStore` | Présentation | `portraits` ({ [characterId]: PNG data URL }) ; `setPortrait` | Non | Sélecteur par personnage (`CharacterAvatar`) ; écrit par `PortraitStudio` (3D) |
| `trackSelectionStore` | Sélection | Instance de `createSelectionStore` pour le circuit (un seul joueur inscrit : P1) | Non | Sélecteur du joueur qui choisit |
| `bindingsStore` | Entrées | `bindings` (profil -> action -> touches / boutons) ; `assign`, `clear`, `reset` (règles dans `input/bindingRules.js`) | Oui (`smkw-bindings`) | Tables de lecture : `input/bindingLookup.js` ; UI : sélecteur du profil affiché |
| `inputDevicesStore` | Entrées | `devices` (claviers 1 et 2, tactile, manettes détectées, `connected`) | Non | Sélecteur par `deviceId` |
| `sessionStore` | Systèmes | `match` (config figée) ; `begin`, `end` | Non | Futurs systèmes de jeu |
| `localeStore` | i18n | `locale` ; `setLocale` | Oui (`smkw-locale`) | Via `useTranslation()` |
| `settingsStore` | Réglages | `quality`, `motion`, `fov` | Oui (`smkw-settings`) | Sélecteurs |
| `telemetryStore` | Haute fréquence | `raceTime`, `speed` ; `tick`, `reset` | Non | **Abonnement transitoire** (`useTelemetryListener`) |

## Règles

- Les règles métier vivent dans `game/matchRules.js` ; les stores ne font que les appliquer.
- Orchestration multi-stores dans `game/session.js` (`startMatch`, `exitMatch`), pas dans les composants.
- Pas de référence à des objets Three ni de texte traduit dans un store.
- Nouveau store seulement si la fréquence ou la durée de vie des données diffère des stores existants.

## Conformité règles d'or

- [x] Aucun emoji
- [x] Aucun re-render inutile (sélecteurs fins, transitoire pour la haute fréquence)
- [x] Séparation UI / navigation / configuration / systèmes / 3D respectée
- [x] Rien d'une phase suivante (`playerStore` en phase 2)
