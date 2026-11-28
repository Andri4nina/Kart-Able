# Ajustement à l'écran (FitToScreen)

- **Type** : composant UI
- **Fichiers** : `smkw-ui/src/components/ui/FitToScreen.jsx`, `smkw-ui/src/hooks/useFitScale.js` ; utilisé par `components/menu/MenuPage.jsx`
- **Phase** : introduit en phase 3G

## Rôle

Un jeu ne défile pas : tout le contenu d'un écran du parcours (mode, type, joueurs, personnages, véhicules, circuits, lobby) doit tenir à l'écran. FitToScreen réduit son contenu (`zoom`) juste assez pour qu'il tienne dans la hauteur disponible.

## Interface

- `<FitToScreen className minScale={0.6}>` : cadre (`min-h-0`, à mettre dans un parent flex qui fixe sa hauteur).
- `useFitScale(minScale)` → `{ frameRef, contentRef, scale, overflow }`.
- En dessous de `minScale`, le cadre défile en secours (`scrollbar-game`).
- Écrans très bas (`max-height: 30rem`, téléphone en paysage) : MenuPage laisse le contenu à sa taille normale et fait défiler toute la page ; le hook revient alors à l'échelle 1 (cadre en `overflow: visible`).

## Dépendances

Aucune dépendance npm. `ResizeObserver` sur le cadre et le contenu.

## Performance

Mesure seulement quand une taille change ; l'échelle converge en deux ou trois mesures (tolérance 1 %). Aucun coût par frame.

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji ; aucune icône
- [x] Tailwind uniquement (style inline justifié : variable `--fit` mesurée à l'exécution, lue par la classe `[zoom:var(--fit)]`)
- [x] Animations : aucune
- [x] Séparation UI / état / 3D respectée
- [x] Rien d'une phase suivante

## Évolutions prévues

Mêmes principes pour les fenêtres (réglages, pause) si leur contenu dépasse.
