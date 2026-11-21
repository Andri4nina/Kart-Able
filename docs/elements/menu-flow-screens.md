# Écrans du parcours : Mode, Type, Local, Réseau, Lobby

- **Type** : écrans
- **Fichiers** : `src/components/menu/GameModeMenu.jsx`, `GameModeCard.jsx`, `PlayTypeMenu.jsx`, `PlayTypeCard.jsx`, `LocalMultiplayer.jsx`, `CharacterSelect.jsx`, `OnlineMultiplayer.jsx`, `Lobby.jsx`
- **Phase** : 1B (menu)

Tous utilisent `MenuPage` (voir [menu-components.md](menu-components.md)) et lisent la configuration de [game-modes.md](game-modes.md).

## 1. Mode de jeu — `GameModeMenu` / `GameModeCard`

- Grille générée depuis `GAME_MODES` (1 colonne mobile, 2 tablette, 4 desktop).
- Carte : icône et accent du mode, nom, description, pastilles `Local · 8`, `En réseau · 32` ou `Solo`, `Équipes`.
- Sélection : cadre jaune partagé animé (`layoutId="mode-selection"`) + coche ; l'objet vitrine 3D prend la couleur du mode.
- Souris : 1er clic sélectionne, 2e clic valide. Clavier : les flèches sélectionnent, `Entrée` valide. Bouton `#mode-continue-btn`.
- Sélecteurs : `#mode-race-btn`, `#mode-timeTrial-btn`, `#mode-battle-btn`, `#mode-rocketGol-btn`.

## 2. Type de partie — `PlayTypeMenu` / `PlayTypeCard`

- Deux grandes cartes : **Local** (grand « 8 », « Jusqu'à 8 joueurs ») et **En réseau** (grand « 32 », « Jusqu'à 32 joueurs »). Les nombres viennent de la limite du mode.
- Type indisponible pour le mode : carte grisée, cadenas, « Non disponible pour ce mode ».
- Sélecteurs : `#playtype-local-btn`, `#playtype-online-btn`.

## 3a. Joueurs locaux puis personnages (phase 1C)

Remplacé par l'entrée au START et la sélection des personnages : voir [local-players-join.md](local-players-join.md) et [character-select.md](character-select.md).

- Sélecteurs : `#slot-P<n>-start` (tactile), `#slot-P<n>-leave`, `#local-continue-btn` ; `#P<n>-prev-btn`, `#P<n>-next-btn`, `#P<n>-confirm-btn`, `#characters-continue-btn`.

## 3b. Partie en réseau — `OnlineMultiplayer`

- Bandeau « Jusqu'à 32 joueurs » + avertissement « serveur pas encore connecté ».
- **Créer une partie** (`#online-create-btn`) : rôle hôte, puis Lobby.
- **Rejoindre une partie** : champ `#room-code-input` (majuscules, caractères filtrés, 6 A-Z 0-9 ; pas de `maxLength` pour ne pas compter les caractères filtrés), `#join-submit-btn`, erreur animée `role="alert"`.
- **Matchmaking** : carte désactivée, badge « Bientôt ».
- Aucun appel réseau.

## 4. Lobby — `Lobby`

- Récapitulatif : mode (icône, nom, description), type, circuit et coupe (modes de course), joueurs `n / max`, code de partie (en ligne).
- Liste des joueurs : local = P1...P8, couleur, personnage et véhicule, périphérique, bouton « Prêt » ; en ligne = toi (hôte / invité). Places libres.
- Local : chaque joueur se déclare prêt (START / A ou son bouton `#P<n>-ready-btn`) ; quand tous le sont, `startMatch()` ouvre l'écran partagé. Voir [lobby-ready.md](lobby-ready.md).
- En ligne : départ désactivé avec la raison (« Un serveur est nécessaire... »).

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji ; icônes lucide-react (Flag, Timer, Swords, Rocket, Gamepad2, Globe, Users, Keyboard, Crown, UserPlus, UserMinus, Plus, LogIn, Search, Lock, WifiOff, Hash, Play)
- [x] Tailwind uniquement
- [x] Transitions de page, sélection, erreurs : Motion ; survol / clic : Tailwind
- [x] Aucun texte en dur ; modes lus depuis la config
- [x] Rien d'une phase suivante : pas de gameplay, pas de backend, pas de matchmaking réel

## Évolutions prévues

Options de course dans le Lobby (circuit, tours), sélection de personnage / kart (Garage), vraie room Colyseus.
