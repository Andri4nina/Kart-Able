import { useShallow } from 'zustand/react/shallow'
import { PLAY_TYPES } from '../../config/gameModes'
import { handleLobbyInput } from '../../game/lobbyReady'
import { getUnreadyPlayerIds } from '../../game/lobbyRules'
import { getGameMode, getPlayerLimit, getStartBlocker } from '../../game/matchRules'
import { getConfirmedId } from '../../game/selection/selectionRules'
import { usePlayerInput } from '../../input/usePlayerInput'
import { useTranslation } from '../../i18n/useTranslation'
import { useCharacterSelectionStore } from '../../stores/characterSelectionStore'
import { useLobbyReadyStore } from '../../stores/lobbyReadyStore'
import { useLocalPlayersStore } from '../../stores/localPlayersStore'
import { useMatchSetupStore } from '../../stores/matchSetupStore'
import { useCourseStore } from '../../stores/courseStore'
import { useVehicleSelectionStore } from '../../stores/vehicleSelectionStore'
import { LobbyFooter } from './LobbyFooter'
import { LobbyPlayers } from './LobbyPlayers'
import { LobbySummary } from './LobbySummary'
import { MenuPage } from './MenuPage'

const ignoreInput = () => false

// Dernière étape : récapitulatif avant départ (mode, circuit, joueurs). En local, chaque joueur
// se déclare prêt (START sur son périphérique ou son bouton) et la course démarre quand tous
// le sont, en écran partagé. En ligne, le départ reste bloqué tant que smkw-api n'existe pas.
export function Lobby() {
  const { t } = useTranslation()
  const setup = useMatchSetupStore(
    useShallow((state) => ({ modeId: state.modeId, playType: state.playType, online: state.online })),
  )
  const slots = useLocalPlayersStore((state) => state.slots)
  const characters = useCharacterSelectionStore((state) => state.selections)
  const vehicles = useVehicleSelectionStore((state) => state.selections)
  const course = useCourseStore(useShallow((state) => ({ cupId: state.cupId, playlist: state.playlist })))
  const ready = useLobbyReadyStore((state) => state.ready)
  const isOnline = setup.playType === PLAY_TYPES.ONLINE
  const limit = getPlayerLimit(getGameMode(setup.modeId), setup.playType)
  const blocker = getStartBlocker(setup, slots, { characters, vehicles, course })
  const unready = getUnreadyPlayerIds(slots.map((slot) => slot.id), ready).length
  usePlayerInput(isOnline ? ignoreInput : handleLobbyInput)

  const isOnlineHost = setup.online.role === 'host'
  const players = isOnline
    ? [{ index: 0, id: 'P1', name: t('lobby.you'), badge: t(isOnlineHost ? 'lobby.host' : 'lobby.guest'), isHost: isOnlineHost }]
    : slots.map((slot) => ({
        index: slot.index,
        id: slot.id,
        name: t('players.player', { number: slot.number }),
        characterId: getConfirmedId(characters, slot.id),
        vehicleId: getConfirmedId(vehicles, slot.id),
        deviceId: slot.deviceId,
      }))
  const freeSlots = Math.max(0, limit - players.length)

  return (
    <MenuPage
      step="lobby"
      title={t('lobby.title')}
      subtitle={t(`modes.${setup.modeId}.name`)}
      footer={<LobbyFooter blocker={blocker} unready={unready} isOnline={isOnline} />}
    >
      <div className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <LobbySummary setup={setup} course={isOnline ? null : course} playerCount={players.length} limit={limit} isOnline={isOnline} />
        <LobbyPlayers players={players} freeSlots={freeSlots} showWaiting={isOnline && freeSlots > 0} />
      </div>
    </MenuPage>
  )
}
