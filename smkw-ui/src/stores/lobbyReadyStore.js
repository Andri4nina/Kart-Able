import { create } from 'zustand'

// Lobby local : qui s'est déclaré prêt ({ [playerId]: true }). Remis à zéro à chaque entrée
// dans le lobby (game/lobbyReady.js) ; la course part quand tous les joueurs sont prêts.
export const useLobbyReadyStore = create((set) => ({
  ready: {},
  begin: () => set({ ready: {} }),
  setReady: (playerId, value) =>
    set((state) => (Boolean(state.ready[playerId]) === value ? state : { ready: { ...state.ready, [playerId]: value } })),
}))
