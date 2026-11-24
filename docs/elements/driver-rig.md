# Pilote animé au volant

- **Type** : objet 3D
- **Fichiers** : `smkw-ui/src/components3d/Characters/driverPose.js`, `driverRig.js`, `prepareCharacter.js` (option `driver`), `CharacterModel.jsx` (prop `driver`), `components3d/Racers/kartPose.js`
- **Phase** : 2A

## Rôle

Avant : la figurine debout (première image d'une marche ou d'une attente) était enfoncée dans le siège. Maintenant : pose assise calculée sur le squelette de chaque GLB, et gestes qui suivent la conduite.

## Fonctionnement

- Repérage sans connaître le rig : chaînes de membres par nom (`leg|thigh|tigh|shin`, `arm`), os du haut de chaîne, côté par la position. Mixamo, Rigify, exports Sketchfab couverts (9 personnages sur 16).
- Les membres sont orientés vers des directions du repère du personnage (cuisses vers l'avant, tibias vers le bas, bras vers le volant).
- Poses clés calculées une fois : centre, volant à gauche, à droite, bras levés (arrivée), bras écartés (choc). À chaque frame : mélange amorti (slerp), aucune allocation, plus de mixer.
- Le bassin est posé sur le siège (`DRIVER_PELVIS_LIFT`).
- Modèles sans squelette exploitable (7) : animés en bloc par le kart (penché dans le virage, petite vibration). `driverPose: false` dans `characterAssets.js` pour exclure un squelette atypique (Osso).

## Interface

`<CharacterModel driver={objet stable { steer, cheer, panic }} />` ; `RacerKart` remplit l'objet chaque frame (`kartPose.js`).

## Performance

Poses précalculées ; par frame : ~12 slerp par pilote rigué.

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji
- [x] Tailwind uniquement (aucun style ici)
- [x] Animations : useFrame, mouvement réduit respecté (gestes sans amorti, aucune vibration)
- [x] Séparation UI / état / 3D respectée
- [x] Rien d'une phase suivante

## Évolutions prévues

Animations faites main (assis, victoire) si des GLB dédiés sont ajoutés ; regarder un adversaire proche.
