# Preview 3D des écrans de sélection (personnages, véhicules)

- **Type** : scène 3D (R3F)
- **Fichiers** : `src/config/characterPreview.js`, `src/components3d/SelectionPreview/` (`SelectionPreviewStage.jsx`, `PreviewSlot.jsx`, `previewAnimation.js`), `src/components3d/Characters/` (`CharacterModel.jsx`, `characterResources.js`), `src/components3d/Vehicles/`
- **Phase** : 1D, étendu en 1E (personnage seul, véhicules GLB) et 1G (personnages GLB, karts peints)

## Principe

Le preview est rendu **dans la scène et le Canvas existants** : pas de second Canvas, pas d'image. Sur les écrans de plan caméra `selection` :
- `CameraRig` prend la vue fixe sur la rangée ;
- la gemme vitrine est masquée ;
- `SelectionPreviewStage` place un `PreviewSlot` par joueur ;
- l'UI laisse une zone transparente en haut, et `PreviewLabels` aligne P1...P8 + nom sous chaque modèle.

| Écran | Modèle | Attente |
| --- | --- | --- |
| Personnages | `CharacterModel` : **le personnage GLB seul**, à la hauteur de son gabarit | animation d'attente du modèle, léger balancement |
| Véhicules | `VehicleModel` : GLB normalisé, **peint à la couleur du personnage confirmé** | rotation lente sur le socle |

## Lien avec la présélection

`PreviewSlot` lit `selections[playerId]` dans le store de l'écran (re-rendu pour ce joueur seulement) et affiche `confirmedId ?? preselectedId`. Changer d'élément **remplace** le modèle (`Suspense` avec une clé par élément) et joue l'animation de changement : surgit en faisant un tour. Confirmer déclenche un petit saut et illumine le disque du socle.

## Modèles

Personnages : voir [character-models.md](character-models.md) (préparation, gabarits, animations). Véhicules : voir [vehicle-select.md](vehicle-select.md) et [kart-paint.md](kart-paint.md). `renderModel(itemId, playerId)` reçoit le joueur, pour peindre son véhicule.

## Géométrie partagée UI / 3D

`config/characterPreview.js` : caméra, profondeur de la rangée, 80 % de la largeur d'écran, échelle maximale 0,58. `getLineupLayout` et `getPedestalFrontTop` donnent positions et étiquettes : socles alignés exactement sur les étiquettes, modèles sous l'en-tête.

## Performance

Monté seulement sur les écrans de sélection. Personnages et véhicules : clones des GLB (géométries et textures partagées), préchargés pendant le choix des personnages. Une fonction `useFrame` légère par joueur.

## Conformité règles d'or

- [x] Réutilise le Canvas, la scène, la caméra, les lumières et le socle existants
- [x] Un seul modèle par joueur, pas de duplication de scène
- [x] `useFrame` limité à l'animation continue ; mouvement réduit respecté
- [x] Aucun emoji ; couleurs pleines
