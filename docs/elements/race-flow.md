# Enchaînement des courses : programme, points, résultats, vote

- **Type** : système + écran (superposé au jeu) + store
- **Fichiers** : `smkw-ui/src/config/cups.js` (`resolveCourse`), `smkw-ui/src/config/race.js` (`RACE_POINTS`, `COURSE`, `TRACK_VOTE`), `smkw-ui/src/game/raceSequence.js`, `raceFlow.js`, `matchConfig.js`, `smkw-ui/src/stores/raceFlowStore.js`, `trackVoteStore.js`, `smkw-ui/src/components/screens/race/` (RaceFlowOverlay, RaceResults, TrackVote, TrackVoteReveal)
- **Phase** : 2D, points étendus en 2E

## Rôle

- **Programme** : composé à l'écran des circuits (une coupe, un circuit, ou plusieurs circuits de n'importe quelle coupe : [track-select.md](track-select.md)). Les courses s'enchaînent dans l'ordre.
- **Points** (2E) : chaque course rapporte des points (`RACE_POINTS` : 15, 12, 10, ... 1 pour les 12 premiers), additionnés pendant toute la partie : programme, courses votées ensuite, jusqu'au retour au menu. Une course abandonnée (changement de circuit au menu pause) ne rapporte rien.
- **Résultats** : classement de la partie (10 premiers et joueurs locaux) avec le temps de la course, ses points et le total. Titre « Classement général » après la dernière course d'un programme ou après une course votée.
- **Suite** : course suivante du programme ; sinon **vote** : chaque joueur local choisit parmi les autres circuits, le plus choisi est couru (égalité : tirage au sort), annoncé 2,2 s avant le départ. On peut revoter indéfiniment ; les points continuent de s'additionner.

## Interface

- `sessionStore.match` : `cupId` (si le programme est exactement une coupe), `playlist`, `round` (0..), `points` ({ pilote: total avant cette course }), `racesDone`.
- `raceFlowStore` : `step` (null : résultats, `vote`, `reveal`), `options`, `winner`, `counts`.
- Entrées : START ou A pour continuer (après `RACE.resultsInputDelay`) ; au vote, contrôleur de sélection générique. Bouton `#results-continue-btn`.
- Sélecteurs : `#race-results`, `[data-result][data-total]`, `#track-vote`, `[data-voted]`, `#track-vote-reveal[data-winner]`.

## Dépendances

Système de sélection générique ; course : `startRace`, `raceStore.results` ; menu pause : `changeTrack` ([pause-menu.md](pause-menu.md)).

## Performance

Superposition montée seulement en phase « résultats » ; aucun coût pendant la course.

## Conformité règles d'or

- [x] Aucun dégradé linéaire (fond translucide uni)
- [x] Aucun emoji ; icônes lucide utiles (Trophy, Flag, Vote, Check, Route)
- [x] Tailwind uniquement
- [x] Animations Motion courtes (MotionConfig : mouvement réduit respecté)
- [x] Séparation UI / état / 3D : stores et game/raceFlow.js ; la 3D suit `match.trackId`
- [x] Aucun texte en dur (results.*, vote.*)
- [x] Toutes les zones qui défilent ont `scrollbar-game`

## Évolutions prévues

Vote en ligne (smkw-api), podium et trophée de fin de programme, points gardés d'une partie à l'autre (profil).
