# Entrée des joueurs locaux (PlayerSlot, PRESS START)

- **Type** : écran + store + contrôleur + composants
- **Fichiers** : `src/components/menu/LocalMultiplayer.jsx`, `src/components/players/PlayerSlotCard.jsx`, `EmptyPlayerSlot.jsx`, `JoinedPlayerSlot.jsx`, `JoinStatusBadge.jsx`, `JoinHints.jsx`, `DeviceBadge.jsx`, `src/game/playerJoin.js`, `src/game/playerSlots.js`, `src/stores/localPlayersStore.js`, `src/config/players.js`
- **Phase** : 1C (joueurs locaux)

## Flow

```
LOCAL -> écran d'attente (grille "PRESS START") -> un périphérique appuie sur START
      -> PlayerSlot créé (premier index libre) -> animation d'entrée -> READY
      -> d'autres joueurs peuvent rejoindre (8 maximum, 1 en contre-la-montre)
      -> CONTINUE (bouton, ou START d'un joueur READY) -> sélection des personnages
```

Il n'y a **pas de bouton « Ajouter un joueur »**. Le toucher d'un emplacement vide est le START du périphérique tactile (un seul joueur tactile possible). Il existe pour que mobile et souris puissent jouer.

## PlayerSlot (`playerSlots.js`)

`{ id: 'P1'...'P8', index, number, deviceId, deviceKind, status: 'joining' | 'ready', joinToken }`

Le personnage n'est pas dans le PlayerSlot : il vit dans `characterSelectionStore` (voir [character-select.md](character-select.md)). La carte d'un joueur affiche son personnage confirmé lors d'une sélection précédente.

Composants : `PlayerSlotCard` (emplacement), `EmptyPlayerSlot` (PRESS START), `JoinedPlayerSlot` (joueur entré), `JoinStatusBadge` (Arrivée / READY).

- Un périphérique = au plus un joueur.
- Les identifiants sont stables : si P2 part, P3 reste P3 ; le prochain arrivant prend P2.
- `joinToken` évite qu'un ancien minuteur passe READY un joueur arrivé ensuite sur le même emplacement.

## Contrôleur (`playerJoin.js`)

| PlayerInput | Effet |
| --- | --- |
| START d'un périphérique libre | `joinPlayer` : création du slot, puis READY après `PLAYER_ENTRY_DURATION_MS` (520 ms) |
| START d'un joueur READY | Continuer (si tous les joueurs sont READY) |
| RETOUR d'un joueur | Il quitte la partie |

READY est piloté par un minuteur côté logique (pas par l'animation). Il fonctionne donc aussi en mouvement réduit ou si l'écran est quitté pendant l'entrée.

## Grille et animation (`PlayerSlotCard`)

- Disposition P1 P2 P3 P4 / P5 P6 P7 P8 (2 colonnes sur mobile). Les 8 emplacements tiennent sans défilement en 1280×720.
- Vide : numéro en filigrane, « APPUIE SUR START » (clignotement Tailwind, désactivé en mouvement réduit).
- Entrée (Motion) : flash de la couleur du joueur, apparition rapide avec léger scale et montée (`0,7 -> 1,07 -> 1`, `y 44 -> -6 -> 0`), numéro qui se pose, puis impulsion finale et badge READY (pop) au passage READY.
- Contenu : identifiant, avatar temporaire (silhouette, puis personnage choisi), « JOUEUR X », statut, périphérique détecté, couleur d'identification, bouton icône pour retirer le joueur.
- Les joueurs déjà présents à l'arrivée sur l'écran ne rejouent pas leur entrée.

## Conformité règles d'or

- [x] Aucun dégradé linéaire (flash et couleurs pleines)
- [x] Aucun emoji ; icônes CircleCheck, LogOut, UserRound, Keyboard, Gamepad2, Hand
- [x] Tailwind uniquement ; animation Motion légère (transform + opacité)
- [x] Aucun texte en dur ; aucune touche en dur
- [x] Rien d'une phase suivante

## Évolutions prévues

Attribution automatique de la manette qui a appuyé sur START dans les menus précédents, vibration à l'entrée, profils de joueurs.
