import { create } from 'zustand'

// Chat vocal d'une partie en réseau (écrit par net/voiceChat.js) :
// - status : 'off' | 'connecting' | 'on' | 'error' ; error : clé de texte (voice.errors.*) ;
// - muted : micro coupé (les autres n'entendent plus) ; deafened : son des autres coupé ;
// - peers : { [clientId]: 'connecting' | 'connected' | 'failed' } machines en vocal avec nous.
const INITIAL = { status: 'off', error: null, muted: false, deafened: false, peers: {} }

export const useVoiceStore = create((set) => ({
  ...INITIAL,
  set: (patch) => set(patch),
  setPeer: (id, state) => set((current) => ({ peers: { ...current.peers, [id]: state } })),
  removePeer: (id) =>
    set((current) => {
      const peers = { ...current.peers }
      delete peers[id]
      return { peers }
    }),
  reset: () => set(INITIAL),
}))
