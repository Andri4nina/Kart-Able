import { create } from 'zustand'

// Partie en cours : configuration figée produite par game/session.js.
// Point de lecture des futurs systèmes de jeu (course, bataille, réseau...).
export const useSessionStore = create((set) => ({
  match: null,
  begin: (match) => set({ match }),
  end: () => set({ match: null }),
}))
