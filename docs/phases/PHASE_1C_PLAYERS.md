# Phase 1C — Entrée des joueurs locaux et sélection des personnages

**Statut** : terminée (2026-09-25)
**Objectif** : LOCAL PLAYER JOIN, puis PLAYER LOBBY, puis CHARACTER SELECT. Aucun gameplay, aucune physique, aucun réseau.

## Périmètre

Inclus :
- Couche d'entrée abstraite : InputDevice (claviers 1 et 2, manettes Gamepad API, tactile), actions, PlayerInput, PlayerSlot (P1...P8).
- Entrée au START uniquement (aucun bouton « Ajouter un joueur »), animation d'entrée Motion, statut READY, départ d'un joueur par RETOUR.
- Grille P1 P2 P3 P4 / P5 P6 P7 P8, jusqu'à 8 joueurs (limite du mode).
- CONTINUE : bouton ou START d'un joueur READY, jamais automatique.
- Sélection des personnages : un curseur par joueur, avatar, nom, type, statistiques, confirmation indépendante.
- 4 archétypes en configuration : Tank, Standard, Speed, Special (Aéroglisseur, mécanique Survol).
- Barre de défilement du jeu `scrollbar-game` pour les zones responsives.

Exclus : physique, kart, conduite, drift réel, circuit, objets, bots, réseau, Colyseus, matchmaking.

## Dépendances ajoutées

Aucune (Gamepad API native, Motion et Zustand déjà présents).

## Vérifications

- `npm run check` : oxlint, règles d'or, i18n (3 langues, 177 clés, aucun texte en dur). `npm run build` OK.
- Navigateur : clavier 1 (Entrée), clavier 2 (Espace), manette via lecture Gamepad API simulée (START, B), tactile (toucher), 5 manettes virtuelles jusqu'à 8 joueurs (9e refusé), départ, sélection, confirmation / annulation, lobby, configuration de partie, contre-la-montre solo, entrées ignorées pendant les Paramètres ; aucune erreur console après rechargement.

## Prêt pour la suite

- Phase 2 (kart) : `sessionStore.match.players` fournit P1...P8, périphérique et personnage de chaque joueur ; `CHARACTER_CLASSES[...].stats` et `mechanic` à convertir en paramètres physiques ; ajouter les actions de conduite dans `input/actions.js`.
- Manettes dans les menus : réutiliser `subscribeToInput` pour piloter le focus (croix, A, B).
- Onglet Contrôles : remappage via `keyboardProfiles.js` / `gamepadMapping.js`.
