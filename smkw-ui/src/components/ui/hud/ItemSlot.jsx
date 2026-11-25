import { Dices, Package, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { createElement } from 'react'
import { useTranslation } from '../../../i18n/useTranslation'
import { useRaceStore } from '../../../stores/raceStore'
import { ITEM_ICONS } from './itemIcons'
import { useItemRoulette } from './useItemRoulette'

// Emplacement d'objet d'un joueur : vide, roulette à suspense (les icônes défilent puis
// ralentissent jusqu'au résultat, useItemRoulette), puis l'objet révélé (apparition et éclair)
// avec ses charges. Case dorée : cadre doré et étincelle. Lu dans raceStore (publié seulement
// quand il change). Tailles par requêtes de conteneur : suit la taille de la case du joueur.
const ICON_CLASS = 'size-5 skew-x-12 @md:size-8'

function frameClass(lucky, filled) {
  if (lucky) return 'border-solid border-brand-yellow bg-brand-yellow/20'
  return filled ? 'border-solid border-white/85 bg-brand-ink/90' : 'border-dashed border-white/40 bg-brand-ink/75'
}

export function ItemSlot({ playerId }) {
  const { t } = useTranslation()
  const standing = useRaceStore((state) => state.standings[playerId])
  const rolling = Boolean(standing?.rolling)
  const roulette = useItemRoulette(rolling, standing?.rollTime)
  const itemId = standing?.item ?? null
  const lucky = Boolean(standing?.lucky) && (rolling || itemId)
  const label = rolling ? t('hud.itemRolling') : itemId ? t(`items.${itemId}.name`) : t('hud.noItem')
  const filled = rolling || itemId
  const color = lucky ? 'text-brand-yellow' : filled ? 'text-white' : 'text-white/40'

  let content = createElement(Package, { 'aria-hidden': true, className: `${ICON_CLASS} ${color}`, strokeWidth: 2.25 })
  if (rolling) {
    content = (
      <motion.span key={roulette.step} className="flex" initial={{ y: -8, opacity: 0.3 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.06 }}>
        {createElement(ITEM_ICONS[roulette.id] ?? Dices, { 'aria-hidden': true, className: `${ICON_CLASS} ${color}`, strokeWidth: 2.25 })}
      </motion.span>
    )
  } else if (itemId) {
    content = (
      <motion.span key={itemId} className="flex" initial={{ scale: 1.7 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 14 }}>
        {createElement(ITEM_ICONS[itemId], { 'aria-hidden': true, className: `${ICON_CLASS} ${color}`, strokeWidth: 2.25 })}
      </motion.span>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1" data-item={itemId ?? (rolling ? 'rolling' : 'none')} data-lucky={lucky ? 'true' : 'false'}>
      <div className={`relative flex size-11 -skew-x-12 items-center justify-center border-2 @md:size-16 @3xl:size-20 ${frameClass(lucky, filled)}`}>
        {content}
        <AnimatePresence>
          {itemId && !rolling ? (
            <motion.span key={`flash-${itemId}`} aria-hidden="true" className="pointer-events-none absolute inset-0 border-4 border-white" initial={{ opacity: 1, scale: 1 }} animate={{ opacity: 0, scale: 1.6 }} transition={{ duration: 0.45 }} />
          ) : null}
        </AnimatePresence>
        {lucky ? <Sparkles aria-hidden="true" className="absolute -left-2 -top-2 size-4 skew-x-12 text-brand-yellow @md:size-5" strokeWidth={2.5} /> : null}
        {itemId && standing.charges > 1 ? (
          <span className="absolute -bottom-1.5 -right-1.5 skew-x-12 bg-brand-yellow px-1 font-display text-xs leading-tight text-brand-ink @md:text-sm">
            {t('hud.itemCharges', { count: standing.charges })}
          </span>
        ) : null}
        <span className="sr-only">{lucky ? `${label} · ${t('hud.luckyBox')}` : label}</span>
      </div>
      <span className="hidden max-w-24 truncate text-[10px] font-bold uppercase tracking-[0.25em] text-white/70 @md:inline">
        {itemId ? t(`items.${itemId}.name`) : lucky ? t('hud.luckyBox') : t('hud.item')}
      </span>
    </div>
  )
}
