import { getTrackGeometry } from './track/trackGeometry'
import { getStartSlot } from './track/trackLayout'
import { useCharacterSelectionStore } from '../stores/characterSelectionStore'
import { useLobbyReadyStore } from '../stores/lobbyReadyStore'
import { useLocalPlayersStore } from '../stores/localPlayersStore'
import { useVehicleSelectionStore } from '../stores/vehicleSelectionStore'

// Morceaux du payload de render_game_to_text (voir textState.js).

export const round = (value, digits = 2) => Number(value.toFixed(digits))

export function collectProps(scene) {
  const props = []
  scene.traverse((object) => {
    const kind = object.userData?.kind
    if (kind === 'cone' || kind === 'tireStack') {
      props.push({ kind, x: round(object.position.x, 1), z: round(object.position.z, 1) })
    }
  })
  return props
}

// Boutons visibles de l'UI (id + état), pour savoir quoi cliquer sans image.
export function collectButtons() {
  return [...document.querySelectorAll('button[id]')]
    .filter((button) => button.offsetParent !== null)
    .map((button) => (button.disabled ? `#${button.id} (disabled)` : `#${button.id}`))
}

const summarizeSelection = (selection) =>
  selection ? { status: selection.status, preselectedId: selection.preselectedId, confirmedId: selection.confirmedId } : null

// Joueurs locaux : périphérique, entrée, personnage, véhicule, prêt au lobby.
export function summarizeLocalPlayers() {
  const characters = useCharacterSelectionStore.getState().selections
  const vehicles = useVehicleSelectionStore.getState().selections
  const ready = useLobbyReadyStore.getState().ready
  return useLocalPlayersStore.getState().slots.map(({ id, deviceId, status }) => ({
    id,
    deviceId,
    status,
    selection: summarizeSelection(characters[id]),
    vehicle: summarizeSelection(vehicles[id]),
    ready: Boolean(ready[id]),
  }))
}

// Circuit de la partie : longueur, portes de checkpoint, ligne de départ, pole position.
export function describeTrack(match) {
  const geometry = match?.trackId ? getTrackGeometry(match.trackId) : null
  if (!geometry) return null
  const { path, gates } = geometry
  const pole = getStartSlot(path, 0)
  return {
    id: match.trackId,
    laps: match.laps,
    lengthMeters: Math.round(path.length),
    checkpoints: gates.length,
    startLine: [round(gates[0].x, 1), round(gates[0].z, 1)],
    pole: [round(pole.x, 1), round(pole.z, 1), round(pole.yaw, 2)],
  }
}
