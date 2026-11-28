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

## Squelettes Quaternius (phase 3G)

- Bout de chaîne sans os (`LowerLeg.L_end` est un simple nœud dans les exports FBX2glTF) : `limb` prend alors ce nœud comme extrémité. Sans cela, aucune pose assise (Nino restait debout dans le kart).
- Pieds en IK (`Foot.L` enfant de `Root`) : `driverFeet.attachFeet` les replace au bout du tibia une fois la pose calculée. Sans cela, ils restaient au sol, 70 cm sous le bassin.
- Colonne : `abdomen` et `torso` reconnus comme `spine`.
- Vérifié en Node : bassin et rig identiques pour les 15 personnages existants.

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji
- [x] Tailwind uniquement (aucun style ici)
- [x] Animations : useFrame, mouvement réduit respecté (gestes sans amorti, aucune vibration)
- [x] Séparation UI / état / 3D respectée
- [x] Rien d'une phase suivante

## Évolutions prévues

Animations faites main (assis, victoire) si des GLB dédiés sont ajoutés ; regarder un adversaire proche.

## Animation procédurale (phase 3G)

- **Principe** : `boneMotion.js` ajoute des rotations autour des axes du personnage (X gauche, Y haut, Z regard) par-dessus la pose du moment, sans connaître les axes du squelette (axes ramenés dans le repère de l'os une fois).
- **Au volant** (`driverMotion.js`, appelé par `driverRig.update`), buste et tête :
  - à l'arrêt : respiration, regard autour de soi ;
  - en roulant : buste penché avec la vitesse, tête qui vibre avec le moteur ;
  - turbo : plaqué en arrière ; drift : buste et tête penchés vers l'intérieur ;
  - en l'air : tête vers le bas ; choc : tête secouée ; arrivée : balancement avec les bras levés.
  - Entrées écrites par `kartPose.js` : `speed`, `boost`, `drift`, `air`.
- **Modèles sans squelette** : tout le pilote est plaqué en arrière par le turbo et tassé à l'atterrissage (`kartPose.js`).
- **Attente** (`idleMotion.js`, sélection et podium) : les personnages sans animation en boucle respirent, tournent la tête et balancent les bras.
- **Mouvement réduit** : inclinaisons seulement, aucune oscillation ; aucune attente procédurale.
- **Coût** : quelques multiplications de quaternions par pilote et par frame, aucune allocation.
