# Lobby : « Prêt » par joueur

- **Type** : contrôleur + store + composant UI
- **Fichiers** : `src/game/lobbyReady.js`, `src/stores/lobbyReadyStore.js`, `src/game/matchRules.js` (`getUnreadyPlayerIds`, `areAllReady`), `src/components/menu/ReadyToggle.jsx`, `Lobby.jsx`, `LobbyPlayers.jsx`
- **Phase** : 1F

## Rôle

En local, le départ n'est plus un bouton « Lancer » : **chaque joueur se déclare prêt**. Quand tous le sont, la course démarre en écran partagé (voir [split-screen.md](split-screen.md)).

## Comportement

| Entrée | Effet |
| --- | --- |
| START ou A (périphérique du joueur) | Le joueur est prêt |
| RETOUR (périphérique du joueur) | Il ne l'est plus |
| Bouton de sa ligne (`#P<n>-ready-btn`, souris / tactile) | Bascule prêt / pas prêt |
| Dernier joueur prêt | `startMatch()` : écran de jeu, une case par joueur |

- État remis à zéro à chaque entrée dans le lobby (`beginLobby`, appelé par `continueToLobby`).
- Se déclarer prêt est refusé si la partie ne peut pas démarrer (sélections incomplètes).
- Pied de page : nombre de joueurs pas encore prêts, puis « Tout le monde est prêt ».
- En ligne : inchangé, `#lobby-start-btn` désactivé tant que smkw-api n'existe pas.

## Interface

- `setPlayerReady(playerId, ready)`, `handleLobbyInput(playerInput)`, `beginLobby()`.
- `render_game_to_text().localPlayers[].ready`.
- Bouton : `data-ready`, `aria-pressed`.

## Performance

Chaque bouton s'abonne seulement à l'état de son joueur.

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji ; icônes Flag (pas prêt) et CircleCheck (prêt)
- [x] Tailwind uniquement ; clic `motion-ok:active:scale-95`
- [x] Aucune touche en dur : actions abstraites via `usePlayerInput`
- [x] Aucun texte en dur (`lobby.setReady`, `lobby.ready`, `lobby.cancelReady`, `lobby.readyPending`, `lobby.allReady`)
- [x] Rien d'une phase suivante

## Évolutions prévues

Réseau : l'état prêt de chaque joueur sera synchronisé par la room Colyseus.
