import { useMemo, useRef } from 'react'
import { getTrackOutline } from '../../../game/track/trackOutline'
import { getRaceRoster } from '../../../game/race/raceRoster'
import { useTelemetryListener } from '../../../hooks/useTelemetryListener'
import { useTranslation } from '../../../i18n/useTranslation'
import { useSessionStore } from '../../../stores/sessionStore'
import { getPlayerColors } from '../../players/playerVisuals'
import { TrackMinimap } from '../../tracks/TrackMinimap'

// Mini-carte de course : le circuit (TrackMinimap) et un point par kart, déplacé chaque frame
// en transitoire (aucun re-render). Pilotes ordinateur en gris, joueurs à leur couleur ; le
// joueur de la case est plus gros, cerclé, et dessiné par-dessus les autres.
export function RaceMinimap({ playerId }) {
  const { t } = useTranslation()
  const match = useSessionStore((state) => state.match)
  const outline = match?.trackId ? getTrackOutline(match.trackId) : null
  const roster = useMemo(() => getRaceRoster(match), [match])
  const dotsRef = useRef([])
  // Ordre de dessin : les autres d'abord, le joueur de la case en dernier (au-dessus).
  const order = useMemo(() => {
    const indices = roster.map((_, index) => index)
    const own = roster.findIndex((racer) => racer.id === playerId)
    return own < 0 ? indices : [...indices.filter((index) => index !== own), own]
  }, [roster, playerId])

  useTelemetryListener((state) => {
    if (!outline) return
    const { minX, minZ, scale, pad } = outline.transform
    const { racers } = state
    for (let i = 0; i < racers.count; i += 1) {
      const dot = dotsRef.current[i]
      if (!dot) continue
      dot.setAttribute('cx', String(pad + (racers.x[i] - minX) * scale))
      dot.setAttribute('cy', String(pad + (racers.z[i] - minZ) * scale))
    }
  })

  if (!outline || !match) return null
  return (
    <div data-hud="minimap" aria-label={t('hud.minimap')} className="relative aspect-square w-24 bg-brand-ink/70 shadow-[4px_4px_0_0_rgb(0_0_0/0.3)] @md:w-36 @3xl:w-44">
      <TrackMinimap trackId={match.trackId} className="absolute inset-0 h-full w-full" />
      <svg viewBox={outline.viewBox} aria-hidden="true" className="absolute inset-0 h-full w-full">
        {order.map((index) => {
          const racer = roster[index]
          const own = racer.id === playerId
          const fill = racer.isBot ? 'fill-white/55' : getPlayerColors(racer.index).fill
          return (
            <circle
              key={racer.id}
              ref={(node) => {
                dotsRef.current[index] = node
              }}
              cx={-10}
              cy={-10}
              r={own ? 3.6 : racer.isBot ? 1.6 : 2.6}
              strokeWidth={own ? 1.4 : 0.6}
              className={`stroke-brand-ink ${fill}`}
            />
          )
        })}
      </svg>
    </div>
  )
}
