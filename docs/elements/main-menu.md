# Menu principal (MainMenu)

- **Type** : écran
- **Fichiers** : `src/components/menu/MainMenu.jsx`
- **Phase** : 1 (écran d'accueil), refondu en 1B

## Rôle

Point d'entrée devant la scène 3D décorative : logo, gros bouton JOUER, Garage (annoncé), Paramètres, sélecteur de langue, rappel des touches, version.

## Interface

| Élément | Sélecteur | Action |
| --- | --- | --- |
| JOUER (`MenuButton hero`, focus initial) | `#start-btn` | `navigate('modeSelect')` |
| Garage | `#garage-btn` (désactivé) | Badge « Bientôt », aucun écran créé |
| Paramètres | `#settings-btn` | Overlay Paramètres |
| Langue | `#language-btn` | Panneau de langues |
| Touches | — | `Entrée` jouer, flèches naviguer, `F` plein écran |

Quitter : non proposé sur le web (un onglet ne peut pas se fermer lui-même) ; à ajouter pour une version bureau.

## Animations

Titre en montée + scale, puis boutons décalés, puis pied de page (Motion). Caméra 3D en orbite lente, objet vitrine cadré à droite sur écran large.

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji ; icônes Play, Warehouse, Settings, Languages, Lock, ChevronRight
- [x] Tailwind uniquement
- [x] Motion pour l'entrée, Tailwind pour le survol / clic, mouvement réduit respecté
- [x] Aucun texte en dur
- [x] Rien d'une phase suivante (Garage seulement annoncé)
