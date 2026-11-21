import { create } from 'zustand'

// Valeurs haute fréquence écrites par la boucle de jeu et lues par le HUD via des
// abonnements transitoires (useTelemetryListener) : aucun re-render React par frame.
// `players` : par joueur local { speed (km/h), time (s, figé à l'arrivée) }. Ces objets sont
// créés au départ puis modifiés en place (aucune allocation par frame) ; publish() prévient
// les abonnés à chaque frame.
export const useTelemetryStore = create((set) => ({
  raceTime: 0,
  players: {},
  publish: (raceTime) => set({ raceTime }),
  reset: (playerIds = []) =>
    set({ raceTime: 0, players: Object.fromEntries(playerIds.map((id) => [id, { speed: 0, time: 0 }])) }),
}))
