# Voies d'eau (Water Cup)

- **Type** : système + objet 3D
- **Fichiers** : `game/track/trackWaterways.js`, `game/race/kartMove.js`, `kartVertical.js`, `kartPhysics.js`, `kartSpeed.js`, `remoteKart.js`, `components3d/Racers/KartWake.jsx` ; réglages `WATER` (config/kartTuning.js) ; données `config/trackData/waterCup.js`
- **Phase** : introduit en phase 3G

## Rôle

Sur une voie d'eau, la route devient un plan d'eau : les karts y flottent et glissent au lieu de couler. L'adhérence baisse, il faut anticiper les virages.

## Interface

- Donnée de circuit `waterways: [[fraction, longueur m]]` ; route à hauteur 0 sur ces portions.
- `geometry.water` : 1 sur les échantillons de voie d'eau ; un chapelet de lacs est posé tout du long (eau animée, rives).
- `geometry.hidden` (brèches et voies d'eau) : pas d'asphalte, de marquage ni de clôture à ces endroits.
- Kart : `kart.onWater` ; sol à `WATERWAY.level` ; vitesse max x `WATER.speed` (0,95), adhérence latérale x `WATER.grip` (0,4) ; on ne coule pas, même hors de la route.
- Rendu : sillage d'écume (`KartWake`), tangage sur les vagues (`kartPose`).

## Dépendances

Aucune dépendance npm.

## Performance

Un drapeau par échantillon ; un maillage de sillage par kart (caché hors de l'eau).

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji ; icône lucide `Split` / `Waves` pour l'emblème de la coupe
- [x] Tailwind uniquement (aucun style dans ces fichiers)
- [x] Animations : useFrame seulement pour l'état du kart ; mouvement réduit respecté
- [x] Séparation UI / état / 3D respectée (données dans config/, calcul pur dans game/, rendu dans components3d/)
- [x] Rien d'une phase suivante

## Évolutions prévues

Rien de prévu.
