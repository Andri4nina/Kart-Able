# Phase 2C : drift classique, effets, cases à suspense, circuits exigeants

## Demande

Drift sur le modèle des jeux de kart de génération Wii, plus joli ; nitro au design de voiture-fusée ; herbe écrasée hors-piste et possibilité de tomber à l'eau ; nouveau design des cases à objets et tirage à suspense ; circuits avec du vrai défi.

## Fait

- **Drift** : sens choisi pendant le saut (ou 0,12 s après), simple saut sinon ; deux paliers (bleu, orange) ; charge plus rapide en braquant dedans ; glisse du corps selon le braquage, roulis, écrasement à l'atterrissage, fumée, étincelles, gerbe au turbo. [elements/kart-driving.md](../elements/kart-driving.md)
- **Turbo** : deux réacteurs à flamme à trois couches, onde de choc, braises et fumée ; nitro plus longue (1,5 s). [elements/race-effects.md](../elements/race-effects.md)
- **Hors-piste et eau** : herbe couchée par les roues, mottes de terre ; barrière ouverte vers l'eau au bord de certains virages. [elements/track-features.md](../elements/track-features.md)
- **Cases à objets** : cristal à facettes, anneau, halo ; cases dorées au hasard (12 %) ; roulette de durée aléatoire qui ralentit, révélation animée. [elements/items.md](../elements/items.md)
- **Circuits** : 8 tracés retouchés (épingles, chicanes, sections étroites, eau au bord), pads d'accélération et rochers ; bots qui contournent les rochers et prennent les pads.

## Vérifié

- `npm run check`, `npm run build` : OK.
- Drift en jeu (clavier simulé) : saut sans direction = pas de drift ; drift du bon côté ; charge stoppée hors-piste ; palier bleu puis mini-turbo au relâchement.
- Simulation de courses complètes à 32 karts sur les 8 circuits (pilote automatique pour le joueur) : toutes terminent, blocage maximal 3,5 s, pads utilisés, aucun bot à l'eau ; tours de 31 à 44 s.
- Captures : flamme de nitro et onde de choc, braises, cases en cristal et dorées, pads, rochers, roulette du HUD.

## Limites connues

- Les bots ne driftent toujours pas.
- Cadence dans le panneau navigateur de l'app limitée par son GPU (comparable à avant la phase).
- Étincelles de drift vérifiées par l'état du jeu, peu capturées à l'écran (tests en temps réel difficiles dans le panneau).
