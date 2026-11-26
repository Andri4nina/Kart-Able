import { create } from 'zustand'

// Menu pause de la course (game/pauseMenu.js) : ouvert ou non, vue affichée ('menu', 'cups'
// puis 'tracks' pour changer de circuit), élément en surbrillance, coupe parcourue. La course
// est figée tant qu'il est ouvert (components3d/Systems/RaceSystem).
const INITIAL = { open: false, view: 'menu', index: 0, cupId: null }

export const usePauseStore = create((set) => ({
  ...INITIAL,
  set: (patch) => set(patch),
  reset: () => set(INITIAL),
}))
