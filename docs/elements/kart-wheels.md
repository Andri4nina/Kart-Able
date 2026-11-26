# Roues animées des karts

- **Type** : objet 3D (système d'animation)
- **Fichiers** : `smkw-ui/src/components3d/Vehicles/wheelRig.js`, `VehicleModel.jsx` (`onWheels`), `smkw-ui/src/components3d/Racers/RacerKart.jsx`
- **Phase** : 2E

## Rôle

Les roues tournent selon la vitesse du kart (en avant comme en marche arrière) et les roues avant braquent avec le volant. Les modèles GLB n'ont pas de noms de roues communs : les roues sont repérées automatiquement dans le modèle normalisé (avant = +Z). Une roue est une pièce basse, ronde vue de côté, écartée de l'axe et qui touche le sol ; le pneu et la jante d'une même roue sont regroupés pour tourner à la même vitesse. Chaque pièce est placée sous un pivot au centre de sa roue. Pour les modèles à squelette, les os nommés « wheel » (pas le volant) tournent sur eux-mêmes. Les 7 véhicules sont reconnus (4 roues chacun).

## Interface

- `buildWheelRig(model)` : `{ parts, angle }` ou null ; `writeWheelRig(rig, vitesse m/s, braquage rad, delta)`.
- `VehicleModel` : `onWheels(rig)` (facultatif, karts en course seulement ; null au démontage).

## Dépendances

Three.js seulement.

## Performance

Calcul une fois par clone ; puis par frame 4 à 8 quaternions par kart, sans allocation.

## Conformité règles d'or

- [x] Aucun dégradé linéaire ; aucun emoji
- [x] Animation `useFrame` (vitesse réelle : c'est de l'information, gardée en mouvement réduit)
- [x] Séparation : lit l'état de course, ne le modifie pas
- [x] Rien d'une phase suivante

## Évolutions prévues

Suspension (roues qui suivent le relief), traces de rotation floues à grande vitesse.
