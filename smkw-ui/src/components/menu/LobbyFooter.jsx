import { CircleCheck, Lock, Play } from 'lucide-react'
import { startMatch } from '../../game/session'
import { useTranslation } from '../../i18n/useTranslation'
import { Button } from '../ui/Button'

const BLOCKER_KEYS = {
  serverRequired: 'lobby.startOnlineBlocked',
  charactersPending: 'lobby.charactersPending',
  duplicateCharacters: 'lobby.duplicateCharacters',
  vehiclesPending: 'lobby.vehiclesPending',
  trackPending: 'lobby.trackPending',
  noPlayers: 'lobby.noPlayers',
}

// Pied du lobby : raison du blocage, ou joueurs pas encore prêts (local). En ligne, le bouton
// Lancer reste affiché, désactivé tant que smkw-api n'existe pas.
export function LobbyFooter({ blocker, unready, isOnline }) {
  const { t } = useTranslation()
  const status = blocker
    ? t(BLOCKER_KEYS[blocker] ?? 'common.unavailable')
    : unready > 0
      ? t('lobby.readyPending', { count: unready })
      : t('lobby.allReady')
  const Icon = blocker ? Lock : CircleCheck

  return (
    <>
      <p className="inline-flex items-center gap-2 bg-brand-ink/85 px-3 py-2 text-sm font-semibold text-white/85">
        <Icon aria-hidden="true" className="size-4 text-brand-yellow" strokeWidth={2.75} />
        {status}
      </p>
      {isOnline ? (
        <Button id="lobby-start-btn" icon={Play} showArrow disabled={Boolean(blocker)} onClick={startMatch}>
          {t('common.start')}
        </Button>
      ) : null}
    </>
  )
}
