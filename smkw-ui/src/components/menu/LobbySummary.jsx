import { Gamepad2, Globe, Hash, Route, Users, WifiOff } from 'lucide-react'
import { motion } from 'motion/react'
import { pageItem } from '../../animations/variants'
import { useTranslation } from '../../i18n/useTranslation'
import { Notice } from './CapacityBanner'
import { getTrackCup, resolveCourse } from '../../config/cups'
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

// Programme en une ligne : coupe complète, circuit seul, ou plusieurs circuits.
function describeCourse(t, course) {
  const resolved = course ? resolveCourse(course.playlist, course.cupId) : null
  if (!resolved) return null
  const { cupId, trackIds } = resolved
  if (cupId) return t('lobby.cupValue', { cup: t(`cups.${cupId}.name`), count: trackIds.length })
  const first = t(`tracks.${trackIds[0]}.name`)
  if (trackIds.length === 1) return t('lobby.trackValue', { track: first, cup: t(`cups.${getTrackCup(trackIds[0])?.id}.name`) })
  return t('lobby.playlistValue', { count: trackIds.length, first, last: t(`tracks.${trackIds.at(-1)}.name`) })
}

// Récapitulatif du lobby : mode, type de partie, programme des circuits, nombre de joueurs,
// code (réseau). `course` : { cupId, playlist } composé à l'écran des circuits.
export function LobbySummary({ setup, course = null, playerCount, limit, isOnline }) {
  const { t } = useTranslation()
  const courseValue = describeCourse(t, course)
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
