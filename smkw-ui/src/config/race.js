// Réglages de course : départ, peloton, réapparition, affichage. Aucune logique ici
// (la physique est dans game/race/kartStats.js et kartPhysics.js).

export const RACE = Object.freeze({
  // Mode course : le peloton est complété par des pilotes ordinateur jusqu'à `fieldSize`
  // (joueurs compris) : 32 karts, la taille de la grille des circuits.
  fieldSize: 32,
  // Physique en pas fixes (déterministe, indépendante de la fréquence d'affichage).
  step: 1 / 120,
  // Hors-piste : les karts ne s'éloignent pas de plus de `fence` mètres du bord de la route
  // (clôture basse) : les portes de checkpoint (débord de 18 m, trackLayout.js) les couvrent.
  fence: 12,
  // Bord de lac à moins de `reach` m de la route : la clôture s'ouvre jusqu'à `into` m dans
  // l'eau (on peut y tomber). reach + into <= débord des portes de checkpoint.
  waterFence: { reach: 11, into: 4 },
  // Anti-raccourci : là où une autre portion de route (à plus de `separation` m sur le tour)
  // passe à moins de `gap` m du bord, un muret est posé à `fence` m du bord, de ce côté.
  shortcut: { gap: 34, separation: 70, fence: 1.6 },
  // Chute dans l'eau : durée avant de réapparaître sur la route.
  respawnDelay: 1.2,
  // Après l'arrivée du dernier joueur, délai avant l'écran des résultats.
  resultsDelay: 2.5,
  // Les résultats n'acceptent une commande qu'après ce délai (évite un appui involontaire).
  resultsInputDelay: 1.2,
  // Échelle du compteur (km/h pour une barre pleine).
  speedometerMax: 140,
})

// Points par place à chaque course (1er, 2e, ...) ; au-delà, 0. Ils s'additionnent d'une course
// à l'autre pendant toute la partie (programme, courses votées, changements de circuit compris),
// jusqu'au retour au menu.
export const RACE_POINTS = Object.freeze([15, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1])

// Programme choisi à l'écran des circuits : de 1 à `maxRaces` courses.
export const COURSE = Object.freeze({ maxRaces: 8 })

// Après une course : vote des joueurs pour le circuit suivant (parmi les autres circuits).
export const TRACK_VOTE = Object.freeze({
  revealMs: 2200, // affichage du circuit élu avant le départ
})

// Feux de départ façon Formule 1 : cinq feux rouges s'allument un par un, puis s'éteignent
// tous ensemble après un délai aléatoire : c'est le départ.
export const START_LIGHTS = Object.freeze({
  count: 5,
  firstAt: 1.5, // s après l'arrivée sur la grille
  interval: 1, // s entre deux feux
  holdMin: 0.6, // délai aléatoire, feux tous allumés, avant l'extinction
  holdMax: 2,
  goShown: 1.2, // durée de l'affichage « Partez ! »
  // Réaction : accélérer dans cet intervalle après l'extinction donne un départ turbo.
  perfectWindow: 0.35, // turbo obtenu : BOOSTS.start (config/kartTuning.js)
})
