# Workflow de test — develop-web-game

Adapté du skill `develop-web-game` (openai/skills). Chaque itération : **implémenter petit → agir → pause → observer → ajuster**.
Le skill projet correspondant est dans `.claude/skills/develop-web-game/SKILL.md`.

---

## 1. Points d'intégration exposés par le jeu

Actifs en dev (`npm run dev`) et en prod avec `?test` dans l'URL (`TEST_HOOKS_ENABLED`, `src/config/gameConfig.js`).
Implémentation : `src/components3d/Systems/TestBridge.jsx` et `src/game/textState.js`.

| Hook | Effet |
| --- | --- |
| `window.advanceTime(ms)` | Passe la boucle R3F en temps manuel (`frameloop="never"`) puis avance par pas fixes de 1/60 s. Déterministe : après 1000 ms, l'objet vitrine a exactement tourné de 0,7 rad. |
| `window.render_game_to_text()` | JSON concis : `screen`, `stack`, `locale`, `timeControl`, overlays, `focus`, boutons visibles, `matchSetup`, `match`, HUD, caméra, objet vitrine (couleur), réglages. Inclut la note sur le repère. |
| `window.resumeRealtime()` | Revient à la boucle temps réel (debug manuel uniquement). |
| `window.simulatePlayerInput(deviceId, action)` | Simule un périphérique : `keyboard-1`, `keyboard-2`, `pointer`, `gamepad-N` (manette virtuelle créée à la volée). Actions : `start`, `confirm`, `back`, `up`, `down`, `left`, `right`. |

Tester une vraie lecture Gamepad API sans manette : remplacer `navigator.getGamepads` par une fonction qui renvoie un objet `{ index, id, connected: true, buttons: [{ pressed }...], axes: [] }`, puis `window.dispatchEvent(new Event('gamepadconnected'))` et basculer `buttons[9].pressed` (START).

Repère : mètres ; origine au centre de l'arène, au sol ; +x à droite, +y vers le haut, +z vers la caméra de course.

Sélecteurs stables :
- Menu : `#start-btn` (JOUER), `#garage-btn` (désactivé), `#settings-btn`, `#language-btn`, `#language-<code>-btn`
- Parcours : `#back-btn`, `#settings-icon-btn`, `#mode-<id>-btn`, `#mode-continue-btn`, `#playtype-local-btn`, `#playtype-online-btn`
- Joueurs locaux : `#slot-P<n>-start` (START tactile), `#slot-P<n>-leave`, `#local-continue-btn`
- Personnages : `#P<n>-prev-btn`, `#P<n>-next-btn`, `#P<n>-confirm-btn`, `#characters-continue-btn`, cartes `#roster-<characterId>` (attribut `data-reserved-by` quand le personnage est confirmé)
- Véhicules : mêmes boutons de panneau, `#vehicles-continue-btn`, cartes `#roster-<vehicleId>`
- `render_game_to_text()` : `localPlayers[].selection` (personnage), `.vehicle` et `.ready`, `preview[]` (modèle affiché et position à l'écran de chaque socle), `splitScreen[]` (en jeu : joueur, pixels de la case, position de la caméra), `hud.viewports`, `scene.racers`, `trackSelection`, `track` (en course : id, tours, longueur, checkpoints, ligne, pole position)

Tester la logique sans rendu (même instance de module que l'app) : `const { useCharacterSelectionStore } = await import('/src/stores/characterSelectionStore.js')`.
- Réseau : `#online-create-btn`, `#room-code-input`, `#join-submit-btn`
- Circuits : `#track-<id>` (cartes), `#P1-prev-btn`, `#P1-next-btn`, `#P1-confirm-btn`, `#tracks-continue-btn`
- Lobby : `#P<n>-ready-btn` (local, attribut `data-ready`), `#lobby-start-btn` (en ligne seulement)
- Jeu : `section[data-player="P<n>"]` (case de chaque joueur), `#hud-settings-btn`, `#hud-exit-btn`
- Paramètres : `#settings-tab-<id>`, `#settings-done-btn`, `#fov-range`
- Contrôles : `#controls-profile-<keyboard1|keyboard2|gamepad>`, `#bind-<profil>-<action>-<0|1>`, `#unbind-<profil>-<action>-<0|1>`, `#bindings-reset-btn` ; `render_game_to_text().bindings`

Touches : flèches (naviguer), `Enter` (valider / jouer), `Escape` (fermer / écran précédent / quitter la partie), `F` (plein écran).
Plus simple : lire `buttons` dans `render_game_to_text()`, qui liste les boutons visibles de l'écran courant.

Le Canvas est créé avec `preserveDrawingBuffer` en mode test pour que les captures reflètent la dernière frame rendue par `advanceTime`.

## 2. Boucle de test

1. Choisir **un** objectif (une fonctionnalité ou un comportement).
2. Faire le plus petit changement possible.
3. Lancer le serveur : `npm run dev` dans `smkw-ui/` (port 5173, strict).
4. Exécuter le client Playwright du skill si disponible :
   ```
   node "$WEB_GAME_CLIENT" --url http://localhost:5173 --actions-file "$WEB_GAME_ACTIONS" --click-selector "#start-btn" --iterations 3 --pause-ms 250
   ```
   Sinon : navigateur intégré (Claude desktop) ou Playwright local, en appelant les mêmes hooks.
5. Après chaque rafale d'actions : capture d'écran **ouverte et inspectée**, `render_game_to_text()`, erreurs console.
6. Corriger la **première** nouvelle erreur console avant de continuer.
7. Réinitialiser entre deux scénarios (recharger la page ; les réglages sont en localStorage `smkw-settings`).
8. Consigner résultats, bugs et décisions dans `progress.md`.

## 3. Checklist phase 1

- [ ] Menu : titre, PLAY, SETTINGS visibles ; apparition décalée ; hover/active sur les boutons.
- [ ] PLAY (clic et `Enter`) : wipe, caméra qui glisse vers la vue de jeu, HUD qui apparaît.
- [ ] HUD : chrono qui avance avec `advanceTime`, en pause quand les réglages sont ouverts.
- [ ] Retour menu (bouton et `Escape`) : chrono remis à zéro au prochain PLAY.
- [ ] Réglages : qualité (dpr), mouvement (System / Reduced / Full), FOV (caméra de course) ; `Escape` et clic sur le fond ferment.
- [ ] Mouvement réduit : scène figée, pas de wipe, pas de transforms au hover.
- [ ] `F` : plein écran, le Canvas se redimensionne.
- [ ] Aucune erreur console.
- [ ] `npm run check` (oxlint + règles d'or) et `npm run build` passent.

## 3b. Checklist menu (phase 1B)

- [ ] Parcours local : JOUER, mode, Local, ajouter / retirer des joueurs, contrôleur, Lobby, Lancer, HUD, `Escape` retour menu.
- [ ] Parcours réseau : En réseau, code invalide (erreur), code avec tiret ou minuscules (normalisé), Lobby invité, départ désactivé avec raison ; Créer, Lobby hôte.
- [ ] Contre-la-montre : réseau verrouillé, Local = Solo, 1 emplacement.
- [ ] Flèches + `Enter` dans chaque écran ; `Escape` remonte la pile écran par écran.
- [ ] Langue : fr / en / mg depuis le menu et depuis Paramètres, texte mis à jour instantanément, `html[lang]`, conservée après rechargement.
- [ ] `Escape` dans le panneau de langue ne fait que le fermer.
- [ ] Mobile 375 px : pas de défilement horizontal, sélecteur de langue sans chevauchement.
- [ ] `npm run check` (dont `check:i18n`).

## 3c. Checklist joueurs locaux et personnages (phase 1C)

- [ ] Aucun bouton « Ajouter un joueur » ; emplacements vides = « PRESS START ».
- [ ] Entrée (clavier 1), Espace (clavier 2), START manette (Gamepad API simulée), toucher (tactile) font chacun entrer un joueur ; un même périphérique ne rejoint qu'une fois.
- [ ] Animation d'entrée visible (flash, rebond, numéro), puis READY ; Continuer désactivé pendant l'entrée.
- [ ] 8 joueurs maximum (le 9e est refusé) ; 1 seul en contre-la-montre (joueurs en trop retirés).
- [ ] RETOUR (Retour arrière / Maj / B) fait quitter un joueur ; les identifiants restants ne changent pas.
- [ ] START d'un joueur READY passe à la sélection des personnages.
- [ ] Sélection : chaque joueur déplace son curseur, confirme, annule ; les puces P1...P8 suivent ; Continuer seulement quand tout le monde a confirmé ; START passe aux véhicules (phase 1E), puis au lobby.
- [ ] Lobby : personnages et périphériques affichés ; `match.players` contient `characterId` et `deviceId`.
- [ ] Paramètres ouverts : aucune entrée joueur prise en compte.
- [ ] 1280×720 : 8 emplacements sans défilement ; 1 à 4 panneaux de sélection sans défilement.

## 3d. Checklist sélection des personnages (phase 1D)

- [ ] Preview 3D en haut : un modèle par joueur, aligné avec son étiquette P1...P8.
- [ ] Changer de personnage met à jour le panneau, le curseur du roster et le modèle 3D (animation de changement, un seul modèle).
- [ ] Deux joueurs peuvent présélectionner le même personnage ; le premier qui confirme le réserve.
- [ ] Le second ne peut pas confirmer (bouton désactivé, secousse si START / A) ; le roster affiche « Pris par Px ».
- [ ] La navigation saute les personnages réservés ; annuler (RETOUR / Changer) les libère.
- [ ] Continuer seulement quand tout le monde a confirmé ; le lobby affiche les personnages ; `match.players[].characterId` sans doublon.
- [ ] 8 joueurs : panneaux compacts, 8 personnages différents possibles.

## 3e. Checklist personnages sans véhicule et sélection des véhicules (phase 1E)

- [ ] Personnages : preview 3D = personnage seul (aucun kart) ; roster = visages uniquement ; nom visible dans la présélection (panneau, étiquette) ; aucune statistique.
- [ ] Véhicules : chaque GLB se charge et s'affiche (7 modèles), rotation lente, changement animé.
- [ ] Deux joueurs peuvent confirmer le même véhicule.
- [ ] Statistiques des véhicules visibles en solo, absentes à 2 joueurs ou plus.
- [ ] Lobby : « Personnage · Véhicule » par joueur ; `match.players[]` avec `characterId` et `vehicleId`.
- [ ] Mobile et 1280x720 : étiquettes au-dessus du roster, aucun débordement.

## 3f. Checklist prêt par joueur et écran partagé (phase 1F)

- [ ] Lobby local : aucun bouton Lancer ; START (ou A) rend le joueur prêt, RETOUR annule, `#P<n>-ready-btn` bascule ; le pied de page compte les joueurs pas prêts.
- [ ] Dernier joueur prêt : passage direct à l'écran de jeu, une case par joueur.
- [ ] `splitScreen` (3D) et les cases `section[data-player]` (DOM) ont les mêmes rectangles (1 px d'arrondi près) : 1, 2, 3, 4, 5, 8 joueurs, en paysage et en portrait.
- [ ] Chaque case : cadre à la couleur du joueur, étiquette P<n>, son kart (bon véhicule, bon personnage, avant vers l'arène) ; case vide = vue d'ensemble.
- [ ] HUD sans débordement (mesurer `scrollWidth` / `scrollHeight` de chaque case) : 1280x720, 844x390, 390x844, 768x1024.
- [ ] Échap ou `#hud-exit-btn` : retour au menu, `splitScreen` revient à `null`, la caméra du menu reprend.
- [ ] Le dernier état « prêt » ne survit pas : il est remis à zéro à la prochaine entrée dans le lobby.

## 3g. Checklist personnages GLB et identité colorée (phase 1G)

- [ ] Écran des joueurs : les 16 portraits arrivent dans `portraitStore` (environ 2 s).
- [ ] Roster 4 x 4 : un portrait par tuile sur la couleur du personnage ; aucun débordement en 1280x720 (`scrollHeight` = `clientHeight`).
- [ ] Preview : gabarits visibles côte à côte (ex. Diesel grand, Marlo moyen, Timo petit) ; panneau « archétype · gabarit ».
- [ ] Véhicules : chaque kart en preview est peint à la couleur du personnage confirmé ; deux joueurs sur le même véhicule = deux couleurs.
- [ ] Course : pilote GLB au volant, kart peint, portrait dans l'étiquette de la case.
- [ ] Mouvement « Complet » : les personnages à animation d'attente bougent (comparer deux captures de la zone du pilote) ; mouvement réduit : pose fixe.
- [ ] Nom du jeu : « Kart Able » (logo et titre de la page).

## 3h. Checklist Kairos Cup (phase 1H)

- [ ] Course ou contre-la-montre : étape « Circuits » entre véhicules et lobby ; bataille et Rocket Gol : pas d'étape « Circuits ».
- [ ] P1 seul pilote le choix (les entrées de P2 sont ignorées) ; aperçu : longueur, tours, largeur, points de passage.
- [ ] Lobby : ligne « Circuit » ; départ refusé sans circuit (`trackPending`).
- [ ] Course : `track.id` = circuit choisi ; karts sur la grille, dans le sens de course ; damier noir et blanc ; tribunes face à la route.
- [ ] 3 joueurs : la vue d'ensemble montre tout le circuit (lacs, route, végétation).
- [ ] Règles de tour (import de `game/track/lapRules.js`) : 3 tours valides, raccourci ignoré, contresens annulé.
- [ ] Échap : retour au menu, l'arène revient.

## 3i. Checklist assignation des touches (phase 1I)

- [ ] Clic sur un emplacement puis touche (KeyboardEvent sur `document.activeElement`) : touche assignée, message « Action : touche ».
- [ ] F, Tab, F1-F12 refusées ; une touche de l'autre clavier refusée ; conflit dans le même profil = échange ; START garde au moins une touche.
- [ ] Échap pendant la capture : annule sans fermer les paramètres.
- [ ] Manette simulée (`navigator.getGamepads` remplacé, `gamepadconnected`) : capture d'un bouton, puis ce bouton fait rejoindre ; l'ancien ne fait plus rien.
- [ ] Aides à l'écran à jour : comment rejoindre, comment quitter, panneaux de sélection ; « ZQSD » après frappe sur un clavier AZERTY.
- [ ] Rechargement : assignation conservée (`smkw-bindings`) ; « Touches par défaut » rétablit le profil.
- [ ] Nettoyer `smkw-bindings` après les tests.

## 4. Pièges connus

- Onglet ou panneau masqué (`document.visibilityState === 'hidden'`) : le navigateur ne livre plus les callbacks ResizeObserver ni requestAnimationFrame. Le Canvas R3F ne se monte pas et les hooks de test restent absents. Tester avec la page visible (ou en headless, où la page est considérée visible).
- Après le premier `advanceTime`, la boucle reste en temps manuel : la scène ne bouge plus seule. Recharger ou appeler `resumeRealtime()`.
- Fenêtre en arrière-plan (onglet visible mais requestAnimationFrame ralenti à moins d'une image par seconde) : les transitions Motion n'avancent plus et les captures d'écran sont figées. La scène reste testable en temps manuel (`advanceTime`) en pilotant directement les stores, et la mise en page se mesure dans le DOM (neutraliser les transforms d'apparition).
- Après des modifications à chaud, importer un module à la main (`await import('/src/stores/...')`) peut donner une autre instance que celle de l'app (URL horodatée par Vite) : piloter l'app par les entrées simulées, ou recharger le serveur.
- Le navigateur de test peut exposer `prefers-reduced-motion: reduce` : la scène est alors volontairement figée. Passer le réglage Motion sur `Full` pour tester les animations.
