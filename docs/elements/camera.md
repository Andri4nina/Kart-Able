# Caméra (CameraRig + comportements)

- **Type** : système 3D
- **Fichiers** : `src/components3d/Camera/CameraRig.jsx`, `src/components3d/Camera/cameraBehaviors.js`
- **Phase** : 1

## Rôle

Caméra perspective par défaut (`PerspectiveCamera makeDefault` de drei), pilotée par un **comportement par écran**. Remplacer la caméra revient à remplacer une entrée de `CAMERA_BEHAVIORS`.

## Contrat d'un comportement

```js
{
  fov: 45,               // ou null : FOV des réglages joueur
  update({ time, aspect, reducedMotion }, outPosition, outTarget) { ... }
}
```

Fonction pure : écrit la position et la cible **désirées**. `CameraRig` lisse (`MathUtils.damp`), applique `lookAt` et ne recalcule la projection que si le FOV change.

Chaque écran choisit son plan via `SCREEN_META[screen].camera` (`navigation/screens.js`).

| Plan | Écrans | Comportement |
| --- | --- | --- |
| `menu` | Menu principal | Orbite lente (rayon 13, hauteur 5) ; objet vitrine cadré à droite sur écran large |
| `menuWide` | Mode, Type, Local, Réseau | Plan large et haut (rayon 18, hauteur 9), orbite très lente, derrière les panneaux |
| `lobby` | Lobby | Plan bas et proche (rayon 9,5, hauteur 2,8), vitrine à droite |
| `selection` | Sélection des personnages et des véhicules | Vue fixe sur la rangée de previews 3D, cadrée dans le haut de l'écran ; constantes partagées avec l'UI (`config/characterPreview.js`) |
| `game` | Jeu | Vue fixe (0, 3,2, 9,5) vers (0, 1,2, 0), FOV des réglages. En partie locale, l'image est dessinée par l'écran partagé (une caméra de poursuite par case, voir [split-screen.md](split-screen.md)) |

Passer d'un écran à l'autre fait glisser la caméra (lissage) : c'est la transition 3D du menu.

## Performance

Vecteurs et contexte réutilisés (aucune allocation par frame). Lecture des stores via `getState()` : aucun re-render lors des transitions.

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji
- [x] Animation caméra via `useFrame`, sans lissage ni orbite en mouvement réduit
- [x] Aucun import de `components/`
- [x] Rien d'une phase suivante

## Évolutions prévues

Phase 2 : les caméras de poursuite de l'écran partagé (`chaseCamera.js`) suivent les karts en mouvement.
