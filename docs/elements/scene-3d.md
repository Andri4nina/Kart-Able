# Scène 3D (GameCanvas, DemoScene, World)

- **Type** : scène + objets 3D
- **Fichiers** : `src/scenes/GameCanvas.jsx`, `src/scenes/DemoScene.jsx`, `src/components3d/World/*`
- **Phase** : 1

## Rôle

Unique `<Canvas>` de l'application et monde de démonstration de la phase 1, partagé par le menu et l'écran de jeu (seule la caméra change).

## Composition

| Élément | Contenu |
| --- | --- |
| `GameCanvas` | `dpr` selon la qualité, options GL figées (antialias, sans stencil, `high-performance`), `CameraRig`, `GameClock`, `TestBridge` (si test), `<Suspense>` |
| `Atmosphere` | Fond uni `sky` + brouillard de même couleur (le fond est dessiné dans le Canvas) |
| `Lights` | `hemisphereLight` + `directionalLight`, sans ombres |
| `Ground` | Disque herbe + `Grid` drei infini avec fondu |
| `DemoProps` | Podium, objet vitrine, 8 cônes en cercle, 4 piles de pneus |
| `ShowcaseGem` | Icosaèdre flat shading + anneau blanc ; rotation et flottement via `useFrame` depuis l'horloge (déterministe). Pendant le parcours du menu, prend la couleur du mode sélectionné (`MODE_COLORS`, fondu `lerp` sans allocation) ; jaune de marque ailleurs |
| `BlobShadow` | Disque noir transparent sous chaque objet (remplace les shadow maps) |
| `TrackWorld` | Monde du circuit généré, à la place de l'arène pendant une course sur circuit (voir [track-world.md](track-world.md)) |
| `StartGrid` | Karts des joueurs (véhicule + personnage) sur leurs cases de départ, seulement pendant une partie (voir [start-grid.md](start-grid.md)) |
| `SelectionPreviewStage` | Rangée de previews (personnage seul, puis véhicule GLB), montée seulement sur les écrans de sélection (voir [selection-preview-3d.md](selection-preview-3d.md)) ; la gemme est alors masquée |

## Ressources

`demoResources.js` : géométries et matériaux créés une seule fois au niveau module et partagés. `palette.js` : couleurs 3D. Aucune texture.

## Performance

- ~55 meshes, une dizaine de géométries et de matériaux partagés, 2 lumières, 0 ombre, 0 post-processing.
- Une seule animation 3D (objet vitrine) ; aucune allocation par frame.
- Nommage pour les tests : `showcase-gem`, `userData.kind` (`cone`, `tireStack`, `podium`, `showcase`, `ground`).

## Conformité règles d'or

- [x] Aucun dégradé linéaire (fond et matériaux unis)
- [x] Aucun emoji
- [x] Animations 3D via `useFrame` uniquement, figées en mouvement réduit
- [x] Aucun import de `components/`
- [x] Rien d'une phase suivante (pas de kart, pas de physique, pas de circuit)

## Évolutions prévues

Phase 2 : `RaceScene` avec kart GLB et physique Rapier. Plus tard : circuits (GLB + Draco/KTX2), instancing des props, LOD.
