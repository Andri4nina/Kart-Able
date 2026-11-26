import { getRace } from '../game/race/raceSession'
import { exitMatch } from '../game/session'
import { useNetStore } from '../stores/netStore'
import { useSessionStore } from '../stores/sessionStore'
import { onRelay } from './lanSession'
import { launchNetMatch } from './netMatch'
import { applyKartStates } from './netRace'

// Messages de jeu reçus des autres machines du salon (une seule installation, au démarrage) :
// - start : partie décidée par l'hôte (première course, course suivante, vote, changement) ;
// - karts : état des karts des autres machines ;
// - closed : l'hôte est parti, la partie s'arrête.
let installed = false

export function installNetBridge() {
  if (installed) return
  installed = true
  onRelay((data, from) => {
    if (!data || typeof data !== 'object') return
    if (data.kind === 'karts') return applyKartStates(getRace(), data.k)
    if (data.kind === 'start' && from === useNetStore.getState().room?.hostId && data.match) return launchNetMatch(data.match)
    if (data.kind === 'closed' && useSessionStore.getState().match?.net) exitMatch()
  })
}
