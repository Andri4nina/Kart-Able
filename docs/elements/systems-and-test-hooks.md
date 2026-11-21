# Systèmes invisibles et hooks de test

- **Type** : systèmes R3F + clavier
- **Fichiers** : `src/components3d/Systems/GameClock.jsx`, `src/components3d/Systems/TestBridge.jsx`, `src/game/textState.js`, `src/hooks/useGlobalHotkeys.js`
- **Phase** : 1

## GameClock

Composant R3F sans rendu. À chaque frame, si l'écran est `game` et que les réglages sont fermés, appelle `telemetryStore.tick(delta)` (delta plafonné à 0,1 s). Piloté par la boucle R3F, donc déterministe sous `advanceTime`.

## TestBridge

Expose `window.advanceTime(ms)`, `window.render_game_to_text()` et `window.resumeRealtime()` (voir [TESTING.md](../TESTING.md)).
Temps manuel : `setFrameloop('never')`, `clock.autoStart = false`, puis `advance(t)` par pas de 1/60 s. Actif si `TEST_HOOKS_ENABLED` (dev, ou `?test`).

`window.simulatePlayerInput(deviceId, action)` : simule une action d'un périphérique (`keyboard-1`, `keyboard-2`, `pointer`, `gamepad-N` créé à la volée). Permet de tester 8 joueurs sans matériel.

`render_game_to_text()` renvoie notamment : `localPlayers` (id, deviceId, status, characterId, confirmed), `inputDevices`, `screen`, `stack`, `locale`, `overlays`, `focus`, `buttons` (boutons visibles avec id, `(disabled)` le cas échéant), `matchSetup`, `match`, `hud` (en jeu, dont `viewports`), `splitScreen` (cases de l'écran partagé : joueur, pixels, caméra), `localPlayers[].ready`, `scene.racers`, `camera`, `scene.showcaseGem` (dont la couleur), `settings`.

## useGlobalHotkeys

Un seul listener `keydown` pour l'app : `F` plein écran, `Entrée` jouer (menu principal), `Échap` fermer les réglages, sinon écran précédent, sinon (en jeu) `exitMatch()`. Dans un champ texte, seul `Échap` agit (il quitte le champ). Ignore les répétitions et les combinaisons avec Ctrl/Alt/Meta. L'état est lu via `getState()`.

## useArrowNavigation

Flèches = focus suivant / précédent parmi les `[data-nav-item]` actifs du conteneur. Ignoré dans les champs de saisie.

## Conformité règles d'or

- [x] Aucun emoji
- [x] Aucun coût notable par frame
- [x] Séparation respectée (les systèmes écrivent dans les stores, l'UI lit les stores)
- [x] Rien d'une phase suivante (les contrôles du kart iront dans un hook dédié en phase 2)

## Évolutions prévues

Phase 2 : entrées kart (clavier/manette) dans `game/kart/`, rejouables frame par frame via `advanceTime`.
