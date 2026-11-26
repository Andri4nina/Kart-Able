# Choix de la coupe puis des circuits (programme)

- **Type** : écran
- **Fichiers** : `src/components/menu/TrackSelect.jsx`, `src/components/tracks/` (`CupCard.jsx`, `TrackCard.jsx`, `PlaylistPanel.jsx`, `CupPreview.jsx`, `TrackPreview.jsx`, `TrackMinimap.jsx`), `src/game/trackSelect.js`, `src/stores/courseStore.js`, `src/stores/trackSelectionStore.js`, `src/config/cups.js` (`resolveCourse`), `src/config/race.js` (`COURSE`)
- **Phase** : 1H, revu en 2D puis en 2E

## Flow

Joueurs locaux, personnages, véhicules, puis **circuits** (modes qui se courent sur un circuit), puis lobby, puis course. Les modes sans circuit passent directement au lobby.

## Ce que voit le joueur (2E)

1. **Les coupes** : une carte par coupe (ses 4 circuits en mini-cartes). On en ouvre une.
2. **Les circuits de la coupe** : la carte « Coupe complète » puis ses 4 circuits. Chaque circuit choisi reçoit son numéro de passage. Le panneau **Programme** liste les circuits dans l'ordre (retirables d'un clic). On peut revenir aux coupes pour ajouter des circuits d'une autre coupe : on joue donc 1 circuit, 5 circuits, ou ce qu'on veut, jusqu'à `COURSE.maxRaces` (8).
3. Programme vide : toute la coupe ouverte est courue (comme avant).

Le programme est gardé en revenant du lobby. Le lobby affiche « Kairos Cup : coupe complète (4 circuits) », « Lac Miroir · Kairos Cup » ou « 3 courses, de Canyon Couchant à Prairie Kairos ».

## Qui choisit

En local, **P1 choisit pour tout le monde** ; les curseurs réutilisent le système de sélection générique (un store par étape, un seul joueur inscrit).

| Entrée (P1) | Coupes | Circuits de la coupe |
| --- | --- | --- |
| Directions | coupe voisine | carte voisine (5 par rangée) |
| A | ouvrir la coupe | ajouter / retirer (Coupe complète : tous ses circuits) |
| START | ouvrir la coupe | continuer vers le lobby |
| RETOUR | (écran précédent) | revenir aux coupes, programme gardé |

## Interface et tests

- `#cup-card-<id>` (coupes), `#cup-<id>[data-picked]` (coupe complète), `#track-<id>[data-order]`, `#course-playlist`, `#tracks-back-btn`, `#tracks-continue-btn`.
- `render_game_to_text().trackSelection` : `{ step, cupId, playlist }` ; en course `match.playlist`, `match.round`, `match.cupId` (coupe exacte, sinon null).
- Départ bloqué (`trackPending`) sans coupe ni circuit.

## Conformité règles d'or

- [x] Réutilise le système de sélection générique (stores de curseur, roster)
- [x] Mini-cartes en SVG à couleurs pleines ; aucun dégradé ; aucun emoji
- [x] Icônes utiles seulement (Trophy, Check, ListOrdered, X, ArrowLeft)
- [x] Aucun texte en dur ; aucune touche en dur ; zone qui défile : `scrollbar-game`

## Évolutions prévues

Vote en réseau ; aperçu 3D survolant le circuit ; nouvelles coupes ; réordonner le programme.
