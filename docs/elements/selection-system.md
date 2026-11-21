# Système de sélection générique (personnages, véhicules)

- **Type** : règles + store + contrôleur + composants UI
- **Fichiers** :
  - Règles pures : `src/game/selection/selectionRules.js`
  - Store : `src/stores/createSelectionStore.js` (fabrique) ; instances `characterSelectionStore.js` (unique) et `vehicleSelectionStore.js` (partagé)
  - Contrôleur : `src/game/selection/createSelectionController.js` ; instances `game/characterSelect.js`, `game/vehicleSelect.js`
  - UI : `src/components/selection/` (`SelectionScreen`, `SelectionRoster`, `SelectionPanel`, `PanelControls`, `SelectionStatus`, `RosterCursors`, `PreviewLabels`)
- **Phase** : 1E (factorisé à partir de la sélection des personnages de 1D)

## Principe

Une seule implémentation, utilisée deux fois. Seuls changent les données et le rendu des cartes et des informations.

| | Personnages | Véhicules |
| --- | --- | --- |
| Éléments | `CHARACTER_IDS` (8) | `VEHICLE_IDS` (7) |
| `unique` | oui : un personnage confirmé est réservé | non : plusieurs joueurs peuvent prendre le même |
| Carte du roster | visage seul (`CharacterCard`) | icône + nom (`VehicleCard`) |
| Panneau | visage, nom, type (`PanelCharacterInfo`) | nom, statistiques en solo uniquement (`VehiclePanelInfo`) |
| Preview 3D | `CharacterFigure` (personnage seul) | `VehicleModel` (GLB) |
| Suite | sélection des véhicules | lobby |

## État par joueur

`selections[playerId] = { status: 'selecting' | 'confirmed', preselectedId, confirmedId, lastMove, rejections }` : chaque joueur est indépendant. Actions : `begin(players)`, `move(playerId, delta)`, `confirm(playerId)` (refuse un élément réservé quand `unique`), `cancel(playerId)`, `reset()`.

## Commandes

Gauche / droite : élément voisin. Haut / bas : rangée (±colonnes, 4). START ou A : confirmer. RETOUR : annuler. Quand tout le monde a confirmé, START ou Continuer passe à l'écran suivant. Les éléments réservés sont sautés.

## Ajouter un écran de sélection

1. Une liste d'identifiants et un store : `createSelectionStore({ itemIds, unique, defaultFor })`.
2. Un contrôleur : `createSelectionController({ useStore, columns, onComplete })`.
3. Un écran : `SelectionScreen` avec un `SelectionRoster`, un `renderInfo` et un `getNameKey`.
4. Un plan caméra `selection` dans `SCREEN_META`, et une entrée dans `STAGES` de `SelectionPreviewStage` pour le modèle 3D.

## Conformité règles d'or

- [x] Réutilisation : aucune logique de sélection dupliquée entre personnages et véhicules
- [x] Fichiers d'environ 100 lignes au plus
- [x] Validation dans les règles et le store, revérifiée au départ (`matchRules`)
- [x] Tailwind uniquement ; aucun texte en dur ; aucun emoji
