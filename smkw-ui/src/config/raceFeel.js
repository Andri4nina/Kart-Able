// Mécaniques de course des jeux de kart de salon (référence : le kart arcade sur console de
// salon des années 2000) : aspiration, faux départ, sens interdit, cylindrées. Données seulement :
// le comportement est dans game/race (kartDraft.js, startLights.js, raceControls.js, raceKart.js).

// Aspiration : rouler dans le sillage d'un kart (cône derrière lui) charge une jauge ; pleine,
// elle déclenche un turbo (BOOSTS.draft). Hors du sillage, la jauge redescend vite.
export const DRAFT = Object.freeze({
  range: 13, // m derrière le kart suivi
  minGap: 1.4, // m : trop près, on est au contact, pas dans le sillage
  width: 0.9, // demi-largeur du sillage (m) au contact...
  widthGrow: 0.03, // ... élargie de tant par mètre de distance
  minSpeed: 0.7, // fraction de la vitesse max sous laquelle l'aspiration ne charge pas
  charge: 2, // s dans le sillage (en ligne droite, sans drift) pour déclencher le turbo
  decay: 3, // vitesse de vidange hors du sillage (x le temps)
  cooldown: 4, // s après un turbo d'aspiration avant de pouvoir recharger
})

// Faux départ : appuyer sur l'accélérateur une fois tous les feux allumés, avant leur
// extinction, fait caler le moteur au départ (comme le départ grillé des jeux de référence).
// Un appui maintenu depuis plus tôt ne compte pas ; le turbo récompense le réflexe.
export const FALSE_START = Object.freeze({
  stall: 1, // s sans accélérer après l'extinction
})

// Sens interdit : rouler à contresens assez longtemps affiche l'alerte.
export const WRONG_WAY = Object.freeze({
  minSpeed: 3, // m/s
  facing: -0.35, // produit scalaire (kart, sens du circuit) sous lequel on roule à l'envers
  delay: 0.8, // s avant l'alerte
})

// Cylindrées : multiplicateurs de vitesse de pointe et d'accélération des karts, et niveau des
// pilotes ordinateur (ajouté à leur `skill`). 100 cc = réglages de base.
export const SPEED_CLASSES = Object.freeze({
  50: { speed: 0.84, accel: 0.88, botSkill: -0.07 },
  100: { speed: 1, accel: 1, botSkill: 0 },
  150: { speed: 1.13, accel: 1.1, botSkill: 0.03 },
})
export const SPEED_CLASS_IDS = Object.freeze(Object.keys(SPEED_CLASSES))
export const DEFAULT_SPEED_CLASS = '100'

export function getSpeedClass(id) {
  return SPEED_CLASSES[id] ?? SPEED_CLASSES[DEFAULT_SPEED_CLASS]
}
