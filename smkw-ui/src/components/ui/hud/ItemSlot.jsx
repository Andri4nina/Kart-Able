import { Package } from 'lucide-react'
import { createElement, useEffect, useState } from 'react'
import { useReducedMotion } from '../../../hooks/useReducedMotion'
import { useTranslation } from '../../../i18n/useTranslation'
import { useRaceStore } from '../../../stores/raceStore'
import { ITEM_ICONS, ROULETTE_ORDER } from './itemIcons'

// Emplacement d'objet d'un joueur : vide, roulette (les icônes défilent pendant le tirage), ou
// l'objet tenu avec ses charges. Lu dans raceStore (publié seulement quand il change).
// Tailles par requêtes de conteneur : il suit la taille de la case du joueur.
const ROULETTE_STEP_MS = 90

function useRouletteIcon(rolling) {
  const reducedMotion = useReducedMotion()
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (!rolling || reducedMotion) return undefined
    const timer = setInterval(() => setStep((value) => value + 1), ROULETTE_STEP_MS)
    return () => clearInterval(timer)
  }, [rolling, reducedMotion])
  return ITEM_ICONS[ROULETTE_ORDER[step % ROULETTE_ORDER.length]]
}

export function ItemSlot({ playerId }) {
  const { t } = useTranslation()
  const standing = useRaceStore((state) => state.standings[playerId])
  const rolling = Boolean(standing?.rolling)
  const rouletteIcon = useRouletteIcon(rolling)
  const itemId = standing?.item ?? null
  const Icon = rolling ? rouletteIcon : itemId ? ITEM_ICONS[itemId] : Package
  const label = rolling ? t('hud.itemRolling') : itemId ? t(`items.${itemId}.name`) : t('hud.noItem')
  const filled = rolling || itemId
  const frame = filled ? 'border-solid border-brand-yellow bg-brand-ink/90' : 'border-dashed border-white/40 bg-brand-ink/75'

  return (
    <div className="flex flex-col items-center gap-1" data-item={itemId ?? (rolling ? 'rolling' : 'none')}>
      <div className={`relative flex size-11 -skew-x-12 items-center justify-center border-2 @md:size-16 @3xl:size-20 ${frame}`}>
        {createElement(Icon, {
          'aria-hidden': true,
          className: `size-5 skew-x-12 @md:size-8 ${filled ? 'text-brand-yellow' : 'text-white/40'}`,
          strokeWidth: 2.25,
        })}
        {itemId && standing.charges > 1 ? (
          <span className="absolute -bottom-1.5 -right-1.5 skew-x-12 bg-brand-yellow px-1 font-display text-xs leading-tight text-brand-ink @md:text-sm">
            {t('hud.itemCharges', { count: standing.charges })}
          </span>
        ) : null}
        <span className="sr-only">{label}</span>
      </div>
      <span className="hidden max-w-24 truncate text-[10px] font-bold uppercase tracking-[0.25em] text-white/70 @md:inline">
        {itemId ? t(`items.${itemId}.name`) : t('hud.item')}
      </span>
    </div>
  )
}
