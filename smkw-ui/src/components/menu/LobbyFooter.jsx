import { CircleCheck, Lock, Play } from 'lucide-react'
import { startLanMatch } from '../../game/lobbyReady'
import { useTranslation } from '../../i18n/useTranslation'
import { Button } from '../ui/Button'

const BLOCKER_KEYS = {
  serverRequired: 'lan.lobby.noRoom',
  charactersPending: 'lobby.charactersPending',
  duplicateCharacters: 'lobby.duplicateCharacters',
  vehiclesPending: 'lobby.vehiclesPending',
  trackPending: 'lobby.trackPending',
  noPlayers: 'lobby.noPlayers',
}

// Pied du lobby : raison du blocage, ou joueurs pas encore prêts. Réseau local : l'hôte lance
// la partie quand tout le salon est prêt ; les autres machines attendent l'hôte.
function lobbyStatus(t, { blocker, unready, isOnline, isHost, roomReady }) {
  if (blocker) return t(BLOCKER_KEYS[blocker] ?? 'common.unavailable')
  if (unready > 0) return t('lobby.readyPending', { count: unready })
  if (!isOnline) return t('lobby.allReady')
  if (!roomReady) return t('lan.lobby.waitingOthers')
  return isHost ? t('lan.lobby.hostCanStart') : t('lan.lobby.waitingHost')
}

export function LobbyFooter({ blocker, unready, isOnline, isHost = false, roomReady = false }) {
  const { t } = useTranslation()
  const status = lobbyStatus(t, { blocker, unready, isOnline, isHost, roomReady })
  const Icon = blocker ? Lock : CircleCheck

  return (
    <>
      <p className="inline-flex items-center gap-2 bg-brand-ink/85 px-3 py-2 text-sm font-semibold text-white/85">
        <Icon aria-hidden="true" className="size-4 text-brand-yellow" strokeWidth={2.75} />
        {status}
      </p>
      {isOnline && isHost ? (
        <Button id="lobby-start-btn" icon={Play} showArrow disabled={Boolean(blocker) || !roomReady} onClick={startLanMatch}>
          {t('common.start')}
        </Button>
      ) : null}
    </>
  )
}
