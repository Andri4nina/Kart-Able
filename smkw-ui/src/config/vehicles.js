// Véhicules jouables. Données de jeu uniquement (identifiant, statistiques sur 10) :
// le modèle GLB et son orientation sont dans components3d/Vehicles/vehicleAssets.js,
// les noms dans les locales (vehicles.<id>.name).
// Plusieurs joueurs peuvent choisir le même véhicule (pas de règle d'unicité).

export const VEHICLE_COLUMNS = 4

export const VEHICLES = Object.freeze([
  // Polyvalent : la référence.
  { id: 'classic', stats: { topSpeed: 6, acceleration: 6, weight: 5, handling: 6, drift: 6, toughness: 5 } },
  // Léger et nerveux : reprise immédiate, fragile.
  { id: 'sprint', stats: { topSpeed: 5, acceleration: 8, weight: 3, handling: 7, drift: 6, toughness: 3 } },
  // Moteur énorme : pointe très haute, lourd à placer.
  { id: 'hotrod', stats: { topSpeed: 9, acceleration: 4, weight: 6, handling: 3, drift: 7, toughness: 5 } },
  // Tout-terrain massif : encaisse tout, lent à lancer.
  { id: 'buggy', stats: { topSpeed: 5, acceleration: 5, weight: 8, handling: 5, drift: 4, toughness: 8 } },
  // Fusée profilée : vitesse et drift, peu de tenue aux chocs.
  { id: 'comet', stats: { topSpeed: 8, acceleration: 6, weight: 3, handling: 5, drift: 8, toughness: 3 } },
  // Facile à conduire : maniabilité maximale, peu de vitesse.
  { id: 'rookie', stats: { topSpeed: 4, acceleration: 7, weight: 4, handling: 9, drift: 4, toughness: 5 } },
  // Spécialiste de la glisse.
  { id: 'flamingo', stats: { topSpeed: 7, acceleration: 5, weight: 4, handling: 6, drift: 9, toughness: 4 } },
])

export function getVehicle(vehicleId) {
  return VEHICLES.find((vehicle) => vehicle.id === vehicleId) ?? null
}
