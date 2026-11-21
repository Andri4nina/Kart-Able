import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_BINDINGS } from '../input/bindingDefaults'
import { assignBinding, clearBinding, normalizeBindings, resetProfile } from '../input/bindingRules'

// Assignation des touches (persistée, comme les réglages). Les règles vivent dans
// input/bindingRules.js ; chaque action renvoie le résultat (refus, échange...) pour l'UI.
export const useBindingsStore = create(
  persist(
    (set, get) => {
      const apply = ({ bindings, result }) => {
        if (bindings !== get().bindings) set({ bindings })
        return result
      }
      return {
        bindings: normalizeBindings(DEFAULT_BINDINGS),
        assign: (profileId, action, slot, input) => apply(assignBinding(get().bindings, profileId, action, slot, input)),
        clear: (profileId, action, slot) => apply(clearBinding(get().bindings, profileId, action, slot)),
        reset: (profileId) => set((state) => ({ bindings: resetProfile(state.bindings, profileId) })),
      }
    },
    {
      name: 'smkw-bindings',
      version: 1,
      partialize: ({ bindings }) => ({ bindings }),
      merge: (persisted, current) => ({ ...current, bindings: normalizeBindings(persisted?.bindings) }),
    },
  ),
)
