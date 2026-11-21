# Navigation (écrans, pile, transitions)

- **Type** : couche navigation
- **Fichiers** : `src/navigation/screens.js`, `src/stores/navigationStore.js`, `src/components/layout/UILayer.jsx`, `src/components/layout/ScreenWipe.jsx`, `src/hooks/useGlobalHotkeys.js`, `src/hooks/useArrowNavigation.js`
- **Phase** : 1B (menu)

## Registre (`screens.js`)

| Id | Écran | Plan caméra | Étape |
| --- | --- | --- | --- |
| `mainMenu` | MainMenu | `menu` | — |
| `modeSelect` | GameModeMenu | `menuWide` | 1 |
| `playType` | PlayTypeMenu | `menuWide` | 2 |
| `localSetup` | LocalMultiplayer (PRESS START) | `menuWide` | 3 (local) |
| `characterSelect` | CharacterSelect | `selection` | 4 (local) |
| `vehicleSelect` | VehicleSelect | `selection` | 5 (local) |
| `onlineSetup` | OnlineMultiplayer | `menuWide` | 3 (réseau) |
| `lobby` | Lobby | `lobby` | 6 (local) / 4 (réseau) |

Parcours (`MENU_FLOWS`) : local = mode, type, joueurs, personnages, véhicules, circuits (modes de course seulement, `getMenuFlow(playType, usesTracks)`), lobby ; réseau = mode, type, connexion, lobby. Le numéro d'étape et le stepper se calculent depuis ce parcours.

Sur les écrans Joueurs locaux et Personnages, les flèches, Entrée, Espace, ZQSD, Retour arrière et Maj sont des **entrées joueurs** (voir [input-system.md](input-system.md)), pas de la navigation de focus.
| `game` | GameScreen (HUD démo) | `game` | — |

Données pures : l'UI associe l'id au composant (`SCREEN_COMPONENTS` dans UILayer), la 3D au plan caméra.

## Store

- `stack` : pile d'écrans ; `selectCurrentScreen(state)` donne l'écran affiché.
- `navigate(id)` empile (+1), `back()` dépile (-1), `resetTo(id)` repart d'un écran.
- `direction` oriente le glissement des pages (`pageVariants`, `AnimatePresence custom`).
- `wipeId` s'incrémente uniquement en entrant en jeu ou en en sortant (balayage plein écran).
- `settingsOpen` : overlay Paramètres accessible partout.

## Clavier (base de la future manette)

| Touche | Effet |
| --- | --- |
| Flèches | Focus suivant / précédent parmi les `[data-nav-item]` du conteneur (menu, cartes, onglets, langues) |
| `Entrée` | Clic natif sur l'élément focalisé ; sur le menu principal sans focus : Jouer |
| `Échap` | Ferme les paramètres, sinon écran précédent, sinon (en jeu) retour au menu. Dans un champ texte : quitte le champ |
| `F` | Plein écran |

Chaque écran place le focus sur son action principale à l'arrivée (JOUER, mode sélectionné, premier type disponible). Le lobby local n'a pas de bouton focalisé : chaque joueur se déclare prêt avec son périphérique.

## Conformité règles d'or

- [x] Aucun dégradé linéaire (wipe en couleurs pleines)
- [x] Aucun emoji
- [x] Transitions Motion courtes ; wipe supprimé en mouvement réduit
- [x] Registre sans import UI ni 3D
- [x] Rien d'une phase suivante

## Évolutions prévues

Mapping Gamepad API vers les mêmes actions (croix = flèches, A = Entrée, B = Échap).
