import { attachDriveControls, pollDriveControls, readDriveControls } from '../../input/driveControls'
import { useInputDevicesStore } from '../../stores/inputDevicesStore'
import { useRaceStore } from '../../stores/raceStore'
import { useSessionStore } from '../../stores/sessionStore'
import { useTelemetryStore } from '../../stores/telemetryStore'
import { tickNetRace } from '../../net/netRace'
import { publishRace } from './racePublish'
import { createRaceWorld, stepRaceWorld } from './raceWorld'

// Course en cours (une seule à la fois) : créée au lancement d'une partie sur circuit,
// avancée par la boucle de jeu (components3d/Systems/RaceSystem), lue par la scène 3D
// (karts, caméras) et publiée vers l'interface (racePublish.js).
let world = null
let detachControls = null

const readPlayerControls = (kart, out) => readDriveControls(kart.device, out)

export function startRace(match) {
  stopRace()
  useTelemetryStore.getState().reset(match?.players.map((player) => player.id))
  if (!match?.trackId) return null
  const devices = useInputDevicesStore.getState().devices
  // Réseau local : même graine sur toutes les machines (feux, cases à objets).
  const seed = match.net ? match.seed : Math.floor(Math.random() * 2 ** 31)
  world = createRaceWorld(match, seed, (racer) => devices[racer.deviceId] ?? null)
  detachControls = attachDriveControls()
  publishRace(world)
  return world
}

export function stopRace() {
  detachControls?.()
  detachControls = null
  world = null
  useRaceStore.getState().reset()
}

// « Rejouer » : même partie (mêmes pilotes), nouveau départ.
export function restartRace() {
  return startRace(useSessionStore.getState().match)
}

export function getRace() {
  return world
}

export function getRaceKart(racerId) {
  return world?.kartsById.get(racerId) ?? null
}

// Une frame de jeu. Sans circuit (modes d'arène), seul le chrono de démonstration avance.
export function stepRace(delta) {
  if (!world) {
    const telemetry = useTelemetryStore.getState()
    telemetry.publish(telemetry.raceTime + delta)
    return
  }
  pollDriveControls()
  stepRaceWorld(world, delta, readPlayerControls)
  tickNetRace(world, delta)
  publishRace(world)
}

// Tests : un pilote automatique conduit le kart d'un joueur (bot driver).
export function setAutopilot(racerId, enabled) {
  const kart = getRaceKart(racerId)
  if (kart) kart.autopilot = Boolean(enabled)
  return Boolean(kart)
}
