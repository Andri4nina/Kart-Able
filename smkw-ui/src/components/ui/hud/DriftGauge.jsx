import { Zap } from 'lucide-react'
import { useRef } from 'react'
import { useTelemetryListener } from '../../../hooks/useTelemetryListener'
import { useTranslation } from '../../../i18n/useTranslation'
import { HudLabel, HudPanel } from './HudPanel'

// Jauge de mini-turbo d'un joueur : visible pendant un drift, remplie selon la charge, à la
// couleur du palier atteint (blanc, bleu, orange, violet). Lue en transitoire (aucun re-render) :
// le palier passe par un attribut data-tier, la couleur par les variantes Tailwind data-[tier=*].
const TIER_FILL = 'bg-turbo-0 data-[tier=1]:bg-turbo-1 data-[tier=2]:bg-turbo-2 data-[tier=3]:bg-turbo-3'

export function DriftGauge({ playerId }) {
  const { t } = useTranslation()
  const rootRef = useRef(null)
  const fillRef = useRef(null)

  useTelemetryListener((state) => {
    const entry = state.players[playerId]
    const root = rootRef.current
    const fill = fillRef.current
    if (!root || !fill) return
    const gauge = entry?.driftGauge ?? -1
    root.hidden = gauge < 0
    if (gauge < 0) return
    fill.dataset.tier = String(entry.driftTier)
    // Style inline justifié : valeur dynamique haute fréquence.
    fill.style.transform = `scaleX(${gauge})`
  })

  return (
    <div ref={rootRef} hidden>
      <HudPanel className="w-28 px-3 py-1.5 @md:w-40">
        <HudLabel icon={Zap}>{t('hud.miniTurbo')}</HudLabel>
        <div className="mt-1 h-2 w-full bg-white/10">
          <div ref={fillRef} data-tier="0" className={`h-full origin-left ${TIER_FILL}`} />
        </div>
      </HudPanel>
    </div>
  )
}
