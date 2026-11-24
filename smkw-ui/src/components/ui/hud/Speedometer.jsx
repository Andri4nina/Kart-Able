import { Gauge } from 'lucide-react'
import { useRef } from 'react'
import { RACE } from '../../../config/race'
import { useTelemetryListener } from '../../../hooks/useTelemetryListener'
import { useTranslation } from '../../../i18n/useTranslation'
import { HudLabel, HudPanel } from './HudPanel'

// Vitesse d'un joueur lue en transitoire : valeur + barre mises à jour via refs (0 hors course).
export function Speedometer({ playerId }) {
  const { t } = useTranslation()
  const valueRef = useRef(null)
  const barRef = useRef(null)

  useTelemetryListener((state) => {
    const speed = state.players[playerId]?.speed ?? 0
    const ratio = Math.min(1, Math.max(0, speed / RACE.speedometerMax))
    if (valueRef.current) valueRef.current.textContent = String(Math.round(speed))
    // Style inline justifié : valeur dynamique haute fréquence.
    if (barRef.current) barRef.current.style.transform = `scaleX(${ratio})`
  })

  return (
    <HudPanel className="w-44 px-5 py-3 @3xl:w-52">
      <HudLabel icon={Gauge}>{t('hud.speed')}</HudLabel>
      <div className="mt-1 flex items-end gap-2">
        <span ref={valueRef} className="font-display text-4xl leading-none tabular-nums">
          {0}
        </span>
        <span className="mb-0.5 text-xs font-bold uppercase tracking-widest text-white/55">{t('hud.kmh')}</span>
      </div>
      <div className="mt-2 h-1.5 w-full bg-white/10">
        <div ref={barRef} className="h-full origin-left bg-brand-yellow" />
      </div>
    </HudPanel>
  )
}
