# Choix de la coupe et du circuit

- **Type** : écran
- **Fichiers** : `src/components/menu/TrackSelect.jsx`, `src/components/tracks/` (`TrackCard.jsx`, `TrackMinimap.jsx`, `TrackPreview.jsx`), `src/game/trackSelect.js`, `src/stores/trackSelectionStore.js`
- **Phase** : 1H

## Flow

Joueurs locaux, personnages, véhicules, puis **circuits** (modes qui se courent sur un circuit : course, contre-la-montre), puis lobby, puis course sur le circuit choisi. Les modes sans circuit (bataille, Rocket Gol) passent directement au lobby, et l'étape « Circuits » disparaît de leur parcours.

## Ce que voit le joueur

- Une rangée de 4 cartes par coupe, sous le nom de la coupe (Kairos Cup) : mini-carte SVG du tracé (lacs, route, ligne de départ), nom, longueur du tour.
- Aperçu du circuit présélectionné : grande carte avec les checkpoints, description, longueur du tour, tours, largeur, nombre de points de passage.
- Le panneau de P1 (statut, périphérique, flèches, Confirmer) ; pied de page : Continuer quand le circuit est confirmé.

## Qui choisit

En local, **P1 choisit pour tout le monde** (comme les jeux de kart de salon) : la sélection réutilise le système générique avec un seul joueur inscrit, les entrées des autres sont ignorées. En réseau, un vote viendra avec smkw-api.

| Entrée (P1) | Effet |
| --- | --- |
| Gauche / droite | circuit voisin |
| Haut / bas | coupe voisine (4 circuits par rangée) |
| START ou A | confirmer, puis START : lobby |
| RETOUR | annuler la confirmation |

## Interface et tests

- `#track-<id>` (cartes), `#P1-prev-btn`, `#P1-next-btn`, `#P1-confirm-btn`, `#tracks-continue-btn`.
- `render_game_to_text()` : `trackSelection` (présélection, confirmation), puis `match.trackId`, `match.laps` et `track` en course.
- Lobby : ligne « Circuit : Côte Turquoise · Kairos Cup » ; départ bloqué (`trackPending`) sans circuit.

## Conformité règles d'or

- [x] Réutilise le système de sélection générique (store, contrôleur, roster, panneau)
- [x] Mini-cartes en SVG à couleurs pleines, aucune image ; aucun dégradé ; aucun emoji
- [x] Icônes utiles seulement (Trophy, Ruler, Flag, MoveHorizontal, ScanLine)
- [x] Aucun texte en dur ; aucune touche en dur

## Évolutions prévues

Vote en réseau ; aperçu 3D survolant le circuit ; nouvelles coupes.
