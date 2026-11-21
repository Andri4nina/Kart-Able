import { Crown } from 'lucide-react'
import { motion } from 'motion/react'
import { pageItem, pageList } from '../../animations/variants'
import { useTranslation } from '../../i18n/useTranslation'
import { CharacterAvatar } from '../players/CharacterAvatar'
import { DeviceBadge } from '../players/DeviceBadge'
import { getPlayerColors } from '../players/playerVisuals'
import { ReadyToggle } from './ReadyToggle'

// Ligne joueur : couleur, identifiant, personnage et véhicule confirmés (local), périphérique,
// et bouton « Prêt » pour un joueur local (il a un périphérique).
function PlayerRow({ index, id, name, characterId, vehicleId, deviceId, badge, isHost }) {
  const { t } = useTranslation()
  const colors = getPlayerColors(index)
  return (
    <div className="relative flex items-center gap-3 bg-brand-ink/90 py-2.5 pl-5 pr-4">
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1.5 ${colors.bg}`} />
      {characterId ? <CharacterAvatar characterId={characterId} size="sm" /> : null}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-baseline gap-2 font-display text-lg uppercase leading-none">
          <span className={colors.text}>{id}</span>
          <span className="truncate">{name}</span>
        </span>
        {characterId ? (
          <span className="truncate text-[11px] font-bold uppercase tracking-widest text-white/55">
            {vehicleId ? `${t(`characters.${characterId}.name`)} · ${t(`vehicles.${vehicleId}.name`)}` : t(`characters.${characterId}.name`)}
          </span>
        ) : null}
      </div>
      {badge ? (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-brand-yellow">
          {isHost ? <Crown aria-hidden="true" className="size-3" strokeWidth={3} /> : null}
          {badge}
        </span>
      ) : null}
      {/* Enveloppe : `hidden` posé sur le badge serait écrasé par son propre inline-flex. */}
      {deviceId ? (
        <span className="hidden min-w-0 sm:inline-flex">
          <DeviceBadge deviceId={deviceId} className="min-w-0" />
        </span>
      ) : null}
      {deviceId ? <ReadyToggle playerId={id} colorClass={colors.bg} /> : null}
    </div>
  )
}

// Liste des joueurs du lobby et places libres.
export function LobbyPlayers({ players, freeSlots, showWaiting }) {
  const { t } = useTranslation()
  return (
    <motion.section variants={pageItem} aria-label={t('lobby.players')} className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-xl uppercase text-white [text-shadow:0.06em_0.06em_0_var(--color-brand-ink)]">
          {t('lobby.players')}
        </h3>
        <span className="bg-brand-ink/85 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/80">
          {t('lobby.freeSlots', { count: freeSlots })}
        </span>
      </div>
      <motion.ul variants={pageList} className="flex flex-col gap-2">
        {players.map((player) => (
          <motion.li key={player.id} variants={pageItem}>
            <PlayerRow {...player} />
          </motion.li>
        ))}
      </motion.ul>
      {showWaiting ? (
        <p className="border-2 border-dashed border-white/25 bg-brand-ink/50 px-4 py-3 text-center text-sm font-bold uppercase tracking-widest text-white/60">
          {t('lobby.waiting')}
        </p>
      ) : null}
    </motion.section>
  )
}
