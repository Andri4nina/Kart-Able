import { Gamepad2 } from 'lucide-react'
import { motion } from 'motion/react'
import { pageItem, pageList } from '../../animations/variants'
import { PLAY_TYPES } from '../../config/gameModes'
import { getGameMode, getPlayerLimit } from '../../game/matchRules'
import { canContinueFromJoin, continueToCharacterSelect, handleJoinInput } from '../../game/playerJoin'
import { DEVICE_KINDS, KEYBOARD_1, KEYBOARD_2, POINTER_DEVICE } from '../../input/devices'
import { useDeviceKeyLabels } from '../../hooks/useInputLabels'
import { usePlayerInput } from '../../input/usePlayerInput'
import { useTranslation } from '../../i18n/useTranslation'
import { useLocalPlayersStore } from '../../stores/localPlayersStore'
import { useMatchSetupStore } from '../../stores/matchSetupStore'
import { JoinHints } from '../players/JoinHints'
import { PlayerSlotCard } from '../players/PlayerSlotCard'
import { Button } from '../ui/Button'
import { CapacityBanner } from './CapacityBanner'
import { MenuPage } from './MenuPage'

// Toutes les manettes partagent la même assignation.
const ANY_GAMEPAD = { kind: DEVICE_KINDS.GAMEPAD }

// Écran d'attente des joueurs locaux : chaque périphérique rejoint en appuyant sur START.
// Grille P1 P2 P3 P4 / P5 P6 P7 P8. Continuer = bouton, ou START d'un joueur prêt.
export function LocalMultiplayer() {
  const { t } = useTranslation()
  const slots = useLocalPlayersStore((state) => state.slots)
  const modeId = useMatchSetupStore((state) => state.modeId)
  usePlayerInput(handleJoinInput)

  // Touche RETOUR de chaque périphérique, d'après l'assignation (paramètres > Contrôles).
  const keyboard1Keys = useDeviceKeyLabels(KEYBOARD_1)
  const keyboard2Keys = useDeviceKeyLabels(KEYBOARD_2)
  const gamepadKeys = useDeviceKeyLabels(ANY_GAMEPAD)
  const limit = getPlayerLimit(getGameMode(modeId), PLAY_TYPES.LOCAL)
  const slotsByIndex = new Map(slots.map((slot) => [slot.index, slot]))
  const canContinue = canContinueFromJoin(slots)
  const pointerAvailable = slots.length < limit && !slots.some((slot) => slot.deviceId === POINTER_DEVICE.id)

  return (
    <MenuPage
      step="players"
      title={t('local.title')}
      subtitle={t('local.subtitle')}
      footer={
        <>
          <p className="mr-auto hidden text-[11px] font-semibold uppercase tracking-widest text-white/75 md:block">
            {t('local.leaveHint', {
              keyboard1: keyboard1Keys?.back ?? '',
              keyboard2: keyboard2Keys?.back ?? '',
              gamepad: gamepadKeys?.back ?? '',
            })}
          </p>
          <p className="bg-brand-ink/85 px-3 py-2 text-sm font-semibold text-white/85">
            {canContinue ? t('local.continueHint') : t('local.waitingHint')}
          </p>
          <Button id="local-continue-btn" showArrow disabled={!canContinue} onClick={continueToCharacterSelect}>
            {t('common.continue')}
          </Button>
        </>
      }
    >
      <motion.div variants={pageItem} className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <CapacityBanner
          icon={Gamepad2}
          label={limit === 1 ? t('players.solo') : t('players.upTo', { count: limit })}
          counter={`${slots.length}/${limit}`}
        />
        <JoinHints />
      </motion.div>

      <motion.ul
        variants={pageList}
        className={`grid gap-3 sm:gap-4 ${limit === 1 ? 'max-w-60' : 'grid-cols-2 lg:grid-cols-4'}`}
      >
        {Array.from({ length: limit }, (_, index) => (
          <motion.li key={index} variants={pageItem}>
            <PlayerSlotCard index={index} slot={slotsByIndex.get(index)} pointerAvailable={pointerAvailable} />
          </motion.li>
        ))}
      </motion.ul>
    </MenuPage>
  )
}
