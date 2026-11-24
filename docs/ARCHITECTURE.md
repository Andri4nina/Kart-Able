# Architecture — Kart Able (code SMKW, kart 3D multijoueur web)

Principe directeur : **architecture très simple au départ**, complexifiée uniquement quand le prototype fonctionne.
Règles non négociables : [REGLES_D_OR.md](REGLES_D_OR.md).

---

## 1. Vue d'ensemble

```
super mario kart web/
├── smkw-ui/     Frontend (jeu, UI, rendu 3D)
├── smkw-api/    Backend (serveur de jeu autoritaire) — à partir de la phase multijoueur
├── docs/        Règles, architecture, fiches par élément et par phase
├── CLAUDE.md    Consignes pour les agents
└── progress.md  Journal de progression (workflow develop-web-game)
```

| Couche | Technologies | Rôle |
| --- | --- | --- |
| Frontend `smkw-ui` | React, Vite, React Three Fiber, Three.js, Drei, Tailwind CSS, Motion, Zustand, lucide-react | Rendu 3D, UI, entrées joueur, prédiction client |
| Physique | Maison, calcul pur (`game/race`) | Conduite arcade, drift, turbo, chocs en capsules ; réglages dans `config/kartTuning.js` (portable tel quel côté serveur) |
| Backend `smkw-api` (phase multi) | Rust (tokio, axum, WebSocket) | Serveur autoritaire léger : rooms, simulation à pas fixe, synchronisation d'état. Squelette seulement aujourd'hui |
| Données (plus tard) | PostgreSQL | Uniquement comptes et progression |
| Déploiement | Vercel (front), VPS / Railway / Fly.io (game server) | |

Capacités visées : **jusqu'à 8 joueurs sur un appareil**, **jusqu'à 32 en réseau** (`config/gameModes.js`).

---

## 2. Couches du frontend

```
UI React            components/ (menu, écrans, HUD)          DOM + Tailwind + Motion + i18n
   |  appelle navigate()/back(), lit les choix, déclenche startMatch()
   v
Navigation          navigation/screens.js + navigationStore  pile d'écrans, sens, overlays
   |
   v
Configuration       config/gameModes.js + game/matchRules.js  modes, limites, validations
de jeu              + matchSetupStore                         choix du joueur dans le menu
   |
   v
Systèmes de jeu     game/session.js + sessionStore            config figée de la partie
(futurs)            (phase 2+ : kart, course, bataille, réseau)

Scène 3D            scenes/ + components3d/                   lit navigation, réglages et choix
                                                              via getState() dans useFrame

Entrées             input/ (InputDevice -> actions)            claviers, manettes, tactile
                    -> PlayerInput (action + device + P1..P8) -> contrôleurs game/playerJoin.js,
                                                                 game/characterSelect.js, game/vehicleSelect.js,
                                                                 game/lobbyReady.js
```

- L'UI et la 3D ne s'importent **jamais** mutuellement : seul `App.jsx` compose `GameCanvas` et `UILayer`.
- Les écrans ne lisent jamais une touche : ils s'abonnent à `usePlayerInput(handler)` et reçoivent des `PlayerInput` (voir [elements/input-system.md](elements/input-system.md)).
- `navigation/screens.js` ne contient que des données (ids, plan caméra, étape). L'UI associe les ids aux composants (`UILayer`), la 3D aux plans caméra (`CameraRig`).
- Valeurs basse fréquence : sélecteurs Zustand. Valeurs haute fréquence (chrono, vitesse) : `telemetryStore` + abonnement transitoire.
- Textes : `src/locales/*.json` via `useTranslation()` (voir [elements/i18n.md](elements/i18n.md)).

## 3. Parcours du menu

```
MENU PRINCIPAL  --Jouer-->  MODE DE JEU  -->  TYPE DE PARTIE
  Garage (bientôt)          Course               |
  Paramètres                Contre-la-montre     +--Local (8)-->  JOUEURS LOCAUX  -->  PERSONNAGES  -->  VÉHICULES  -->  CIRCUITS*  -->  LOBBY  --tous prêts-->  JEU (écran partagé, circuit)
  Langue                    Bataille             |                PRESS START         curseur par joueur
                            Rocket Gol           |                entrée + READY      confirmation
                                                 |                CONTINUE
                                                 +--Réseau (32)-> PARTIE EN RÉSEAU  -->  LOBBY  (départ bloqué sans serveur)
                                                                  créer / rejoindre / matchmaking (bientôt)
```

* Circuits : modes de course seulement (coupe puis circuit, choisis par P1).

Parcours local : JOIN, puis animation d'entrée, puis READY, puis CONTINUE, puis CHARACTER SELECT, puis CONFIRM, puis VEHICLE SELECT, puis CONFIRM, puis TRACK SELECT (modes de course), puis LOBBY, puis PRÊT (chaque joueur), puis JEU en écran partagé (une case par joueur).

`Échap` = écran précédent (pile), ou retour au menu depuis le jeu. Les paramètres s'ouvrent en overlay depuis n'importe quel écran.

---

## 4. Arborescence `smkw-ui/src`

```
src/
├── main.jsx, App.jsx, index.css
├── locales/                     fr.json (référence), en.json, mg.json
├── i18n/
│   ├── locales.js               Découverte auto des langues, détection navigateur
│   ├── translate.js             Clés pointées, {{variables}}, pluriels, ordinaux, repli fr
│   └── useTranslation.js        Hook t() + variante hors React
├── navigation/
│   └── screens.js               SCREENS, SCREEN_META (plan caméra, étape), MENU_FLOWS (local / réseau)
├── input/                       Couche d'entrée (aucune touche en dur ailleurs)
│   ├── actions.js               Menus (start, confirm, back, directions) et course (accélérer, freiner, drift...)
│   ├── bindingDefaults.js, bindingRules.js  Touches par défaut, profils, règles d'assignation (pures)
│   ├── bindingLookup.js         Tables de lecture des touches, reconstruites au changement d'assignation
│   ├── bindingCapture.js, useBindingCapture.js  Capture de la prochaine touche / du prochain bouton
│   ├── keyLabels.js, useKeyboardLayout.js  Noms affichables (disposition réelle du clavier)
│   ├── devices.js               InputDevice : claviers 1 et 2, manettes, tactile
│   ├── gamepadMapping.js        Disposition standard Gamepad API -> actions
│   ├── inputManager.js          Écoute clavier, émission ; gamepadPolling.js : manettes (seulement si connectées)
│   ├── playerInput.js           PlayerInput = action + device + playerId
│   └── usePlayerInput.js        Abonnement d'un écran aux entrées
├── config/
│   ├── gameConfig.js            Marque, qualité, FOV, HUD démo, flags de test
│   ├── gameModes.js             GAME_MODES, limites 8 / 32, types
│   ├── players.js               P1...P8, statuts, durée d'entrée
│   ├── characters.js            CHARACTER_CLASSES, CHARACTER_SIZES (petit, moyen, grand), 16 CHARACTERS (couleur d'identité)
│   ├── vehicles.js              7 VEHICLES (statistiques)
│   ├── stats.js                 STAT_KEYS, STAT_MAX
│   ├── cups.js, tracks.js       Coupes (Kairos Cup) et circuits : points de contrôle, lacs, ambiance, graine
│   ├── kartTuning.js            Réglages de conduite : courbes de stats, drift, turbos, chocs, murs, relief
│   ├── items.js                 Objets, tirage selon la place, cases à objets
│   ├── trackThemes.js           Ambiances : couleurs du sol et de l'eau, essences d'arbres, densités
│   ├── splitScreen.js           Écran partagé : grille par nombre de joueurs, rectangles des cases (UI + 3D)
│   ├── startGrid.js             Grille de départ : case de chaque joueur
│   └── characterPreview.js      Géométrie de la rangée de previews 3D (partagée UI / scène)
├── game/                        Logique pure / orchestration (sans React)
│   ├── matchRules.js            Limites par mode, validation du code, blocages, config figée
│   ├── playerSlots.js           PlayerSlot : création, premier index libre, curseur
│   ├── playerJoin.js            START rejoint / continue, RETOUR quitte
│   ├── selection/               Sélection générique : selectionRules.js (pur), createSelectionController.js
│   ├── characterSelectionRules.js  Personnages : unicité, validation (au-dessus du générique)
│   ├── characterSelect.js       Contrôleur personnages -> véhicules
│   ├── vehicleSelect.js         Contrôleur véhicules -> lobby
│   ├── trackSelect.js           Contrôleur du choix du circuit (P1) -> lobby
│   ├── track/                   Génération pure : trackPath (spline, hauteurs), trackHeight (relief), lakes,
│   │                            trackLayout (grille 32, portes), lapRules
│   │                            (checkpoints, anti-raccourci), trackGeometry, trackOutline, noise
│   ├── race/startSlots.js       Place de départ d'un joueur (circuit ou arène)
│   ├── race/                    Course (calcul pur) : raceWorld (pas fixes), kartPhysics (conduite), kartDrift
│   │                            (saut + mini-turbo 3 paliers), kartBoost (turbo centralisé), kartCollisions +
│   │                            kartCapsule (chocs), kartVertical (relief), trackTracking (surface, murs, eau),
│   │                            raceControls, botDriver, racePace...
│   ├── items/                   Objets (calcul pur) : itemSystem (cases, roulette, usage), itemRules, itemBehaviors,
│   │                            itemEntities (flaques, orbes en réserve fixe), kartHit (tête-à-queue), botItems
│   ├── matchConfig.js, lobbyRules.js  Configuration figée de la partie ; règles du lobby
│   ├── lobbyReady.js            Prêt par joueur ; départ quand tous sont prêts
│   ├── session.js               startMatch() / exitMatch()
│   ├── format.js                Formatage chrono
│   └── textState.js, textStateParts.js  Payload de render_game_to_text
├── stores/
│   ├── navigationStore.js       Pile d'écrans, direction, wipe, overlay réglages
│   ├── matchSetupStore.js       Mode, type, session en ligne
│   ├── localPlayersStore.js     PlayerSlot[] (P1...P8)
│   ├── createSelectionStore.js  Fabrique de store de sélection par joueur
│   ├── characterSelectionStore.js  Sélection des personnages (unique)
│   ├── vehicleSelectionStore.js    Sélection des véhicules (partageable)
│   ├── portraitStore.js         Portraits des personnages (rendus par la 3D, affichés par l'UI)
│   ├── lobbyReadyStore.js       Joueurs prêts dans le lobby local
│   ├── trackSelectionStore.js   Choix du circuit (système de sélection générique, P1)
│   ├── inputDevicesStore.js     Périphériques connus et connexion
│   ├── bindingsStore.js         Assignation des touches (persistée)
│   ├── sessionStore.js          Partie en cours (config figée)
│   ├── localeStore.js           Langue (persistée)
│   ├── settingsStore.js         Qualité, animations, FOV (persistés)
│   └── telemetryStore.js        Chrono, vitesse (haute fréquence)
├── hooks/                       useReducedMotion, useGlobalHotkeys, useArrowNavigation, useTelemetryListener
├── animations/                  transitions.js, variants.js
├── components/
│   ├── layout/                  UILayer (écran -> composant), ScreenWipe
│   ├── menu/                    MainMenu, GameModeMenu, GameModeCard, PlayTypeMenu, PlayTypeCard,
│   │                            LocalMultiplayer, CharacterSelect, VehicleSelect, TrackSelect, OnlineMultiplayer,
│   │                            Lobby, LobbySummary, LobbyPlayers, LobbyFooter, ReadyToggle,
│   │                            MenuPage, MenuButton, SettingsButton, BackButton, MenuStepper,
│   │                            LanguageSelector, CapacityBanner, modeVisuals.js
│   ├── players/                 PlayerSlotCard, EmptyPlayerSlot, JoinedPlayerSlot, JoinStatusBadge, JoinHints,
│   │                            DeviceBadge, CharacterAvatar (portrait), CharacterCard (tuile),
│   │                            PanelCharacterInfo, VehicleCard, VehiclePanelInfo, StatBars, playerVisuals.js
│   ├── selection/               Écran de sélection générique : SelectionScreen, SelectionRoster, SelectionPanel,
│   │                            PanelControls, SelectionStatus, RosterCursors, PreviewLabels
│   ├── tracks/                  TrackCard, TrackMinimap (SVG), TrackPreview
│   ├── settings/                Onglets des paramètres : Langue, Graphismes, Contrôles (assignation), barre d'onglets
│   ├── screens/                 GameScreen, split/ (SplitScreenHud, PlayerViewportHud : une case par joueur), SettingsDialog
│   └── ui/                      Button, IconButton, Logo, KeyHint, SegmentedControl, SettingRow, hud/*
├── components3d/
│   ├── Camera/                  CameraRig, cameraBehaviors (menu, menuWide, lobby, selection, game),
│   │                            SplitScreenRenderer (une caméra par case), chaseCamera, splitViews
│   ├── Characters/              CharacterModel (GLB), characterAssets, prepareCharacter, PortraitStudio, renderPortrait,
│   │                            characterResources (formes partagées)
│   ├── Vehicles/                VehicleModel (GLB cloné), normalizeModel, kartPaint, vehicleAssets (fichiers dans assets/models)
│   ├── SelectionPreview/        SelectionPreviewStage (rangée par joueur), PreviewSlot, previewAnimation
│   ├── Racers/                  StartGrid, RacerKart (véhicule + pilote animé), kartPose, KartEffects
│   ├── Items/                   RaceItems : cases à objets, flaques, orbes (maillages instanciés)
│   ├── Track/                   Monde du circuit généré : texture de données, terrain, eau, route, marquages,
│   │                            herbe, végétation et décor en instances, préchargement
│   ├── World/                   Atmosphere, Lights, Ground, DemoProps, ShowcaseGem (teinte du mode)...
│   └── Systems/                 GameClock, TestBridge
├── scenes/                      GameCanvas (unique Canvas), DemoScene
└── assets/                      models/ (Character, Tree, racing : Kenney CC0), textures/, sounds/ (voir docs/CREDITS.md)
```

## 5. Cible à terme (ajouts prévus)

```
src/
├── components3d/Kart/, Track/, Items/
├── game/physics/, kart/, race/, battle/, rocketGol/, items/, camera/
├── input/                  + navigation des menus à la manette, remappage des touches
└── net/                    client WebSocket vers smkw-api (création / connexion aux rooms, matchmaking)
```

`smkw-api/` (Rust, phase multijoueur) : `src/rooms/` (une room par mode), `src/protocol/` (messages serde), `src/simulation/` (portage de `game/race`), `src/matchmaking/`. Aujourd'hui : `src/main.rs` et `src/config.rs` seulement.

---

## 6. Points d'extension

| Besoin futur | Où brancher |
| --- | --- |
| Nouveau mode de jeu | Entrée dans `GAME_MODES` + textes `modes.<id>.*` dans chaque locale + visuel dans `modeVisuals.js` (repli automatique sinon) |
| Nouvelle langue | Fichier `src/locales/<code>.json` avec `_meta.name` ; `npm run check:i18n` |
| Nouvel écran | `SCREENS` + `SCREEN_META` + une ligne dans `SCREEN_COMPONENTS` (UILayer) |
| Nouveau périphérique | Fabrique dans `input/devices.js` + lecture dans `inputManager.js` ; les écrans ne changent pas |
| Nouveau circuit / nouvelle coupe | Entrée dans `config/tracks.js` (points de contrôle, lacs, ambiance, graine) et `config/cups.js` + textes `tracks.<id>.*`, `cups.<id>.name` (voir [elements/track-generation.md](elements/track-generation.md)) |
| Nouveau personnage | GLB dans `assets/models/Character` + `characterAssets.js` + entrée dans `CHARACTERS` (`classId`, `size`, `color`) + token `--color-char-<id>` + `characters.<id>.name` dans chaque locale (voir [elements/character-classes.md](elements/character-classes.md)) |
| Nouveau véhicule | GLB dans `assets/models` + entrée dans `VEHICLES` et `vehicleAssets.js` + `vehicles.<id>.name` dans chaque locale |
| Nouvelle sélection (roues, ailes...) | `createSelectionStore` + `createSelectionController` + `SelectionScreen` (voir [elements/selection-system.md](elements/selection-system.md)) |
| Commandes du kart | Les actions de course existent déjà (assignables) : un contrôleur `game/kart/` abonné via `subscribeToInput` les lit |
| Réseau | `net/` : `hostOnlineMatch` / `joinOnlineMatch` deviennent des messages WebSocket vers smkw-api (Rust) ; `getStartBlocker` lève `serverRequired` une fois connecté |
| Gameplay d'un mode | Lire `sessionStore.match` (modeId, playType, players) au démarrage de la scène de course |
| Réglage de conduite (drift, turbo, chocs, stats) | `config/kartTuning.js` uniquement ; le contrôleur (`game/race/kartPhysics.js`, `kartDrift.js`, `kartBoost.js`, `kartCollisions.js`) ne contient aucune valeur (voir [elements/kart-driving.md](elements/kart-driving.md)) |
| Nouvelle source de turbo (pad, objet) | Entrée dans `BOOSTS` + `applyBoost(kart, id)` : la politique de cumul est commune |
| Caméra de poursuite | `components3d/Camera/chaseCamera.js` (une par case de l'écran partagé) |
| Disposition de l'écran partagé | `config/splitScreen.js` + `GRID_CLASSES` dans `SplitScreenHud.jsx` (mêmes grilles) |
| Modèles GLB / KTX2 | `assets/models`, `assets/textures` ; `vite.config.js` et `<Suspense>` déjà prêts |
