Original prompt: "on va recreer mario kart avec react three fiber vite et tailwind" — architecture Frontend (React, R3F, Drei, Rapier, Zustand, Vite) / Backend (Node.js, Colyseus, WebSocket) / Data (PostgreSQL comptes+progression) / Déploiement (Vercel + VPS/Railway/Fly.io). Dossiers : smkw-ui (front) et smkw-api (back). Créer un .md d'architecture. PHASE 1 uniquement : base technique propre, légère, performante et extensible (stack React, Vite, R3F, Three, drei, Tailwind seul pour le style, Motion pour l'UI, Zustand ; scène minimale ; écran d'accueil avec titre, PLAY, SETTINGS, petit HUD de démo ; animations courtes avec prefers-reduced-motion ; rien des phases suivantes). Suivre le skill develop-web-game. Toujours créer un .md par élément qui respecte les règles d'or : pas de linear gradient, pas d'emoji, des icônes si besoin. Spécification complète de la phase 1 : docs/phases/PHASE_1.md.

---

## 2026-09-25 — Phase 1

### Fait
- Scaffold `smkw-ui` (create-vite 9, template react, Vite 8 / Rolldown), dépendances installées.
- Tailwind v4 via `@tailwindcss/vite`, un seul CSS (`@theme` tokens + variante `motion-ok:`).
- Stores Zustand : `gameStore` (écran, overlays, transitionId), `settingsStore` (persisté), `telemetryStore` (haute fréquence).
- UI : menu (logo, PLAY, SETTINGS, raccourcis), dialogue de réglages (qualité, motion, FOV), HUD de démo, wipe de transition.
- 3D : Canvas unique, CameraRig + comportements par écran, monde de démo (podium, objet vitrine animé, cônes, pneus, blob shadows, grid drei).
- Hooks de test : `window.advanceTime`, `window.render_game_to_text`, `window.resumeRealtime` (TestBridge).
- Script `npm run check:rules` (règles d'or automatisées) ; `npm run check` = oxlint + règles.
- Docs : REGLES_D_OR, ARCHITECTURE, TESTING, phases/PHASE_1, elements/* ; CLAUDE.md ; skill projet `.claude/skills/develop-web-game`.
- Build découpé en chunks vendors (three 737 kB / 187 kB gzip ; app 35 kB).

### Tests (navigateur intégré, 1280x720)
- Menu rendu correctement, aucune erreur console.
- `render_game_to_text` OK ; `advanceTime(1000)` déterministe (objet vitrine rotationY = 0.70, y = 2.18 ; caméra en orbite).
- Réglages : ouverture via SETTINGS, Motion=Full appliqué, `Escape` ferme.
- PLAY : mode `game`, chrono = temps simulé (0.25 s puis 2.25 s), caméra qui converge vers (0, 3.2, 9.5) FOV 65.
- HUD affiché (objet, tour/chrono, actions, vitesse, position, badge démo).

### Gotchas
- Le navigateur de test expose `prefers-reduced-motion: reduce` : scène figée par défaut (comportement voulu).
- Panneau navigateur masqué : `visibilityState = hidden`, le Canvas R3F ne monte pas (pas de ResizeObserver) et les captures sont périmées. `preserveDrawingBuffer` activé en mode test pour fiabiliser les captures.

### TODO / suggestions pour la suite
- (Fait en phase 1B) Vérif visuelle avec page visible : vue de jeu avec HUD, wipe, mobile 375 px.
- Plein écran `F` non vérifié visuellement (le navigateur de test n'autorise pas requestFullscreen sans geste réel).
- Phase 2 (kart + contrôles) : remplacer `CAMERA_BEHAVIORS.game` par une caméra de poursuite, écrire `telemetryStore.speed`, ajouter `playerStore`, entrées kart dans `game/kart/`, étendre `render_game_to_text` (position/vitesse du kart).
- Installer le client Playwright du skill (ou Playwright local) pour des runs headless reproductibles.

---

## 2026-09-25 — Phase 1B : menu principal, navigation, i18n

Prompt : construire le MENU PRINCIPAL (8 joueurs locaux, 32 en réseau ; modes Course, Contre-la-montre, Bataille, Rocket Gol ; parcours MAIN MENU -> MODE -> TYPE -> LOCAL / RÉSEAU -> LOBBY ; i18n fr/en/mg dans src/locales ; aucun texte en dur ; langue instantanée et mémorisée ; modes en configuration ; aucun gameplay ni backend). Fiche : docs/phases/PHASE_1B_MENU.md.

### Fait
- Navigation par pile (`navigation/screens.js`, `navigationStore`), transitions directionnelles, wipe seulement vers / depuis le jeu.
- Configuration : `config/gameModes.js`, `game/matchRules.js`, `matchSetupStore`, `game/session.js` + `sessionStore`.
- Écrans : MainMenu, GameModeMenu, PlayTypeMenu, LocalMultiplayer, OnlineMultiplayer, Lobby ; composants MenuButton, SettingsButton, BackButton, MenuPage, MenuStepper, LanguageSelector, CapacityBanner.
- i18n maison (aucune dépendance) : découverte auto des langues, pluriels / ordinaux Intl, repli fr, persistance `smkw-locale`, `html[lang]`.
- Paramètres à onglets (Langue, Audio bientôt, Graphismes, Contrôles bientôt).
- 3D : plans caméra `menu` / `menuWide` / `lobby` / `game`, objet vitrine teinté selon le mode.
- `scripts/check-locales.mjs` (`npm run check:i18n`) : parité des clés et des `{{variables}}`, détection de texte en dur (testée sur un fichier sonde).

### Tests (navigateur intégré)
- Parcours local complet (Bataille, 3 joueurs, contrôleurs, retrait) jusqu'au HUD ; config figée correcte dans `match`.
- Parcours réseau : code invalide -> erreur ; `ab-c12x` -> `ABC12X` -> Lobby invité, départ désactivé avec raison.
- Contre-la-montre : réseau verrouillé, Solo.
- Flèches / Entrée / Échap sur tous les écrans ; Échap du panneau de langue ne déclenche pas le retour.
- Langue fr -> mg -> en, instantané, conservé après rechargement.
- Mobile 375 px : pas de défilement horizontal.
- Console : aucune erreur (avertissements connus : THREE.Clock déprécié côté R3F, Motion signale le mouvement réduit du système).

### Bugs trouvés et corrigés
- `maxLength` sur le champ code comptait les caractères filtrés (un tiret bloquait la saisie suivante) : retiré, la normalisation limite la longueur.
- Mobile : le sélecteur de langue chevauchait le bandeau du logo : marge haute ajoutée.

### TODO / suggestions
- Phase 2 (kart + contrôles) : lire `sessionStore.match`, remplir l'onglet Contrôles, `game/input/` (Gamepad API) pour la jonction des joueurs locaux.
- Réseau : client Colyseus dans `net/`, lever `serverRequired` ; smkw-api.
- Relire / ajuster les traductions malgaches si besoin (`src/locales/mg.json`).

---

## 2026-09-25 — Phase 1C : entrée des joueurs locaux et sélection des personnages

Prompt : entrée des joueurs en local au START (pas de bouton « Ajouter un joueur »), animation d'entrée Motion, READY, 8 joueurs maximum, CONTINUE explicite, sélection des personnages indépendante (curseur par joueur, avatar, nom, type, stats, confirmation), 4 archétypes TANK / STANDARD / SPEED / SPECIAL en configuration, abstraction InputDevice / PlayerInput / PlayerSlot (P1...P8), sans gameplay / physique / réseau. Plus : barre de défilement du jeu pour le responsive. Fiche : docs/phases/PHASE_1C_PLAYERS.md.

### Fait
- `src/input/` : actions, périphériques (clavier 1 flèches + Entrée, clavier 2 ZQSD/WASD + Espace, manettes Gamepad API, tactile), gestionnaire (inactif sans abonné ; lecture manettes seulement si connectées), PlayerInput, `usePlayerInput`.
- `localPlayersStore` (PlayerSlot), `inputDevicesStore`, `config/players.js`, `config/characters.js`, contrôleurs `game/playerJoin.js` et `game/characterSelect.js`.
- Écrans : LocalMultiplayer (grille PRESS START), CharacterSelect ; Lobby avec personnages ; parcours local en 5 étapes (MENU_FLOWS).
- Composants `components/players/` : PlayerSlotCard (animation d'entrée), JoinHints, DeviceBadge, CharacterAvatar, CharacterCard (curseurs layoutId), PlayerSelectPanel, StatBars.
- Utilitaire Tailwind `scrollbar-game` (index.css `@utility`) sur MenuPage et SettingsDialog.
- `window.simulatePlayerInput` (TestBridge) ; `render_game_to_text` inclut `localPlayers` et `inputDevices`.

### Tests (navigateur intégré)
- Entrées réelles : Entrée, Espace, flèches, D, Retour arrière ; manette via `navigator.getGamepads` simulé + `gamepadconnected` (START, B) ; toucher d'un emplacement.
- 8 joueurs (5 manettes virtuelles), 9e refusé ; départ par B ; identifiants stables.
- Sélection : curseurs, confirmation / annulation, Continuer conditionnel, START vers le lobby, `match.players` correct.
- Contre-la-montre : réduit à 1 joueur ; Paramètres ouverts : entrées ignorées.
- 1280×720 : 8 emplacements sans défilement ; 1 à 4 panneaux de sélection sans défilement.
- Console propre après rechargement (les erreurs vues pendant le développement venaient du rechargement à chaud entre deux modifications).

### Ajustements faits pendant les tests
- Grille d'entrée trop haute en 1280×720 : cartes compactées en `lg`, rappel « Quitter » déplacé dans le pied de page.
- Roster compact horizontal en grand écran ; panneaux resserrés.
- Tampon « Confirmé » qui masquait le nom du personnage : remplacé par un badge dans l'en-tête du panneau.
- Classe `ring-player-N` construite à l'exécution (invisible pour Tailwind) : ajoutée en toutes lettres.

### TODO / suggestions
- Phase 2 (kart + contrôles) : actions de conduite dans `input/actions.js`, contrôleur `game/kart/`, conversion des stats d'archétype en paramètres physiques, onglet Contrôles.
- Navigation des menus à la manette (croix / A / B) via `subscribeToInput`.
- Portraits ou modèles 3D à la place des avatars temporaires ; plusieurs personnages par archétype.

---

## 2026-10-01 — Phase 1D : sélection des personnages façon Mario Kart, preview 3D, unicité

Prompt : écran de sélection inspiré de Mario Kart (personnages au centre, joueurs sur les côtés, curseur par joueur), présélection affichée en preview 3D en haut de l'écran, confirmation qui verrouille, joueurs indépendants (selecting / confirmed, préselectionné / confirmé), architecture séparée (données, état, navigation, UI, scène, preview, validation), règle d'unicité gérée dans l'état global, réutiliser l'existant, environ 100 lignes par fichier. Fiche : docs/phases/PHASE_1D_CHARACTER_SELECT.md.

### Fait
- Données : 8 personnages (2 par archétype, colonnes du roster), `config/characterPreview.js` (géométrie partagée UI / 3D).
- Règles pures `game/characterSelectionRules.js` + `stores/characterSelectionStore.js` ; la sélection sort du PlayerSlot.
- Contrôleur `game/characterSelect.js` réécrit (haut/bas = rangée, réservés sautés) ; validation finale `duplicateCharacters` dans matchRules.
- UI : CharacterSelect (côtés + centre), CharacterRoster, CharacterCard (« Pris par Px »), PlayerSelectPanel découpé (SelectionStatus, PanelCharacterInfo, PanelControls, ClassTraits), PreviewLabels ; Lobby et PlayerSlotCard découpés (< ~100 lignes).
- 3D : CharacterModel low-poly en pièces partagées, CharacterPreviewStage / PreviewSlot dans la scène existante, plan caméra `characterSelect`, gemme masquée sur cet écran.
- Règle d'or « ~100 lignes par fichier » + liste indicative dans `check:rules`.

### Tests
- `npm run check` (oxlint, règles d'or, i18n 184 clés) et `npm run build` OK.
- Logique testée dans la page (import des modules via Vite) : présélection partagée sans réservation, confirmation qui réserve, refus `reserved` (+ compteur de refus), navigation qui saute les réservés (gauche, droite, rangées), annulation qui libère, `begin` qui mémorise, validation finale (`charactersPending`, `duplicateCharacters`).
- Vérification visuelle faite une fois la page visible : sonde `preview` dans render_game_to_text (projection écran des previews) ; socles alignés exactement sur les étiquettes (15 %...85 % à 8 joueurs) ; modèles sous l'en-tête ; 1280x720, 1024x576 et mobile 404x610 vérifiés ; parcours complet sans erreur console après rechargement.
- Ajustements : cadrage caméra et échelle max 0,58 (modèles trop grands au départ), étiquettes sous le bord avant des socles, roster vertical jusqu'à xl, sous-titre masqué sur écrans bas.

### TODO
- Fichiers > ~100 lignes non touchés (à découper à leur prochaine modification) : variants.js, SettingsDialog, OnlineMultiplayer, inputManager, LanguageSelector.

---

## 2026-10-01 — Phase 1E : personnage seul, visages, sélection des véhicules GLB

Demande : à la sélection des personnages, montrer le personnage seul (pas avec la voiture), seulement les visages dans la grille, le nom dans la présélection, pas de statistiques en multijoueur ; ensuite sélection des véhicules (GLB disponibles) ; puis lobby pour lancer la course. Fiche : docs/phases/PHASE_1E_VEHICLES.md.

### Fait
- Sélection générique : game/selection/ (règles, contrôleur), stores/createSelectionStore.js, components/selection/ (écran, roster, panneau, contrôles, statut, curseurs, étiquettes). Personnages = unique, véhicules = partageable.
- Personnages : CharacterFigure (3D, sans kart), CharacterFace (SVG) + config/characterAppearance.js ; roster en visages ; aucune stat.
- Véhicules : config/vehicles.js (7, stats), components3d/Vehicles (GLB clonés, normalisés, préchargés) ; VehicleSelect ; stats en solo seulement.
- Flow local en 6 étapes ; validation vehiclesPending ; match.players[].vehicleId ; lobby « Personnage · Véhicule ».

### Tests (navigateur intégré)
- Personnages seuls en 3D, 8 visages distincts, nom sous chaque preview et dans les panneaux, pas de stats.
- 7 GLB chargés sans erreur, tailles homogènes après normalisation, textures OK.
- Véhicule partagé par 2 joueurs autorisé ; stats visibles en solo, absentes en multi.
- Parcours complet jusqu'au jeu ; 1280x720 et mobile 404x606 sans débordement ; aucune erreur console.

### Ajustements pendant les tests
- Mobile : étiquettes recouvertes par le roster -> zone transparente par palier (31 / 27 / 24 vh).
- Libellé du roster des véhicules distinct du titre de page ; panneaux légèrement resserrés (débordement de 3 px).

### TODO
- Vérifier les licences Sketchfab des GLB avant publication.
- Vignettes 2D des véhicules (rendu des GLB) pour les cartes du roster ; portraits ou GLB de personnages.

---

## 2026-10-08 — Phase 1F : prêt par joueur, écran partagé

Demande : « la distinction des cases par joueur : on fait prêt et prêt puis on va dans le split screen ». Fiche : docs/phases/PHASE_1F_SPLIT_SCREEN.md.

### Fait
- Lobby local : « Prêt » par joueur (START / A, RETOUR annule, bouton `#P<n>-ready-btn`), départ automatique quand tous sont prêts ; plus de bouton Lancer en local (gardé, désactivé, en ligne). `stores/lobbyReadyStore.js`, `game/lobbyReady.js`, `ReadyToggle`.
- Écran partagé : `config/splitScreen.js` (1x1, 1x2, 2x2, 3x2, 4x2 ; retourné en portrait), `SplitScreenRenderer` (une passe de rendu par case, priorité useFrame 1), caméra de poursuite par joueur, vue d'ensemble pour une case vide, cadrage 16:9 conservé dans les cases très larges.
- Grille de départ : `components3d/Racers` (véhicule GLB + personnage assis + case peinte à la couleur du joueur), `config/startGrid.js`.
- HUD par case (`components/screens/split/`) : étiquette P<n> + visage + nom, objet, tour + temps, vitesse, position (ordre de grille) ; requêtes de conteneur en largeur et en hauteur (`cell-short:`, `cell-low:` dans index.css).
- `textState.js` découpé (`textStateParts.js`) ; `render_game_to_text` : `splitScreen`, `hud.viewports`, `localPlayers[].ready`, `scene.racers`.

### Tests (navigateur intégré)
- Parcours complet 2 joueurs : lobby (P1 prêt / P2 pas prêt, compteur), RETOUR annule, clic bascule, dernier prêt -> jeu ; Échap -> menu, rendu normal rétabli.
- 7 joueurs (portrait 2x4) et 8 joueurs : une case par joueur à sa couleur, vue d'ensemble dans la case vide.
- Cases 3D (pixels) identiques aux cases du DOM : 1, 2, 4, 5, 8 joueurs, paysage et portrait.
- HUD sans débordement : 1280x720, 844x390, 390x844, 768x1024 (1 à 8 joueurs).
- Orientation des 7 véhicules vérifiée en vue de côté (temporaire) : le Flamant était de travers (yaw pi/2) ; sièges ajustés (Hot Rod, Buggy, Comète, Flamant).
- `npm run check` (202 clés i18n) et `npm run build` OK ; aucune erreur console liée au jeu.

### Ajustements pendant les tests
- Lobby mobile : la grille débordait (piste `auto`) -> `grid-cols-1` ; badge de périphérique qui ignorait `hidden` -> enveloppe.
- Position trop grosse et actions communes sur l'étiquette dans les petites cases -> tailles réduites, nom masqué sous 20rem, mention démo en solo seulement.
- Cases très larges (2 joueurs en paysage) déformées -> `fitCellFraming` (angle 16:9 + recul).
- Fenêtre de l'app en arrière-plan pendant une partie des tests (rAF ralenti) : vérifs faites en temps manuel et par mesures DOM.

### TODO
- Phase 2 : conduite ; les caméras de poursuite suivront les karts ; vitesse et position réelles par joueur.
- Pilote assis dédié (la figurine debout est enfoncée dans le siège).
- Vérifier les licences Sketchfab des GLB avant publication.

---

## 2026-10-08 — Phase 1G : personnages GLB, gabarits, identité colorée, Kart Able

Demande : afficher les 16 personnages GLB fournis en équivalence de taille (petit / moyen / grand, répartition libre), identité colorée de chaque personnage sur les véhicules (comme les jeux de kart de salon), un nom spécial par personnage, jeu renommé « Kart Able ». Fiche : docs/phases/PHASE_1G_CHARACTERS.md.

### Fait
- config/characters.js : 16 personnages { classId, size, color }, CHARACTER_SIZES (0,64 / 0,82 / 1) ; tokens --color-char-* (vérifiés contre la config par check:rules).
- components3d/Characters : characterAssets (fichier, yaw, clip, loop, tint, cadrage), prepareCharacter (clone, pose, orientation, sol, hauteur), CharacterModel (animation d'attente via mixer), PortraitStudio + renderPortrait (portraits hors écran -> portraitStore).
- Roster en tuiles 4 x 4 (portraits), largeur bornée par la hauteur restante ; panneau « archétype · gabarit ».
- kartPaint : karts repeints à la couleur du personnage (preview véhicules et course).
- Supprimés : CharacterFigure, figureParts, Part, characterAppearance, CharacterFace, faceShapes.
- Nom : BRAND.name = Kart Able (v0.3.0), titre de page, docs.

### Tests (navigateur intégré)
- 16 portraits en ~2 s ; cadrages réglés (Timo, Osso, Mitsu, Tempo, Zenji, Pompon, Miella).
- Orientation vérifiée (chat et robot volant : quart de tour ; mannequin : de face).
- Sélection : gabarits visibles ; 1280x720 sans débordement ; panneaux corrects.
- Véhicules peints (Diesel rouille, Marlo violet, Timo vert, Pyrox orange) ; course 2 et 4 joueurs ; vue de côté temporaire pour placer les 16 pilotes.
- Animation d'attente vérifiée par différence d'images (mouvement Complet).
- npm run check (213 clés) et build OK ; aucune erreur console.

### Ajustements pendant les tests
- Roster de 16 trop haut en 1280x720 -> tuiles carrées, largeur calc(53dvh - 7.5rem).
- Animations figées en dev : le nettoyage de l'effet (StrictMode) arrêtait les actions -> dispose ne libère plus que les matériaux.
- Kart d'Osso kaki -> couleur blanc os ; Mitsu passé en lavande pour rester distinct ; peinture éclaircie pour les teintes pâles.

### TODO
- Vérifier les licences des GLB de personnages (dont des fan-arts de personnages existants) avant publication.
- Alléger les GLB (~10 Mo de personnages) : compression meshopt / textures, chargement progressif.
- Pose assise des pilotes (animation dédiée) ; pack d'arbres pour le futur circuit.

---

## 2026-10-08 — Phase 1H : Kairos Cup, circuits procéduraux

Demande : maps en procédural avec les outils du portfolio (eau, herbe, arbres), une première coupe de 4 maps « Kairos Cup », choix de la map après le personnage et le kart, maps dimensionnées pour 32 joueurs, checkpoints anti-raccourci, ligne de départ / arrivée. Fiche : docs/phases/PHASE_1H_KAIROS_CUP.md.

### Fait
- Données : config/cups.js, config/tracks.js (4 circuits : points de contrôle, lacs, ambiance, graine), config/trackThemes.js.
- Génération pure (game/track) : spline Catmull-Rom centripète rééchantillonnée, grille de 32 (4 colonnes en quinconce), portes de checkpoint (~60 m), règles de tour anti-raccourci + détection de franchissement, contour pour les mini-cartes, bruit déterministe ; game/race/startSlots.js.
- Monde 3D (components3d/Track) : texture de données RGBA (route, herbe, eau, sable), terrain (lits des lacs creusés), eau et herbe portées du portfolio (vagues vers la rive, brins autour de la caméra par case), route + marquages (bordures, damier, repères), arbres du pack en instances (palette par ambiance), décor Kenney CC0 (portique, drapeaux, tribunes, lampadaires, tours, murets), préchargement pendant le choix du circuit.
- Écran « Circuits » (P1 choisit, système de sélection générique) entre véhicules et lobby pour course et contre-la-montre ; étape masquée pour bataille / Rocket Gol ; lobby avec la ligne Circuit ; blocage trackPending ; match.trackId / match.laps ; HUD sur le nombre de tours du circuit.
- matchRules découpé (matchConfig.js, lobbyRules.js) ; LobbyFooter extrait.

### Tests (navigateur intégré, fenêtre souvent en arrière-plan : temps manuel)
- Tracés vérifiés (marges : route 27 à 58 m, eau 14 à 31 m) ; 751 / 978 / 800 / 1046 m.
- Parcours complet : personnages, véhicules, Circuits (P2 ignoré, aperçu 1046 m · 3 tours · 16 à 20 m · 17 points de passage), lobby « Côte Turquoise · Kairos Cup », course sur le circuit.
- Vues d'ensemble des 4 circuits ; règles de tour (3 tours, raccourci ignoré, contresens) ; retour menu = arène.
- CPU par image : ~4 ms à 2 joueurs, 21-24 ms à 8 joueurs.
- npm run check (237 clés) et build OK.

### Ajustements pendant les tests
- Damier noir et vert : faces de marquages tournées vers le bas (éclairées par dessous) -> ordre des sommets forcé vers le haut.
- Tribunes vues de dos -> demi-tour ; échelle réduite.
- Vue d'ensemble noyée dans le brouillard -> brouillard écarté le temps de sa case, recul selon la forme de la case.
- Forêt clairsemée près de la route -> végétation tirée le long du tracé.
- Doublons d'instances de stores après rechargements à chaud -> redémarrer le serveur de dev pour tester.

### TODO
- Fusionner les maillages des véhicules par matériau (draw calls : le Flamant en a 70) avant 32 karts.
- Brancher lapRules sur la conduite (phase 2) ; collisions des murets.
- Licences : pack d'arbres, personnages, véhicules (voir docs/CREDITS.md).
- Circuits urbains : modèles à télécharger (immeubles, mobilier urbain).

---

## 2026-10-08 — Phase 1I : assignation des touches

Demande : « maintenant l'assignation des touches, tu peux faire marcher » (onglet Contrôles des paramètres). Fiche : docs/phases/PHASE_1I_KEY_BINDINGS.md.

### Fait
- input/ : actions de course (accelerate, brake, steerLeft, steerRight, drift, item) + contextes ; bindingDefaults (profils, touches par défaut, réservées) ; bindingRules (pures : assignation, échange, refus, START obligatoire, normalisation) ; bindingLookup (tables reconstruites au changement) ; bindingCapture + useBindingCapture ; keyLabels + useKeyboardLayout (Keyboard API + apprentissage des touches frappées).
- stores/bindingsStore.js (persisté smkw-bindings).
- inputManager lit l'assignation (plusieurs actions par touche) ; gamepadPolling.js extrait ; gamepadMapping lit l'assignation des manettes (stick gauche fixe) ; keyboardProfiles.js supprimé ; devices.js sans noms de touches en dur.
- UI : onglet Contrôles (components/settings : ControlsPanel, BindingRow, BindingNotice), panneaux Langue / Graphismes / onglets extraits de SettingsDialog ; KeyCap ; aides dynamiques (JoinHints, aide « Quitter », panneaux de sélection) via hooks/useInputLabels.js.

### Tests (navigateur intégré)
- Capture clavier : K sur Start, F refusée, W refusée (Clavier 2), ↓ sur Haut = échange avec Bas, Échap annule sans fermer, retrait, START jamais vide, sauvegarde.
- En jeu : Entrée ne rejoint plus, K rejoint Clavier 1 ; aides « Clavier 1 : K », aide Quitter à jour.
- Manette simulée : Y capturée pour Start, le bouton Start ne rejoint plus, Y rejoint (P3) ; aide « Y / Triangle ».
- Panneaux : « ↓←↑→ · K », « Croix · Y / Triangle », « ZQSD · Espace » après frappe AZERTY.
- Ligne d'action qui passe à la ligne sur écran étroit (nom tronqué à une lettre avant).
- npm run check (306 clés), build OK ; smkw-bindings remis à zéro après les tests.

### TODO
- Phase 2 : brancher les actions de course sur le kart.
- Sensibilité du stick, vibrations, affichage des touches de course dans un écran d'aide.

---

## 2026-11-23 — Phase 2A : drift arcade, chocs, équilibrage, pilotes animés, backend Rust

Demande : améliorer les chocs, l'équilibrage véhicules / personnages, les rigs et animations des pilotes (« très moches »), un drift façon jeux de kart arcade ; comparer l'existant au cahier des charges en 8 phases sans rien casser ni changer les intentions ; backend en Rust. Fiche : docs/phases/PHASE_2A_DRIFT_HITS.md (contient l'audit).

### Fait
- config/kartTuning.js : courbes de stats, DRIFT, BOOSTS (+ cumul), COLLISION, WALL.
- game/race : kartDrift.js (saut, sens, jauge par qualité, 3 paliers), kartBoost.js (turbo centralisé), kartCollisions.js + kartCapsule.js (capsules, poussée latérale, secousse), kartPhysics.js (élan conservé en virage), murs dans trackTracking.js, racePace.js extrait de raceWorld.js.
- Équilibrage : tank topSpeed 4 -> 6, hot rod handling 3 -> 4, buggy offRoad 0,72.
- Pilotes : driverPose.js / driverRig.js (pose assise sur squelette, poses clés mélangées), kartPose.js (saut, glisse, roulis, secousse), KartEffects (étincelles 4 couleurs, flamme selon la source). Osso exclu (`driverPose: false`).
- HUD : vitesse / tour / temps / position réels par joueur, DriftGauge, StartLights et FinishBanner branchés, clés i18n `race.*` ajoutées (elles manquaient), mention démo seulement hors circuit.
- smkw-api : squelette Rust (Cargo.toml sans dépendance, main.rs, config.rs) ; docs ARCHITECTURE, CLAUDE.md, README mis à jour.

### Tests
Voir la fiche de phase. Panneau navigateur masqué au début : Canvas non monté et animations Motion bloquées (rAF) ; afficher le panneau, puis lancer la course via sessionStore + `window.restartRace()` (les imports dynamiques de raceSession peuvent viser une autre instance de module après rechargement à chaud).

### TODO
- Écran de résultats (phase `results` publiée, aucune UI), meilleur tour à l'écran.
- IA : drift et remplacement de l'ajustement de rythme (racePace) par un vrai comportement.
- Presets d'équilibrage (Arcade / Compétitif / Détente) sur kartTuning.js.
- Objets, pads, pièces, rampes, audio : phases suivantes.
- Pose assise d'Osso (squelette atypique) : animation dédiée ou réglage par os.

---

## 2026-11-23 — Phase 2B : drift revu, 32 pilotes, cases à objets, relief, Summit Cup

Demande : drift plus fidèle aux jeux de kart ; 32 karts en course joueurs compris ; autres coupes avec montées / descentes ; cases à objets ; point sur l'objectif. Fiche : docs/phases/PHASE_2B_FIELD_ITEMS_RELIEF.md (état du cahier des charges inclus).

### Fait
- kartDrift.js : drift armé tant que Drift est tenu, départ dès qu'on braque au sol, poussée `entryKick`, relance après relâchement ; slipAngle 0,6.
- RACE.fieldSize 32 ; raceRoster : doublons de personnages au-delà de 16.
- config/items.js + game/items/* + components3d/Items/* + ItemSlot (roulette, charges, icônes) ; spin et bulle dans kartPose / KartEffects ; raceControls.js extrait de raceWorld.js.
- Relief : trackPath (y), trackHeight.js (grille), lakes.js, kartVertical.js (RELIEF), route / marquages / terrain / herbe (heightTexture.js) / végétation / décor / grille / caméra sur le relief.
- Summit Cup (4 circuits), thèmes canyon et alpine, relief ajouté à kairosMeadow et echoWoods ; textes fr / en / mg.

### Tests
Voir la fiche. Astuce : après un rechargement à chaud, l'app importe `raceSession.js?t=...` ; pour lire le monde de course depuis la console, prendre l'URL dans `performance.getEntriesByType('resource')`. Le panneau navigateur doit être affiché (sinon Canvas et animations Motion à l'arrêt). Scène R3F accessible par `_roots` de `@react-three/fiber` (rendus hors écran pour les vérifications).

### TODO
- Écran de résultats, meilleur tour (phase course).
- Rampes et pads de turbo (vrais sauts), pièces.
- Performance à 32 karts en écran partagé : fusion des maillages des véhicules, LOD des pilotes lointains.
- IA : drift.
