# Conduite du kart : drift, turbo, chocs

- **Type** : système
- **Fichiers** : `smkw-ui/src/config/kartTuning.js`, `smkw-ui/src/game/race/kartPhysics.js`, `kartDrift.js`, `kartDriftRates.js`, `kartBoost.js`, `kartCollisions.js`, `kartCapsule.js`, `kartStats.js`, `trackTracking.js` (murs), `smkw-ui/src/components3d/Racers/kartPose.js`, `KartEffects.jsx`, `smkw-ui/src/components/ui/hud/DriftGauge.jsx`
- **Phase** : 2A (conduite, drift, chocs), drift revu en 2C puis en 2E

## Rôle

Conduite arcade en calcul pur (pas fixe 1/120 s, aucune allocation), réglée entièrement depuis `config/kartTuning.js`. Le contrôleur ne contient aucune valeur de gameplay.

## Drift manuel (jeux de kart arcade de référence)

1. Appui sur Drift en roulant : petit saut (`DRIFT.hopTime` 0,22 s). En l'air, braquage réduit.
2. Tant que Drift reste enfoncé, le drift part dans le **premier sens braqué** au-delà de `steerThreshold` : pendant le saut, ou plus tard au sol (2E : plus besoin de braquer pendant le saut). Il ne change plus ensuite. Relâcher sans avoir braqué : simple saut.
3. Entrée : poussée vers l'extérieur (`entryKick`). Le kart tourne toujours vers l'intérieur : serré en braquant dedans (`turnInside` 1,95), neutre déjà plus serré que le braquage normal (`turnNeutral` 1,25), large dehors (`turnOutside` 0,32 : rayon d'environ 45 m à pleine vitesse, pour les grandes courbes) ; jamais droit.
4. Jauge : `charge += dt * stat drift * qualité`, qualité = braquage intérieur (x1,5) .. neutre (x1) .. extérieur (x0,45), multipliée par la vitesse ; hors-piste : aucune charge (sauf aéroglisseur). Taux : `kartDriftRates.js`.
5. Charge façon Wii (phase 3C) : un minuteur, 1 unité par seconde, x2,5 en braquant franchement vers l'intérieur (au-delà de 0,3). Deux paliers comme la référence : 2,27 -> `miniTurbo1` (étincelles bleues, ~0,9 s braqué dedans, ~2,3 s sinon), 4,79 -> `miniTurbo2` (orange, super mini-turbo, même poussée mais trois fois plus long : 2,4 s). Relâcher Drift déclenche le turbo du palier atteint. Les pilotes ordinateur chargent toujours au rythme « braqué dedans ». Traînées au sol et lumineuses : [race-effects.md](race-effects.md).
7. En l'air après un tremplin, l'appui sur Drift fait une figure (pas un saut) : [jumps-gliders.md](jumps-gliders.md).
6. Annulation sans turbo : frein, vitesse sous `cancelSpeed`, choc fort (`COLLISION.driftBreak`, rocher), chute dans l'eau.

Bots (`game/race/botDrift.js`, mêmes règles que les joueurs) : drift lancé quand la route tourne d'au moins 0,5 rad devant et que le pilote braque déjà vers l'intérieur ; sens donné pendant le saut ; relâché à la sortie du virage avec au moins le palier bleu (les meilleurs visent l'orange), ou en survirage, hors-piste prolongé, virage inverse. Simulé sur 8 circuits à 32 karts : 110 à 300 mini-turbos par course, aucun blocage durable.

Rendu (kartPose.js, KartEffects.jsx, Effects/) : glisse du corps plus profonde en braquant dedans (`slipInside`) et moindre dehors (`slipOutside`), roulis vers l'extérieur, pilote penché, trépidation des pneus, écrasement des ressorts à l'atterrissage du saut ; fumée de pneus, étincelles aux roues arrière (bleues puis orange), lueur aux roues, gerbe au déclenchement du turbo. Flamme de turbo : deux réacteurs à trois couches additives et onde de choc à l'allumage, braises et traînée de fumée (voir race-effects.md).

L'élan est conservé en virage (`STAT_CURVES.carry*`) : un drift ne fait pas perdre de vitesse. La glisse du corps du kart (`slipAngle`) est visuelle.

## Turbo centralisé

Toutes les sources passent par `applyBoost(kart, id)` (`BOOSTS` : durée, multiplicateur de vitesse, d'accélération, effet). Cumul : le plus fort remplace ; un égal ou plus faible prolonge seulement la durée, plafonnée à `BOOST_MAX_STACK`. Les multiplicateurs ne s'additionnent jamais. Sources actuelles : mini-turbos 1 et 2, départ turbo, nitro (objet), pads d'accélération (`pad`).

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
