# Assignation des touches

- **Type** : système (entrées) + store + écran (onglet Contrôles des paramètres)
- **Fichiers** : `src/input/` (`actions.js`, `bindingDefaults.js`, `bindingRules.js`, `bindingLookup.js`, `bindingCapture.js`, `useBindingCapture.js`, `keyLabels.js`, `useKeyboardLayout.js`), `src/stores/bindingsStore.js`, `src/hooks/useInputLabels.js`, `src/components/settings/` (`ControlsPanel.jsx`, `BindingRow.jsx`, `BindingNotice.jsx`), `src/components/ui/KeyCap.jsx`
- **Phase** : 1I

## Rôle

Chaque joueur peut changer ses touches : Clavier 1, Clavier 2 et Manettes (une disposition commune à toutes les manettes). Deux touches par action. Les changements s'appliquent tout de suite et sont mémorisés (localStorage `smkw-bindings`).

## Actions

| Groupe | Actions | Utilisées |
| --- | --- | --- |
| Menus | Start / Pause, Valider, Retour, Haut, Bas, Gauche, Droite | maintenant |
| Course | Accélérer, Freiner / reculer, Tourner à gauche / à droite, Drift / saut, Utiliser l'objet | dès que les karts roulent (phase 2) |

Une même touche peut servir dans les menus et en course (Haut / Accélérer). START vaut partout (rejoindre, pause).

## Touches par défaut

| Profil | Start | Retour | Directions | Course |
| --- | --- | --- | --- | --- |
| Clavier 1 | Entrée, Entrée pavé | Retour arr. | flèches | flèches, Maj droite (drift), Ctrl droite (objet) |
| Clavier 2 | Espace | Maj gauche | ZQSD (WASD physique) | ZQSD, A (drift), E (objet) |
| Manettes | Start | B, Select | croix | A accélère, B freine, RB / RT drift, LB / LT objet |

Le stick gauche dirige toujours (non réassignable).

## Règles (`bindingRules.js`, pures)

- **Réservées** : Échap (navigation, annule la capture), F (plein écran), Tab (focus), F1 à F12, touches système.
- **Autre clavier** : une touche du Clavier 2 est refusée pour le Clavier 1 (et inversement), sinon une frappe ferait agir deux joueurs.
- **Même profil, même contexte** : les touches sont échangées (l'autre action reçoit l'ancienne touche).
- **START obligatoire** : il garde au moins une touche, sinon le périphérique ne pourrait plus rejoindre.
- Réglages sauvegardés relus avec `normalizeBindings` : actions nouvelles complétées, entrées invalides écartées.

## Fonctionnement

- `bindingLookup.js` reconstruit les tables (code -> actions, bouton -> action) seulement quand l'assignation change ; `inputManager` (clavier) et `gamepadPolling` (manettes) les lisent.
- Capture (`bindingCapture.js`) : écouteur en phase de capture sur `window` pendant l'attente, qui neutralise la touche (ni Échap qui fermerait les paramètres, ni le jeu) ; pour les manettes, le premier bouton nouvellement appuyé.
- Noms affichés : `keyLabels.js` (touches nommées traduites, boutons « A / Croix »...), adaptés à la disposition réelle du clavier (`useKeyboardLayout` : Keyboard API si disponible, et apprentissage des touches frappées, d'où « ZQSD » en AZERTY).
- Toutes les aides à l'écran suivent l'assignation : comment rejoindre, comment quitter, panneaux de sélection (« Flèches · Entrée »).

## Interface et tests

- `#settings-tab-controls`, `#controls-profile-<keyboard1|keyboard2|gamepad>`, `#bind-<profil>-<action>-<0|1>`, `#unbind-<profil>-<action>-<0|1>`, `#bindings-reset-btn`.
- `render_game_to_text().bindings`.

## Conformité règles d'or

- [x] Toute lecture de touche ou de bouton reste dans `src/input` ; les écrans ne voient que des actions et des noms affichables
- [x] Aucun texte en dur (actions, touches, boutons, messages traduits) ; aucun emoji (flèches en caractères typographiques)
- [x] Tailwind uniquement ; zone défilante `scrollbar-game` ; clignotement de l'attente derrière `motion-ok:`
- [x] Rien d'une phase suivante : les actions de course sont réglables mais pas encore utilisées

## Évolutions prévues

Phase 2 : les actions de course pilotent le kart ; sensibilité du stick ; vibrations.
