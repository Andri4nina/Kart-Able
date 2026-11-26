import { Wind } from 'lucide-react'
import { useRef } from 'react'
import { useTelemetryListener } from '../../../hooks/useTelemetryListener'
import { useTranslation } from '../../../i18n/useTranslation'
import { HudLabel, HudPanel } from './HudPanel'

// Jauge d'aspiration d'un joueur : visible dans le sillage d'un kart, pleine au turbo.
// Lue en transitoire (aucun re-render), comme la jauge de mini-turbo.
export function DraftGauge({ playerId }) {
  const { t } = useTranslation()
  const rootRef = useRef(null)
  const fillRef = useRef(null)

  useTelemetryListener((state) => {
    const level = state.players[playerId]?.draft ?? 0
    const root = rootRef.current
    const fill = fillRef.current
    if (!root || !fill) return
    root.hidden = level <= 0
    // Style inline justifié : valeur dynamique haute fréquence.
    if (level > 0) fill.style.transform = `scaleX(${level})`
  })

  return (
    <div ref={rootRef} hidden data-hud="draft">
      <HudPanel className="w-28 px-3 py-1.5 @md:w-40">
        <HudLabel icon={Wind}>{t('hud.draft')}</HudLabel>
        <div className="mt-1 h-2 w-full bg-white/10">
          <div ref={fillRef} className="h-full origin-left bg-white" />
        </div>
      </HudPanel>
    </div>
  )
}
