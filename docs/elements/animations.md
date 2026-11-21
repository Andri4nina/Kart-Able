# Animations

- **Type** : système transverse
- **Fichiers** : `src/animations/transitions.js`, `src/animations/variants.js`, `src/hooks/useReducedMotion.js`, `src/components/layout/ScreenWipe.jsx`
- **Phase** : 1

## Rôle

Centraliser durées, courbes et variants pour des animations courtes et cohérentes, et une gestion unique du mouvement réduit.

## Répartition des outils

| Besoin | Outil | Exemple |
| --- | --- | --- |
| Hover, active, focus | Tailwind | `Button` : `motion-ok:hover:-translate-y-1` |
| Apparition titre, boutons décalés, HUD, dialogue, transitions d'écran | Motion | `titleVariants`, `staggerList`, `hudFrom.*`, `dialogVariants` |
| Transition plein écran | Motion (une div, transform) | `ScreenWipe` |
| Rotation / flottement 3D, caméra | `useFrame` | `ShowcaseGem`, `CameraRig` |

## Durées (`transitions.js`)

`fast` 0,18 s · `base` 0,32 s · `slow` 0,5 s · `wipe` 0,7 s. Courbe par défaut `EASE_OUT` `[0.22, 1, 0.36, 1]`.

## Séquences

- Menu principal : fondu du calque, puis titre (montée + scale), puis JOUER, Garage, Paramètres décalés de 90 ms, puis pied de page.
- Entre écrans du parcours : `pageVariants` (glissement horizontal selon le sens avant / retour, `AnimatePresence mode="wait" custom={direction}`), puis en-tête, contenu et actions en séquence (`pageItem`, `pageList`).
- Sélection d'un mode : cadre jaune partagé (`layoutId`, ressort court) + teinte 3D de l'objet vitrine.
- Panneaux : sélecteur de langue (`popoverVariants`), onglets des paramètres (indicateur `layoutId`, contenu `swapVariants`), erreur de code (`swapVariants`).
- Vers le jeu / retour au menu : wipe rouge/jaune (0,7 s), caméra lissée, HUD en glissement depuis chaque bord.
- Paramètres : fond en fondu, panneau en montée + scale.

## Mouvement réduit

`useReducedMotion()` = préférence système, sauf réglage joueur `Reduced` / `Full`.
Effets : `MotionConfig reducedMotion="always"` (Motion ne garde que les opacités), `data-reduced-motion="true"` (désactive les `motion-ok:`), wipe supprimé, scène 3D figée, caméra sans lissage.

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji
- [x] Pas de GSAP / React Spring / Anime.js
- [x] Motion jamais utilisé pour des objets 3D
- [x] Animations courtes, aucune animation permanente coûteuse côté DOM
- [x] Mouvement réduit respecté partout

## Évolutions prévues

Compte à rebours de départ, animations de classement (phases course).
