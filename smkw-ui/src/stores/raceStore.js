import { create } from 'zustand'

// État de course à basse fréquence pour l'interface : publié par game/race/racePublish.js
// seulement quand une valeur change (jamais un re-render par frame).
// - phase : null hors course, puis 'countdown' | 'racing' | 'results' ;
// - countdown : chiffre du compte à rebours (3, 2, 1 ; 0 sinon) ; go : « Partez ! » affiché ;
// - standings : par joueur local { position, lap, finished, item, charges, rolling, shield } ;
//   total : karts en course ;
// - results : classement final (écran des résultats), null avant.
const INITIAL = { phase: null, countdown: 0, go: false, total: 0, standings: {}, results: null }

export const useRaceStore = create((set) => ({
  ...INITIAL,
  publish: (patch) => set(patch),
  reset: () => set(INITIAL),
}))
