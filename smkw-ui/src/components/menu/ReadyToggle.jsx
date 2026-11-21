import { CircleCheck, Flag } from 'lucide-react'
import { setPlayerReady } from '../../game/lobbyReady'
import { useTranslation } from '../../i18n/useTranslation'
import { useLobbyReadyStore } from '../../stores/lobbyReadyStore'

// Bouton « Prêt » d'un joueur local (souris / tactile). Même chemin que START sur son
// périphérique (game/lobbyReady.js) : un second appui annule.
export function ReadyToggle({ playerId, colorClass }) {
  const { t } = useTranslation()
  const ready = useLobbyReadyStore((state) => Boolean(state.ready[playerId]))
  const Icon = ready ? CircleCheck : Flag

  return (
    <button
      type="button"
      id={`${playerId}-ready-btn`}
      data-ready={ready}
      aria-pressed={ready}
      title={ready ? t('lobby.cancelReady') : undefined}
      onClick={() => setPlayerReady(playerId, !ready)}
      className={
        'pointer-events-auto inline-flex shrink-0 -skew-x-12 items-center px-3 py-1.5 transition duration-150 ease-out ' +
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-ok:active:scale-95 ' +
        (ready ? 'bg-brand-yellow text-brand-ink hover:brightness-105' : `${colorClass} text-brand-ink hover:brightness-110`)
      }
    >
      <span className="inline-flex skew-x-12 items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest">
        <Icon aria-hidden="true" className="size-3.5" strokeWidth={3} />
        {ready ? t('lobby.ready') : t('lobby.setReady')}
      </span>
    </button>
  )
}
