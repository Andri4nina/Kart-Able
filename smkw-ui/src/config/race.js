// Réglages de course : départ, peloton, réapparition, affichage. Aucune logique ici
// (la physique est dans game/race/kartStats.js et kartPhysics.js).

export const RACE = Object.freeze({
  // Mode course : le peloton est complété par des pilotes ordinateur jusqu'à `fieldSize`
  // (joueurs compris) : 32 karts, la taille de la grille des circuits.
  fieldSize: 32,
  // Physique en pas fixes (déterministe, indépendante de la fréquence d'affichage).
  step: 1 / 120,
  // Les karts ne s'éloignent pas de plus de `fence` mètres du bord de la route (barrière
  // invisible) : les portes de checkpoint (débord de 12 m) les couvrent toujours.
  fence: 10,
  // Chute dans l'eau : durée avant de réapparaître sur la route.
  respawnDelay: 1.2,
  // Après l'arrivée du dernier joueur, délai avant l'écran des résultats.
  resultsDelay: 2.5,
  // Les résultats n'acceptent une commande qu'après ce délai (évite un appui involontaire).
  resultsInputDelay: 1.2,
  // Échelle du compteur (km/h pour une barre pleine).
  speedometerMax: 140,
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
