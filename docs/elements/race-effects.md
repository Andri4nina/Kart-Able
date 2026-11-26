# Effets de course : particules, flamme de turbo

- **Type** : objet 3D
- **Fichiers** : `smkw-ui/src/components3d/Effects/` (RaceParticles, effectResources, particlePool, writeParticles, kartEmitters, emitterKit, boxEmitters, exhaustEmitters, trailEmitters, trailPool), `smkw-ui/src/components3d/Racers/KartEffects.jsx`, `kartFlame.js`
- **Phase** : 2C

## Rôle

Retours visuels de conduite lisibles d'un coup d'œil, purement visuels (rien ne modifie la course) :
- drift : fumée de pneus, étincelles aux roues arrière dès le palier bleu puis orange, lueur aux roues, gerbe au déclenchement du mini-turbo ;
- turbo (nitro, pads, mini-turbos, départ) : deux réacteurs à l'arrière, façon voiture-fusée (trois cônes additifs emboîtés : cœur blanc, flamme vive, enveloppe ; longs et vacillants), onde de choc à l'allumage, braises éjectées et traînée de fumée ;
- hors-piste : mottes de terre et d'herbe aux couleurs du thème ;
- chute dans l'eau : grande gerbe ; choc : éclats ; case à objets prise : éclats à sa couleur.

Ajouts 2E :
- **Fumée d'échappement** de chaque kart (`exhaustEmitters.js`) : bouffées grises continues aux deux pots, plus denses à l'accélération, bouffée sombre quand on remet les gaz ; rien pendant un turbo ni dans l'eau.
- **Traînées du drift** (`trailEmitters.js`, `trailPool.js`) : marques de gomme des deux roues arrière sur l'asphalte (s'amincissent en 3 s), et traînée lumineuse à la couleur du palier (bleu, orange, violet) derrière chaque roue. Rubans continus, un segment tous les 0,55 m.
- Troisième palier violet (étincelles, lueur, flamme du turbo).

## Interface

`<RaceParticles trackId />` (DemoScene, avec le circuit). `KartEffects` dans chaque `RacerKart`. Lit l'état des karts (`driftDir`, `driftTier`, `boost`, `boostSource`, `offRoad`, `sinking`, `hits`) et des cases ; les événements (fin de drift avec turbo, chute, choc, case prise) sont détectés par comparaison avec l'état précédent gardé dans le composant.

## Dépendances

Monde de course (`getRace`, `getRaceKart`), `BOOSTS[*].effect` (couleur de la flamme : `nitro`, `orange`, `blue`), `PALETTE`, thème du circuit. Aucune dépendance npm.

## Performance

Trois InstancedMesh pour toutes les particules (2048 lueurs, 1024 fumées, 1024 mottes) : 3 appels de rendu. Réserves circulaires en tableaux typés, aucune allocation par frame ; une particule éteinte n'est réécrite qu'une fois. Débits plafonnés ; en mouvement réduit, 40 % des particules. Flamme : 6 petits cônes par kart, cachés hors turbo. Mesuré dans le panneau navigateur de l'app : même ordre de cadence qu'avant ces effets (le GPU du panneau limite).

## Conformité règles d'or

- [x] Aucun dégradé linéaire (couleurs pleines, mélange additif en 3D)
- [x] Aucun emoji
- [x] Sans objet (pas d'UI)
- [x] Animations par useFrame (3D) ; mouvement réduit : moins de particules, ni vacillement ni onde de choc
- [x] Séparation UI / état / 3D : lecture seule du monde de course
- [x] Design original (aucune ressource reprise d'un jeu existant)

## Évolutions prévues

Audio associé (phase audio), traînées de vitesse au-delà d'un seuil.
