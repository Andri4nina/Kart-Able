# Conduite du kart : drift, turbo, chocs

- **Type** : système
- **Fichiers** : `smkw-ui/src/config/kartTuning.js`, `smkw-ui/src/game/race/kartPhysics.js`, `kartDrift.js`, `kartBoost.js`, `kartCollisions.js`, `kartCapsule.js`, `kartStats.js`, `trackTracking.js` (murs), `smkw-ui/src/components3d/Racers/kartPose.js`, `KartEffects.jsx`, `smkw-ui/src/components/ui/hud/DriftGauge.jsx`
- **Phase** : 2A (conduite, drift, chocs)

## Rôle

Conduite arcade en calcul pur (pas fixe 1/120 s, aucune allocation), réglée entièrement depuis `config/kartTuning.js`. Le contrôleur ne contient aucune valeur de gameplay.

## Drift façon kart arcade

1. Appui sur Drift en roulant : petit saut (`DRIFT.hopTime`). En l'air, braquage réduit.
2. Le drift est armé tant que Drift est tenu : dès que le kart est au sol avec une direction braquée (au-delà de `steerThreshold`), pendant le saut ou plus tard, le dérapage part de ce côté avec une poussée vers l'extérieur (`entryKick`). Après une annulation, il faut relâcher puis réappuyer.
3. Pendant le dérapage, le kart tourne toujours vers l'intérieur : serré en braquant vers l'intérieur (`turnInside`), large vers l'extérieur (`turnOutside`).
4. Jauge : `charge += dt * stat drift * qualité`, qualité = braquage intérieur (x1,3) .. neutre (x1) .. extérieur (x0,45), multipliée par la vitesse ; hors-piste : aucune charge (sauf aéroglisseur).
5. Paliers : 0,9 / 1,9 / 3,1 -> `miniTurbo1` (bleu), `miniTurbo2` (orange), `miniTurbo3` (violet). Relâcher Drift déclenche le turbo du palier atteint.
6. Annulation sans turbo : frein, vitesse sous `cancelSpeed`, choc fort (`COLLISION.driftBreak`), chute dans l'eau.

L'élan est conservé en virage (`STAT_CURVES.carry*`) : un drift ne fait pas perdre de vitesse. La glisse du corps du kart (`slipAngle`) est visuelle.

## Turbo centralisé

Toutes les sources passent par `applyBoost(kart, id)` (`BOOSTS` : durée, multiplicateur de vitesse, d'accélération, effet). Cumul : le plus fort remplace ; un égal ou plus faible prolonge seulement la durée, plafonnée à `BOOST_MAX_STACK`. Les multiplicateurs ne s'additionnent jamais. Sources actuelles : mini-turbos 1 à 3, départ turbo.

## Chocs

- Kart contre kart : capsules (segment avant-arrière + rayon) ; séparation selon la masse ; rebond et poussée latérale seulement pour la part latérale du choc (un choc par l'arrière égalise les vitesses sans propulser). Au-delà de `bumpSpeed` : secousse (`bump`, braquage réduit), perte de vitesse selon la résistance (`toughness`) et la masse adverse.
- Murs (barrière au bord du terrain) : rebond, perte de vitesse proportionnelle à l'angle d'impact, secousse.

## Statistiques

Véhicule 60 % + archétype 40 %, converties par `STAT_CURVES` (base + écart à 6 x pas). Écarts resserrés (vitesse de pointe +-4 %) : mesuré au pilote automatique, 28 combinaisons sur 2 circuits, écart maximal 5 % (lourd + buggy, compensé par la masse, la résistance et le tout-terrain). `vehicles.js` : `offRoad` facultatif (buggy 0,72).

## Interface

- État du kart (`raceKart.js`) : `hop`, `driftDir`, `driftCharge`, `driftTier`, `boost`, `boostSpeed`, `boostSource`, `bump`, `hits`.
- `render_game_to_text().race.karts[]` : `hop`, `drift { dir, tier, charge }`, `boost { time, source, speed }`, `bump`, `hits`.
- Télémétrie par joueur : `driftTier`, `driftGauge`, `boost` (jauge du HUD).

## Performance

Aucune allocation par frame ; test grossier par distance avant les capsules (32 karts : 496 paires, la plupart rejetées immédiatement).

## Conformité règles d'or

- [x] Aucun dégradé linéaire
- [x] Aucun emoji ; icône lucide `Zap` pour la jauge (porte du sens)
- [x] Tailwind uniquement (style inline justifié : `scaleX` haute fréquence de la jauge)
- [x] Animations : useFrame pour la 3D, amortis, secousse et vibration coupées en mouvement réduit
- [x] Séparation UI / état / 3D respectée (télémétrie et état de course)
- [x] Rien d'une phase suivante (pads, objets, IA qui drift : non implémentés)

## Évolutions prévues

Pads de turbo, rampes, objets : nouvelles entrées dans `BOOSTS`. IA qui drift : phase IA.
