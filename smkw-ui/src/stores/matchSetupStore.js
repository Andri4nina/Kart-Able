import { create } from 'zustand'
import { GAME_MODES, PLAY_TYPES } from '../config/gameModes'
import { getGameMode, getPlayerLimit, isPlayTypeAvailable, isValidRoomCode } from '../game/matchRules'
import { useLocalPlayersStore } from './localPlayersStore'

// Choix faits dans le menu (mode, type, session en ligne). Les joueurs locaux vivent
// dans localPlayersStore. Les règles sont dans game/matchRules.js.
export const useMatchSetupStore = create((set, get) => ({
  modeId: GAME_MODES[0].id,
  playType: null,
  online: { role: null, code: '' },

  selectMode: (modeId) => {
    const mode = getGameMode(modeId)
    if (!mode) return
    // Moins de places dans le nouveau mode : on garde les premiers joueurs.
    useLocalPlayersStore.getState().trimTo(Math.max(1, getPlayerLimit(mode, PLAY_TYPES.LOCAL)))
    set((state) => ({
      modeId,
      playType: state.playType && isPlayTypeAvailable(mode, state.playType) ? state.playType : null,
    }))
  },

  selectPlayType: (playType) => {
    if (!isPlayTypeAvailable(getGameMode(get().modeId), playType)) return
    set({ playType })
  },

  hostOnlineMatch: () => set({ online: { role: 'host', code: '' } }),

  joinOnlineMatch: (code) => {
    if (!isValidRoomCode(code)) return false
    set({ online: { role: 'guest', code } })
    return true
  },
}))
