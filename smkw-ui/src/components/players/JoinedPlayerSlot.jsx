import { LogOut } from 'lucide-react'
import { motion } from 'motion/react'
import { playerCardVariants, playerFlashVariants, playerNumberVariants } from '../../animations/variants'
import { PLAYER_STATUS } from '../../config/players'
import { getConfirmedCharacterId } from '../../game/characterSelectionRules'
import { useTranslation } from '../../i18n/useTranslation'
import { useCharacterSelectionStore } from '../../stores/characterSelectionStore'
import { useLocalPlayersStore } from '../../stores/localPlayersStore'
import { CharacterAvatar } from './CharacterAvatar'
import { DeviceBadge } from './DeviceBadge'
import { JoinStatusBadge } from './JoinStatusBadge'
import { getPlayerColors } from './playerVisuals'

// Joueur présent : flash de sa couleur, entrée avec rebond, numéro, READY.
export function JoinedPlayerSlot({ slot }) {
  const { t } = useTranslation()
  const leave = useLocalPlayersStore((state) => state.leave)
  // Personnage confirmé lors d'une sélection précédente (sinon silhouette neutre).
  const characterId = useCharacterSelectionStore((state) => getConfirmedCharacterId(state.selections, slot.id))
  const colors = getPlayerColors(slot.index)
  const joining = slot.status === PLAYER_STATUS.JOINING
  const playerName = t('players.player', { number: slot.number })

  return (
    <motion.div
      variants={playerCardVariants}
      initial={joining ? 'hidden' : false}
      animate={joining ? 'entering' : 'ready'}
      exit="exit"
      className="absolute inset-0 flex flex-col overflow-hidden bg-brand-ink/95 text-white shadow-[6px_6px_0_0_rgb(0_0_0/0.35)]"
    >
      {joining ? (
        <motion.span
          aria-hidden="true"
          variants={playerFlashVariants}
          initial="hidden"
          animate="visible"
          className={`pointer-events-none absolute inset-0 ${colors.bg}`}
        />
      ) : null}
      <span aria-hidden="true" className={`h-1.5 w-full shrink-0 ${colors.bg}`} />

      <div className="relative flex items-start justify-between gap-2 px-4 pt-3 lg:pt-2">
        <motion.span
          variants={playerNumberVariants}
          initial={joining ? 'hidden' : false}
          animate="visible"
          className={`font-display text-4xl leading-none sm:text-5xl lg:text-4xl ${colors.text}`}
        >
          {slot.id}
        </motion.span>
        <button
          type="button"
          id={`slot-${slot.id}-leave`}
          onClick={() => leave(slot.id)}
          aria-label={t('local.leave', { player: playerName })}
          title={t('local.leave', { player: playerName })}
          className="inline-flex size-8 items-center justify-center text-white/45 transition duration-150 ease-out hover:bg-brand-red hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow"
        >
          <LogOut aria-hidden="true" className="size-4" strokeWidth={2.5} />
        </button>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-2.5 px-3 lg:gap-2">
        <CharacterAvatar characterId={characterId} size="md" className={`ring-2 ring-offset-2 ring-offset-brand-ink lg:size-10 ${colors.ring}`} />
        <span className="font-display text-base uppercase leading-none sm:text-lg">{playerName}</span>
      </div>

      <div className="relative flex flex-col items-center gap-1.5 px-3 pb-3 lg:pb-2">
        <JoinStatusBadge joining={joining} colorClass={colors.bg} />
        <DeviceBadge deviceId={slot.deviceId} className="max-w-full" />
      </div>
    </motion.div>
  )
}
