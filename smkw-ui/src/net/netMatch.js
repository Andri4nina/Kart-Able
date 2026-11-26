import { buildMatchConfig } from '../game/matchConfig'
import { getGameMode } from '../game/matchRules'
import { buildRaceBots } from '../game/race/raceRoster'
import { startRace } from '../game/race/raceSession'
import { resetRaceFlow } from '../game/raceFlow'
import { getCurrentPicks } from '../game/session'
import { SCREENS } from '../navigation/screens'
import { useLocalPlayersStore } from '../stores/localPlayersStore'
import { useMatchSetupStore } from '../stores/matchSetupStore'
import { selectCurrentScreen, useNavigationStore } from '../stores/navigationStore'
import { useNetStore } from '../stores/netStore'
import { usePauseStore } from '../stores/pauseStore'
import { useSessionStore } from '../stores/sessionStore'
import { sendRelay, setRoomPhase } from './lanSession'

// Partie en réseau local : la machine hôte compose la partie (joueurs de toutes les machines,
// numérotés P1..Pn, pilotes ordinateur, programme des circuits) et l'envoie aux autres
// (`start`) ; chaque machine la « localise » : ses joueurs (avec leurs périphériques) dans
// `players`, ceux des autres machines dans `remotes`. `net` : { hostId, clientId, host }.
// Les courses suivantes (programme, vote, changement de circuit) sont aussi décidées par l'hôte.
const READY = (player) => player.ready && player.characterId && player.vehicleId

export function getRoomPlayers(room) {
  return (room?.members ?? []).flatMap((member) => (Array.isArray(member.players) ? member.players.map((player) => ({ ...player, member })) : []))
}

export function isRoomReady(room) {
  const players = getRoomPlayers(room)
  return players.length > 0 && players.every(READY)
}

function deviceFree(player) {
  const { deviceId: _deviceId, deviceKind: _deviceKind, ...rest } = player
  return rest
}

export function localizeMatch(base) {
  const { clientId } = useNetStore.getState()
  const slots = useLocalPlayersStore.getState().slots
  const mine = base.players.filter((player) => player.clientId === clientId)
  const players = mine.map((player) => {
    const slot = slots.find((entry) => entry.id === player.localId)
    return { ...player, deviceId: slot?.deviceId ?? null, deviceKind: slot?.deviceKind ?? null }
  })
  const remotes = base.players.filter((player) => player.clientId !== clientId)
  return Object.freeze({ ...base, players, remotes, net: { hostId: base.net.hostId, clientId, host: clientId === base.net.hostId } })
}

// Partie localisée -> partie commune (pour l'envoyer aux autres machines).
function toBase(match) {
  const players = [...match.players, ...(match.remotes ?? [])].sort((a, b) => a.index - b.index).map(deviceFree)
  return { ...match, players, remotes: [], net: { hostId: match.net.hostId } }
}

export function shareMatch(match) {
  if (match?.net?.host) sendRelay({ kind: 'start', match: toBase(match) })
}

export function launchNetMatch(base) {
  const match = localizeMatch(base)
  resetRaceFlow()
  usePauseStore.getState().reset()
  useSessionStore.getState().begin(match)
  startRace(match)
  const navigation = useNavigationStore.getState()
  if (selectCurrentScreen(navigation) !== SCREENS.GAME) navigation.navigate(SCREENS.GAME)
  return match
}

// Hôte : lance la partie pour tout le salon (tous les joueurs prêts).
export function startNetMatch() {
  const { room, clientId } = useNetStore.getState()
  if (!room || room.hostId !== clientId || !isRoomReady(room)) return false
  const seed = Math.floor(Math.random() * 2 ** 31)
  const setup = useMatchSetupStore.getState()
  const local = buildMatchConfig(setup, useLocalPlayersStore.getState().slots, getCurrentPicks(), seed)
  const players = getRoomPlayers(room).map((player, index) => ({
    id: `P${index + 1}`,
    index,
    clientId: player.member.id,
    localId: player.localId,
    name: player.member.name,
    characterId: player.characterId,
    vehicleId: player.vehicleId,
  }))
  const base = { ...local, players, bots: local.trackId ? buildRaceBots(getGameMode(local.modeId), players, seed) : [], remotes: [], net: { hostId: clientId } }
  sendRelay({ kind: 'start', match: base })
  setRoomPhase('racing')
  launchNetMatch(base)
  return true
}
