import { handleRaceFlowInput } from '../../../game/raceFlow'
import { usePlayerInput } from '../../../input/usePlayerInput'
import { useRaceFlowStore } from '../../../stores/raceFlowStore'
import { useRaceStore } from '../../../stores/raceStore'
import { RaceResults } from './RaceResults'
import { TrackVote } from './TrackVote'
import { TrackVoteReveal } from './TrackVoteReveal'

// Après la course, par-dessus l'écran partagé : résultats, puis vote du circuit suivant et
// annonce du circuit élu. Monté seulement en phase « résultats » (les entrées des joueurs y
// sont alors traitées par game/raceFlow.js).
const PANELS = { vote: TrackVote, reveal: TrackVoteReveal }

export function RaceFlowOverlay() {
  const showing = useRaceStore((state) => state.phase === 'results' && Boolean(state.results))
  return showing ? <RaceFlowPanels /> : null
}

function RaceFlowPanels() {
  const step = useRaceFlowStore((state) => state.step)
  usePlayerInput(handleRaceFlowInput)
  const Panel = PANELS[step] ?? RaceResults
  return (
    <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-brand-ink/55 p-4 sm:p-8">
      <Panel />
    </div>
  )
}
