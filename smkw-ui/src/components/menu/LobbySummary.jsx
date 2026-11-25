import { Gamepad2, Globe, Hash, Route, Users, WifiOff } from 'lucide-react'
import { motion } from 'motion/react'
import { pageItem } from '../../animations/variants'
import { useTranslation } from '../../i18n/useTranslation'
import { Notice } from './CapacityBanner'
import { getCupFromItem, getTrackCup } from '../../config/cups'
import { getModeVisual } from './modeVisuals'

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-white/10 py-3">
      <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">
        <Icon aria-hidden="true" className="size-4" strokeWidth={2.5} />
        {label}
      </span>
      <span className="text-right font-bold text-white">{value}</span>
    </div>
  )
}

// Récapitulatif du lobby : mode, type de partie, circuit (coupe), nombre de joueurs, code (réseau).
export function LobbySummary({ setup, trackId = null, playerCount, limit, isOnline }) {
  const { t } = useTranslation()
  // trackId : choix de l'écran des circuits, coupe complète (`cup:<id>`) ou circuit seul.
  const cup = getCupFromItem(trackId)
  const courseValue = cup
    ? t('lobby.cupValue', { cup: t(`cups.${cup.id}.name`), count: cup.trackIds.length })
    : trackId
      ? t('lobby.trackValue', { track: t(`tracks.${trackId}.name`), cup: t(`cups.${getTrackCup(trackId)?.id}.name`) })
      : null
  const { icon: ModeIcon, accent } = getModeVisual(setup.modeId)

  return (
    <motion.aside variants={pageItem} className="flex flex-col gap-5 bg-brand-ink/90 p-6 text-white shadow-[8px_8px_0_0_rgb(0_0_0/0.35)]">
      <div className="flex items-center gap-4">
        <span className={`flex size-14 shrink-0 -skew-x-12 items-center justify-center ${accent}`}>
          <ModeIcon aria-hidden="true" className="size-7 skew-x-12" strokeWidth={2.5} />
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/55">{t('lobby.mode')}</span>
          <span className="font-display text-2xl uppercase leading-none">{t(`modes.${setup.modeId}.name`)}</span>
        </div>
      </div>
      <p className="text-sm text-white/70">{t(`modes.${setup.modeId}.description`)}</p>
      <div>
        <SummaryRow icon={isOnline ? Globe : Gamepad2} label={t('lobby.type')} value={t(`playType.${setup.playType}.name`)} />
        {courseValue ? <SummaryRow icon={Route} label={t('lobby.track')} value={courseValue} /> : null}
        <SummaryRow icon={Users} label={t('lobby.players')} value={t('players.count', { count: playerCount, max: limit })} />
        {isOnline ? <SummaryRow icon={Hash} label={t('lobby.code')} value={setup.online.code || t('lobby.codePending')} /> : null}
      </div>
      {isOnline ? <Notice icon={WifiOff}>{t('online.offline')}</Notice> : null}
    </motion.aside>
  )
}
