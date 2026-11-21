# Système d'entrées (InputDevice, PlayerInput)

- **Type** : système
- **Fichiers** : `src/input/actions.js`, `devices.js`, `inputManager.js`, `gamepadPolling.js`, `gamepadMapping.js`, `bindingLookup.js`, `playerInput.js`, `usePlayerInput.js`, `src/stores/inputDevicesStore.js` ; assignation : [key-bindings.md](key-bindings.md)
- **Phase** : 1C (joueurs locaux), touches réassignables en 1I

## Rôle

Transformer n'importe quel périphérique en **actions abstraites**, puis rattacher ces actions à un joueur. Aucun écran ne connaît une touche ou un bouton physique, et le clavier n'est jamais supposé.

```
Périphérique physique -> InputDevice + action -> PlayerInput { action, device, playerId } -> contrôleur d'écran
```

## Actions (`actions.js`)

Menus : `start`, `confirm`, `back`, `up`, `down`, `left`, `right`. Course (assignables, utilisées en phase 2) : `accelerate`, `brake`, `steerLeft`, `steerRight`, `drift`, `item`. Chaque action a un contexte (`ACTION_CONTEXTS` : menus, course, ou global pour START) et un bit (`ACTION_BITS`) pour comparer l'état d'une manette sans allocation.

## Périphériques (`devices.js`)

Touches par défaut ci-dessous ; chacune se change dans Paramètres > Contrôles (voir [key-bindings.md](key-bindings.md)).

| InputDevice | id | START | Déplacement | Retour |
| --- | --- | --- | --- | --- |
| Clavier 1 | `keyboard-1` | Entrée | Flèches | Retour arrière |
| Clavier 2 | `keyboard-2` | Espace | ZQSD (AZERTY) / WASD (QWERTY), touches physiques | Maj gauche |
| Manette N | `gamepad-<index>` | START (bouton 9) ; A (0) = confirmer | Croix (12-15) + stick gauche | B (1) ou Select (8) |
| Tactile / souris | `pointer` | Toucher un emplacement « PRESS START » | Boutons à l'écran | Boutons à l'écran |

Un clavier physique accueille deux joueurs. Les touches utilisent `event.code` (position physique), donc ZQSD en AZERTY et WASD en QWERTY. `Échap` reste la navigation globale, `F` le plein écran.

## Gestionnaire (`inputManager.js`)

- **Inactif tant qu'aucun écran n'est abonné** (`subscribeToInput`), donc aucun coût sur les autres écrans.
- Clavier : un listener `keydown` ; la touche est cherchée dans l'assignation (`bindingLookup.js`) et peut émettre plusieurs actions (menus et course). Ignore les champs texte, les répétitions et Ctrl/Alt/Meta. Un bouton atteint au clavier (`:focus-visible`) garde son activation native par Entrée / Espace.
- Manettes (`gamepadPolling.js`) : boutons lus d'après l'assignation commune des manettes ; `gamepadconnected` relance une lecture `navigator.getGamepads()` à chaque frame, **uniquement tant qu'au moins une manette est connectée**. Détection par front (appui) via masque binaire. La boucle s'arrête d'elle-même sans manette.
- Déconnexion : le périphérique passe `connected: false` (le joueur affiche « Déconnecté »). Il reprend sa place à la reconnexion (même index).
- Si un abonné utilise l'entrée, la touche est neutralisée (`preventDefault`).
- `emitPointerInput(action)` : entrée du périphérique tactile depuis l'UI.
- `injectDeviceInput(deviceId, action)` : tests uniquement (crée une manette virtuelle si besoin).

## PlayerInput (`playerInput.js`, `usePlayerInput.js`)

`usePlayerInput(handler)` abonne un écran tant qu'il est affiché, ignore tout pendant les Paramètres, et appelle `handler({ action, device, playerId })`, où `playerId` vaut `P1`...`P8` ou `null` si le périphérique n'a pas rejoint.

## Ajouter un périphérique

1. Fabrique dans `devices.js` (id, kind, clé i18n du nom) et, s'il a des touches, un profil dans `bindingDefaults.js`.
2. Lecture dans `inputManager.js` qui appelle `emit({ device, action })`.
3. Icône dans `components/players/playerVisuals.js` (`getDeviceVisual`).

Les écrans et contrôleurs ne changent pas.

## Conformité règles d'or

- [x] Aucun emoji ; icônes Keyboard, Gamepad2, Hand, Unplug
- [x] Aucune logique par frame sans manette connectée
- [x] Aucune touche physique dans les écrans
- [x] Rien d'une phase suivante : les actions de course sont émises mais aucun écran ne les utilise encore

## Évolutions prévues

Navigation des menus à la manette (mêmes actions), remappage (onglet Contrôles), vibrations, commandes du kart (accélérer, freiner, drift, objet) en phase 2.
