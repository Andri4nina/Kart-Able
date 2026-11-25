# Enchaînement des courses : coupe, résultats, vote

- **Type** : système + écran (superposé au jeu) + store
- **Fichiers** : `smkw-ui/src/config/cups.js` (`TRACK_SELECT_IDS`, `resolveCourse`), `smkw-ui/src/config/race.js` (`CUP_POINTS`, `TRACK_VOTE`), `smkw-ui/src/game/raceSequence.js`, `raceFlow.js`, `matchConfig.js`, `smkw-ui/src/stores/raceFlowStore.js`, `trackVoteStore.js`, `createSelectionStore.js`, `smkw-ui/src/components/screens/race/` (RaceFlowOverlay, RaceResults, TrackVote, TrackVoteReveal), `smkw-ui/src/components/tracks/CupCard.jsx`, `CupPreview.jsx`, `smkw-ui/src/components/menu/TrackSelect.jsx`, `LobbySummary.jsx`
- **Phase** : 2D

## Rôle

- **Choix de la coupe** : chaque rangée de l'écran des circuits commence par la coupe complète (présélectionnée). Choisir la coupe, ou ne pas choisir de circuit précis, enchaîne ses 4 circuits ; choisir un circuit fait une course simple.
- **Résultats** : après chaque course, classement (10 premiers et joueurs locaux) avec temps, ou en coupe points de la course et total (`CUP_POINTS` : 15, 12, 10, ... 1 pour les 12 premiers).
- **Suite** : en coupe, course suivante (points reportés) ; après une course simple ou la dernière de la coupe, **vote** : chaque joueur local choisit parmi les autres circuits, le plus choisi est couru (égalité : tirage au sort), annoncé 2,2 s avant le départ. On peut revoter indéfiniment.

## Interface

- `sessionStore.match` : `cupId`, `playlist` (circuits), `round` (0..), `cupPoints` ({ pilote: points }).
- Choix de l'écran des circuits : `cup:<id>` ou id de circuit (`resolveCourse`).
- `raceFlowStore` : `step` (null : résultats, `vote`, `reveal`), `options`, `winner`, `counts`.
- Entrées (game/raceFlow.js) : START ou A pour continuer (après `RACE.resultsInputDelay`) ; au vote, contrôleur de sélection générique (déplacements, A / START pour voter, RETOUR pour changer). Bouton `#results-continue-btn` à la souris.
- `render_game_to_text().raceFlow` : coupe (course n / total), étape, options, vainqueur, voix, votes des joueurs.
- Sélecteurs : `#race-results`, `[data-result]`, `#track-vote`, `[data-voted]`, `#track-vote-reveal[data-winner]`, `#cup-<id>`.

## Dépendances

Système de sélection générique (`createSelectionStore` accepte maintenant une fonction d'éléments, pour des options qui changent à chaque vote ; `createSelectionController`, `SelectionRoster`). Course : `startRace`, `raceStore.results`.

## Performance

Superposition montée seulement en phase « résultats » ; aucun coût pendant la course.

## Conformité règles d'or

- [x] Aucun dégradé linéaire (fond translucide uni)
- [x] Aucun emoji ; icônes lucide utiles (Trophy, Flag, Vote, Check, Route)
- [x] Tailwind uniquement
- [x] Animations Motion courtes (MotionConfig : mouvement réduit respecté)
- [x] Séparation UI / état / 3D : stores et game/raceFlow.js ; la 3D suit `match.trackId`
- [x] Aucun texte en dur (results.*, vote.*, trackSelect.fullCup...)
- [x] Toutes les zones qui défilent ont `scrollbar-game`

## Évolutions prévues

Vote en ligne (smkw-api), trophée de fin de coupe, choix « coupe suivante » au vote.
