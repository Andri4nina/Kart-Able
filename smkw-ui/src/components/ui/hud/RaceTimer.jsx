import { useRef } from 'react'
import { formatRaceTime } from '../../../game/format'
import { useTelemetryListener } from '../../../hooks/useTelemetryListener'

// Chrono mis à jour hors React (textContent) pour éviter un re-render par frame. Avec
// `playerId` : temps de ce joueur (figé à son arrivée), sinon temps de course.
export function RaceTimer({ playerId, className = '' }) {
  const ref = useRef(null)

  useTelemetryListener((state) => {
    if (ref.current) ref.current.textContent = formatRaceTime(state.players[playerId]?.time ?? state.raceTime)
  })

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {formatRaceTime(0)}
    </span>
  )
}
