import { create } from 'zustand'

// Partie en réseau local (LAN) : connexion au serveur smkw-api et salon rejoint.
// - status : 'idle' | 'connecting' | 'connected' | 'error' ; address : serveur visé ('' : celui
//   qui a servi la page) ; clientId : identifiant de cette machine sur le serveur ;
// - lanUrl : adresse du serveur sur le réseau local (à donner aux autres joueurs) ;
// - rooms : salons ouverts (liste du serveur) ; room : salon rejoint { code, hostId, phase,
//   members: [{ id, name, players }] } ou null ; error : dernière erreur (clé de texte).
// Écrit par net/lanSession.js.
const INITIAL = { status: 'idle', address: '', lanUrl: null, clientId: null, rooms: [], room: null, error: null }

export const useNetStore = create((set) => ({
  ...INITIAL,
  set: (patch) => set(patch),
  reset: () => set(INITIAL),
}))

export const isRoomHost = (state) => Boolean(state.room && state.room.hostId === state.clientId)
