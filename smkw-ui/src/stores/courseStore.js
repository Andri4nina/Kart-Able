import { create } from 'zustand'
import { getCup } from '../config/cups'
import { COURSE } from '../config/race'

// Programme des courses composé à l'écran des circuits (P1 choisit pour tout le monde) :
// - step : 'cups' (choix de la coupe) | 'tracks' (circuits de la coupe ouverte) ;
// - cupId : coupe ouverte ; playlist : circuits choisis, dans l'ordre (de toutes les coupes,
//   COURSE.maxRaces au plus). Vide : toute la coupe ouverte sera courue.
// Gardé en revenant du lobby (on retrouve son programme).
const INITIAL = { step: 'cups', cupId: null, playlist: [] }

const without = (list, ids) => list.filter((id) => !ids.includes(id))

export const useCourseStore = create((set) => ({
  ...INITIAL,
  begin: () => set((state) => ({ step: state.cupId ? 'tracks' : 'cups' })),
  openCup: (cupId) => set({ step: 'tracks', cupId }),
  backToCups: () => set({ step: 'cups' }),
  toggleTrack: (trackId) =>
    set((state) => {
      if (state.playlist.includes(trackId)) return { playlist: without(state.playlist, [trackId]) }
      return state.playlist.length < COURSE.maxRaces ? { playlist: [...state.playlist, trackId] } : state
    }),
  // Toute la coupe : ajoute ses circuits manquants, ou les retire tous s'ils y sont déjà.
  toggleCup: (cupId) =>
    set((state) => {
      const ids = getCup(cupId)?.trackIds ?? []
      if (ids.every((id) => state.playlist.includes(id))) return { playlist: without(state.playlist, ids) }
      return { playlist: [...state.playlist, ...without(ids, state.playlist)].slice(0, COURSE.maxRaces) }
    }),
  reset: () => set(INITIAL),
}))
