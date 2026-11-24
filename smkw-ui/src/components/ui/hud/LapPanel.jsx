import { Flag, Timer } from 'lucide-react'
import { DEMO_HUD } from '../../../config/gameConfig'
import { useTranslation } from '../../../i18n/useTranslation'
import { useRaceStore } from '../../../stores/raceStore'
import { useSessionStore } from '../../../stores/sessionStore'
import { HudLabel, HudPanel } from './HudPanel'
import { RaceTimer } from './RaceTimer'

// Tour et temps de course (nombre de tours du circuit de la partie). Tailles par requêtes de
// conteneur (case du joueur) ; le temps est masqué dans les très petites cases. Tour réel du
// joueur en course (raceStore), valeur de démo sans course.
export function LapPanel({ playerId }) {
  const { t } = useTranslation()
  const laps = useSessionStore((state) => state.match?.laps ?? DEMO_HUD.laps)
  const lap = useRaceStore((state) => state.standings[playerId]?.lap ?? DEMO_HUD.lap)
  return (
    <HudPanel className="px-3 py-1.5 @md:px-5 @md:py-2">
      <div className="flex items-center gap-3 @md:gap-4">
        <div className="flex flex-col gap-1">
          <HudLabel icon={Flag}>{t('hud.lap')}</HudLabel>
          <span className="font-display text-base leading-none @md:text-xl @3xl:text-2xl">
            {lap}
            <span className="text-white/45">/{laps}</span>
          </span>
        </div>
        <span aria-hidden="true" className="hidden h-9 w-px bg-white/15 @xs:block" />
        <div className="hidden flex-col gap-1 @xs:flex">
          <HudLabel icon={Timer}>{t('hud.time')}</HudLabel>
          <RaceTimer playerId={playerId} className="text-base font-bold leading-none @md:text-xl @3xl:text-2xl" />
        </div>
      </div>
    </HudPanel>
  )
}
