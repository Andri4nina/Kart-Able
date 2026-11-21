import { useTranslation } from '../../../i18n/useTranslation'
import { HudPanel } from './HudPanel'

// Place du joueur (position / total). Tailles par requêtes de conteneur (case du joueur).
export function PositionBadge({ position, total }) {
  const { t } = useTranslation()
  return (
    <HudPanel className="px-2.5 py-1 @md:px-5 @md:py-2">
      <p className="flex items-end font-display leading-none" aria-label={t('hud.position', { position, total })}>
        <span className="text-2xl text-brand-yellow @xs:text-4xl @md:text-6xl @3xl:text-7xl">{position}</span>
        <span className="mb-0.5 text-xs text-white @xs:mb-1 @xs:text-base @md:mb-1.5 @md:text-xl @3xl:mb-2">
          {t('hud.ordinal', { ordinal: position })}
        </span>
        <span className="mb-0.5 ml-1 font-sans text-xs font-bold text-white/45 @xs:mb-1 @xs:ml-1.5 @xs:text-sm @md:mb-1.5 @md:ml-2 @md:text-lg @3xl:mb-2">
          /{total}
        </span>
      </p>
    </HudPanel>
  )
}
