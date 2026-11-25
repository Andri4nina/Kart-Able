import { create } from 'zustand'

// Après une course (écran des résultats), étape de l'enchaînement :
// - step : null (résultats affichés) | 'vote' (choix du circuit suivant) | 'reveal' (circuit élu
//   annoncé, départ imminent) ;
// - options : circuits proposés au vote ; winner : circuit élu ; counts : voix par circuit.
// Écrit par game/raceFlow.js, lu par l'écran de jeu.
const INITIAL = { step: null, options: [], winner: null, counts: {} }

export const useRaceFlowStore = create((set) => ({
  ...INITIAL,
  set: (patch) => set(patch),
  reset: () => set(INITIAL),
}))
