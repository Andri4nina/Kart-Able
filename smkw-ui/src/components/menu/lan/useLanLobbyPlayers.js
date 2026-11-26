import { useNetStore } from '../../../stores/netStore'
import { useLocalPlayersStore } from '../../../stores/localPlayersStore'
import { getRoomPlayers } from '../../../net/netMatch'

// Joueurs du salon réseau pour le lobby : toutes les machines, dans l'ordre (hôte d'abord).
// Ceux de cette machine gardent leur identifiant local et leur périphérique (bouton « Prêt »).
export function useLanLobbyPlayers(t) {
  const room = useNetStore((state) => state.room)
  const clientId = useNetStore((state) => state.clientId)
  const slots = useLocalPlayersStore((state) => state.slots)
  return getRoomPlayers(room).map((player, index) => {
    const mine = player.member.id === clientId
    const slot = mine ? slots.find((entry) => entry.id === player.localId) : null
    return {
      index,
      id: mine ? player.localId : `P${index + 1}`,
      name: player.member.name,
      characterId: player.characterId,
      vehicleId: player.vehicleId,
      deviceId: slot?.deviceId,
      isHost: player.member.id === room.hostId,
      badge: slot ? null : player.ready ? t('lobby.ready') : t('lan.lobby.notReady'),
    }
  })
}
