import { Globe, Lock, LogIn, Plus, Search, WifiOff } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { pageItem, pageList, swapVariants } from '../../animations/variants'
import { PLAY_TYPES, ROOM_CODE_LENGTH } from '../../config/gameModes'
import { getGameMode, getPlayerLimit, normalizeRoomCode } from '../../game/matchRules'
import { useTranslation } from '../../i18n/useTranslation'
import { SCREENS } from '../../navigation/screens'
import { useMatchSetupStore } from '../../stores/matchSetupStore'
import { useNavigationStore } from '../../stores/navigationStore'
import { Button } from '../ui/Button'
import { CapacityBanner, Notice } from './CapacityBanner'
import { MenuPage } from './MenuPage'

function OptionCard({ icon: Icon, title, description, disabled, badge, children }) {
  return (
    <div
      className={
        'flex h-full flex-col gap-5 p-6 ' +
        (disabled ? 'bg-brand-ink/60 text-white/45' : 'bg-brand-ink/90 text-white shadow-[8px_8px_0_0_rgb(0_0_0/0.35)]')
      }
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`flex size-14 -skew-x-12 items-center justify-center ${disabled ? 'bg-white/10' : 'bg-brand-red'}`}>
          <Icon aria-hidden="true" className="size-7 skew-x-12" strokeWidth={2.5} />
        </span>
        {badge ? (
          <span className="inline-flex items-center gap-1 bg-brand-yellow px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-ink">
            <Lock aria-hidden="true" className="size-3" strokeWidth={3} />
            {badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-2xl uppercase leading-none">{title}</h3>
        <p className="text-sm text-white/70">{description}</p>
      </div>
      <div className="mt-auto">{children}</div>
    </div>
  )
}

function JoinForm({ onJoined }) {
  const { t } = useTranslation()
  const joinOnlineMatch = useMatchSetupStore((state) => state.joinOnlineMatch)
  const [code, setCode] = useState('')
  const [invalid, setInvalid] = useState(false)

  const onSubmit = (event) => {
    event.preventDefault()
    if (joinOnlineMatch(code)) onJoined()
    else setInvalid(true)
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-2">
      <label htmlFor="room-code-input" className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/55">
        {t('online.join.codeLabel')}
      </label>
      <div className="flex gap-2">
        <input
          id="room-code-input"
          value={code}
          onChange={(event) => {
            setCode(normalizeRoomCode(event.target.value))
            setInvalid(false)
          }}
          placeholder={t('online.join.placeholder')}
          // Pas de maxLength : les caractères filtrés (tirets, espaces d'un collage)
          // compteraient avant normalisation. normalizeRoomCode limite déjà la longueur.
          size={ROOM_CODE_LENGTH}
          autoComplete="off"
          spellCheck={false}
          aria-invalid={invalid}
          aria-describedby={invalid ? 'room-code-error' : undefined}
          className={
            'min-w-0 flex-1 bg-black/45 px-4 py-3 font-display text-xl uppercase tracking-[0.3em] text-white ' +
            'outline-none ring-2 transition duration-150 ease-out placeholder:text-white/20 focus:ring-brand-yellow ' +
            (invalid ? 'ring-brand-red' : 'ring-white/10')
          }
        />
        <button
          type="submit"
          id="join-submit-btn"
          aria-label={t('online.join.submit')}
          className={
            'inline-flex shrink-0 items-center gap-2 bg-brand-red px-4 text-sm font-bold uppercase tracking-widest text-white ' +
            'transition duration-150 ease-out hover:bg-brand-red/85 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-yellow ' +
            'motion-ok:active:scale-95'
          }
        >
          <LogIn aria-hidden="true" className="size-5" strokeWidth={2.5} />
          <span className="hidden sm:inline">{t('online.join.submit')}</span>
        </button>
      </div>
      <AnimatePresence>
        {invalid ? (
          <motion.p
            id="room-code-error"
            role="alert"
            variants={swapVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-xs font-semibold text-brand-yellow"
          >
            {t('online.join.invalid')}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </form>
  )
}

// Étape 3 (réseau) : créer, rejoindre, matchmaking. Interface uniquement : aucun serveur contacté.
export function OnlineMultiplayer() {
  const { t } = useTranslation()
  const modeId = useMatchSetupStore((state) => state.modeId)
  const hostOnlineMatch = useMatchSetupStore((state) => state.hostOnlineMatch)
  const navigate = useNavigationStore((state) => state.navigate)
  const limit = getPlayerLimit(getGameMode(modeId), PLAY_TYPES.ONLINE)
  const goToLobby = () => navigate(SCREENS.LOBBY)

  return (
    <MenuPage step="connection" title={t('online.title')} subtitle={t('online.subtitle')}>
      <motion.div variants={pageItem} className="mb-6 flex flex-col items-start gap-4">
        <CapacityBanner icon={Globe} label={t('players.upTo', { count: limit })} />
        <Notice icon={WifiOff}>{t('online.offline')}</Notice>
      </motion.div>

      <motion.div variants={pageList} className="grid max-w-6xl gap-5 lg:grid-cols-3">
        <motion.div variants={pageItem}>
          <OptionCard icon={Plus} title={t('online.create.name')} description={t('online.create.description')}>
            <Button
              id="online-create-btn"
              size="md"
              icon={Plus}
              autoFocus
              onClick={() => {
                hostOnlineMatch()
                goToLobby()
              }}
            >
              {t('online.create.submit')}
            </Button>
          </OptionCard>
        </motion.div>
        <motion.div variants={pageItem}>
          <OptionCard icon={LogIn} title={t('online.join.name')} description={t('online.join.description')}>
            <JoinForm onJoined={goToLobby} />
          </OptionCard>
        </motion.div>
        <motion.div variants={pageItem}>
          <OptionCard
            icon={Search}
            title={t('online.matchmaking.name')}
            description={t('online.matchmaking.description')}
            badge={t('common.soon')}
            disabled
          />
        </motion.div>
      </motion.div>
    </MenuPage>
  )
}
