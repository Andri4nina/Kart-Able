import { create } from 'zustand'
import { SCREENS } from '../navigation/screens'

const involvesGame = (from, to) => from === SCREENS.GAME || to === SCREENS.GAME

// Navigation par pile : navigate() empile, back() dépile, resetTo() repart d'un écran.
// `direction` (+1 avant, -1 arrière) oriente les transitions ; `wipeId` déclenche
// le balayage plein écran quand on entre en jeu ou qu'on en sort.
export const useNavigationStore = create((set, get) => ({
  stack: [SCREENS.MAIN_MENU],
  direction: 1,
  wipeId: 0,
  settingsOpen: false,

  navigate: (screenId) => {
    const current = selectCurrentScreen(get())
    if (screenId === current) return
    set((state) => ({
      stack: [...state.stack, screenId],
      direction: 1,
      settingsOpen: false,
      wipeId: involvesGame(current, screenId) ? state.wipeId + 1 : state.wipeId,
    }))
  },

  back: () => {
    const { stack } = get()
    if (stack.length <= 1) return
    const current = stack[stack.length - 1]
    const previous = stack[stack.length - 2]
    set((state) => ({
      stack: stack.slice(0, -1),
      direction: -1,
      wipeId: involvesGame(current, previous) ? state.wipeId + 1 : state.wipeId,
    }))
  },

  resetTo: (screenId) => {
    const current = selectCurrentScreen(get())
    set((state) => ({
      stack: [screenId],
      direction: -1,
      settingsOpen: false,
      wipeId: involvesGame(current, screenId) ? state.wipeId + 1 : state.wipeId,
    }))
  },

  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
}))

export function selectCurrentScreen(state) {
  return state.stack[state.stack.length - 1]
}
