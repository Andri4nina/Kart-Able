import { create } from 'zustand'
import { PLAYER_STATUS } from '../config/players'
import { createPlayerSlot, firstFreeIndex } from '../game/playerSlots'

// Joueurs locaux (PlayerSlot[]), triés par index. Les slots inchangés gardent leur
// référence : seuls les composants du joueur modifié se re-rendent.
// Le choix du personnage vit dans characterSelectionStore.
export const useLocalPlayersStore = create((set, get) => ({
  slots: [],

  // Renvoie le slot créé, ou null (appareil déjà en jeu, ou plus de place).
  join: (device, limit) => {
    const { slots } = get()
    if (slots.some((slot) => slot.deviceId === device.id)) return null
    const index = firstFreeIndex(slots, limit)
    if (index === -1) return null
    const slot = createPlayerSlot(index, device)
    set({ slots: [...slots, slot].sort((a, b) => a.index - b.index) })
    return slot
  },

  markReady: (playerId, joinToken) =>
    set((state) => ({
      slots: state.slots.map((slot) =>
        slot.id === playerId && slot.joinToken === joinToken && slot.status === PLAYER_STATUS.JOINING
          ? { ...slot, status: PLAYER_STATUS.READY }
          : slot,
      ),
    })),

  leave: (playerId) => set((state) => ({ slots: state.slots.filter((slot) => slot.id !== playerId) })),

  // Mode avec moins de places (ex. contre-la-montre solo) : on garde les premiers joueurs.
  trimTo: (limit) =>
    set((state) => (state.slots.length > limit ? { slots: state.slots.slice(0, limit) } : state)),

  reset: () => set({ slots: [] }),
}))
