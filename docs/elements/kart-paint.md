# Peinture du kart aux couleurs du personnage

- **Type** : système 3D (matériaux)
- **Fichiers** : `src/components3d/Vehicles/kartPaint.js`, `VehicleModel.jsx` (prop `paint`), appelants `SelectionPreviewStage.jsx` (véhicules) et `RacerKart.jsx`
- **Phase** : 1G

## Rôle

Comme dans les jeux de kart de salon, chaque personnage a son identité colorée : le véhicule qu'il choisit est **repeint à sa couleur** (`color` dans `config/characters.js`). Deux joueurs sur le même véhicule ont donc deux karts de couleurs différentes.

## Principe

- Les matériaux du clone du véhicule sont copiés (l'original du cache reste intact) et leur shader reçoit une fonction `kartPaint` après `color_fragment`.
- Les zones **colorées** (saturées : carrosserie, décors) prennent la teinte du personnage en gardant leur luminosité, donc leur ombrage et leurs détails ; les zones **neutres** (pneus, noir, gris, chrome, blanc) restent intactes.
- Un seul programme GPU pour toutes les couleurs (`customProgramCacheKey`), la teinte est un uniform.
- Sélection des véhicules : couleur du personnage confirmé par le joueur. Course : couleur du personnage du joueur.

## Performance

Copies de matériaux seulement (textures partagées), libérées au démontage. Quelques instructions de plus par fragment.

## Conformité règles d'or

- [x] Aucun dégradé linéaire ; aucun emoji
- [x] Couleurs lues dans la configuration, aucune couleur en dur dans les composants
- [x] Rien d'une phase suivante
