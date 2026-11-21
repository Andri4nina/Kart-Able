import { create } from 'zustand'

// Portraits des personnages (images PNG en data URL), rendus une fois par la scène 3D
// (components3d/Characters/PortraitStudio) et affichés par l'UI (avatars, roster).
export const usePortraitStore = create((set) => ({
  portraits: {},
  setPortrait: (characterId, url) =>
    set((state) => (state.portraits[characterId] === url ? state : { portraits: { ...state.portraits, [characterId]: url } })),
}))
