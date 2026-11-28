# Plongées (Water Cup)

- **Type** : système + objet 3D
- **Fichiers** : `game/track/trackDives.js`, `game/race/kartMove.js`, `kartSpeed.js`, `kartVertical.js`, `remoteKart.js`, `components3d/Camera/underwaterView.js`, `components3d/Racers/KartBubbles.jsx`, `components3d/Track/waterMaterial.js` (deux faces) ; réglages `UNDERWATER` (config/kartTuning.js) ; ambiance `reef` (config/trackThemes.js)
- **Phase** : introduit en phase 3G

## Rôle

La course se joue aussi sous l'eau : la route plonge au fond d'un lagon, file sous la surface, puis remonte.

## Interface

- Donnée `dives: [[fraction, longueur m, profondeur m]]` ; route à hauteur 0 autour. Pentes de `DIVE.slope` m.
- `applyDives` abaisse `path.y` avant le calcul du relief et pose un chapelet de lacs au-dessus.
- `geometry.under` : 1 sur toute la plongée, pentes comprises (on n'y coule pas, même hors de la route).
- `kart.underwater` : sous la surface. Vitesse x 0,93 et gravité x 0,45 (sauts lents).
- Vue : quand la caméra d'un joueur en plongée passe sous la surface, brouillard bleu et proche (`underwaterView`). La surface se voit d'en dessous. Des bulles montent derrière le kart.
- Accoler une voie d'eau et une plongée : aucun trou entre elles, sinon un kart hors de la route y coule.

## Dépendances

Aucune dépendance npm.

## Performance

Calcul une fois par circuit ; six petites sphères par kart, cachées hors de l'eau. Le brouillard ne change que le temps du rendu de la case concernée.

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji ; aucune icône
- [x] Tailwind uniquement (aucun style dans ces fichiers)
- [x] Animations : useFrame pour l'état du kart ; mouvement réduit respecté (bulles figées)
- [x] Séparation UI / état / 3D respectée
- [x] Rien d'une phase suivante

## Évolutions prévues

Rien de prévu.
