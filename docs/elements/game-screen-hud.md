# Écran de jeu et HUD de démonstration

- **Type** : écran + composants UI
- **Fichiers** : `src/components/screens/GameScreen.jsx`, `src/components/screens/split/*`, `src/components/ui/hud/*`, `src/hooks/useTelemetryListener.js`
- **Phase** : 1, une case par joueur en 1F

## Rôle

Afficher un HUD de course de démonstration par-dessus la scène, **une case par joueur local** (écran partagé, voir [split-screen.md](split-screen.md)) : étiquette du joueur, objet (vide), tour + chrono, vitesse, position. Le tour en cours et l'objet sont **fictifs** (`DEMO_HUD`), le nombre de tours est celui du circuit, la position est l'ordre sur la grille de départ ; le chrono est réel.

## Disposition

| Zone de la case | Composant |
| --- | --- |
| Haut gauche | Étiquette du joueur (P1 sur sa couleur, visage, nom), `ItemSlot` (vide) |
| Bas gauche | `Speedometer` (grandes cases), `LapPanel` (tour + `RaceTimer`) |
| Bas droite | `PositionBadge` (position / nombre de joueurs) |

Commun à l'écran, en haut à droite : `HudActions` (`#hud-settings-btn`, `#hud-exit-btn`) et, en solo seulement, `DemoBadge`.

Les tailles suivent la case (requêtes de conteneur `@xs`, `@md`, `@3xl` sur la largeur, `cell-short:` / `cell-low:` sur la hauteur), plus les points de rupture de l'écran.

## Données

- `RaceTimer` et `Speedometer` lisent `telemetryStore` via `useTelemetryListener` et écrivent le DOM par ref : **aucun re-render par frame**.
- Le chrono est avancé par le système `GameClock` (boucle R3F) et mis en pause quand les réglages sont ouverts.
- `Échap` ou `#hud-exit-btn` : `exitMatch()` (session effacée, retour au menu principal). Le chrono repart de zéro au prochain départ.
- Tous les libellés passent par i18n (`hud.*`), y compris l'ordinal de la position (`1er` / `1st`).
- `DemoBadge` affiche le mode de la partie en cours (`sessionStore.match.modeId`).

## Performance

Mise à jour d'un `textContent` et d'un `transform` par frame, rien d'autre. La barre de vitesse utilise un style inline par nécessité technique (valeur haute fréquence).

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji ; icônes Package, Flag, Timer, Gauge, Settings, LogOut, Info, Map
- [x] Tailwind uniquement (inline justifié et commenté)
- [x] Apparition Motion depuis les bords, mouvement réduit respecté
- [x] Aucun import 3D (lecture via store uniquement)
- [x] Rien d'une phase suivante (pas de kart, pas de tours réels, pas d'objets)

## Évolutions prévues

Phase 2 : vitesse réelle du kart. Phases course : tours, classement, objets, compte à rebours.
