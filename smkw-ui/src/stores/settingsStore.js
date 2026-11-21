import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FOV, MOTION_MODES, QUALITY_PRESETS } from '../config/gameConfig'

// Réglages joueur, persistés en localStorage (confort local uniquement).
// Si le stockage est indisponible, zustand continue sans persistance.
export const useSettingsStore = create(
  persist(
    (set) => ({
      quality: 'medium',
      motion: 'system',
      fov: FOV.default,

      setQuality: (quality) => {
        if (quality in QUALITY_PRESETS) set({ quality })
      },
      setMotion: (motion) => {
        if (MOTION_MODES.includes(motion)) set({ motion })
      },
      setFov: (fov) => set({ fov: Math.min(FOV.max, Math.max(FOV.min, Math.round(fov))) }),
    }),
    {
      name: 'smkw-settings',
      version: 1,
      partialize: ({ quality, motion, fov }) => ({ quality, motion, fov }),
    },
  ),
)
