import { ArrowLeft, Trophy } from 'lucide-react'
import { motion } from 'motion/react'
import { pageItem } from '../../animations/variants'
import { CUP_IDS, cupItemId, getCupFromItem } from '../../config/cups'
import { continueFromTrackSelect, handleTrackInput, openCup, pickCourseItem } from '../../game/trackSelect'
import { getDisplayedId } from '../../game/selection/selectionRules'
import { usePlayerInput } from '../../input/usePlayerInput'
import { useTranslation } from '../../i18n/useTranslation'
import { useCourseStore } from '../../stores/courseStore'
import { useLocalPlayersStore } from '../../stores/localPlayersStore'
import { getOpenCupItems, useCupSelectionStore, useTrackSelectionStore } from '../../stores/trackSelectionStore'
import { SelectionRoster } from '../selection/SelectionRoster'
import { CupCard } from '../tracks/CupCard'
import { CupPreview } from '../tracks/CupPreview'
import { PlaylistPanel } from '../tracks/PlaylistPanel'
import { TrackCard } from '../tracks/TrackCard'
import { TrackPreview } from '../tracks/TrackPreview'
import { Button } from '../ui/Button'
import { MenuPage } from './MenuPage'

// Fonctions stables (niveau module) : les cartes mémoïsées ne se re-rendent pas pour rien.
const renderCupCard = ({ itemId, cursors }) => <CupCard cupId={itemId} cursors={cursors} onPick={openCup} />
const pickWholeCup = (cupId) => pickCourseItem(cupItemId(cupId))
const renderCourseCard = ({ itemId, cursors }) => {
  const cup = getCupFromItem(itemId)
  return cup ? <CupCard cupId={cup.id} cursors={cursors} whole onPick={pickWholeCup} /> : <TrackCard trackId={itemId} cursors={cursors} onPick={pickCourseItem} />
}

function Preview({ itemId }) {
  const cup = getCupFromItem(itemId) ?? (CUP_IDS.includes(itemId) ? { id: itemId } : null)
  if (cup) return <CupPreview cupId={cup.id} />
  return itemId ? <TrackPreview trackId={itemId} /> : null
}

// Choix des circuits (modes de course), après les véhicules : P1 choisit pour tout le monde.
// D'abord la coupe, puis le programme parmi ses circuits (un, plusieurs, ou toute la coupe ;
// d'autres coupes en revenant en arrière). Ensuite : le lobby. Logique : game/trackSelect.js.
export function TrackSelect() {
  const { t } = useTranslation()
  const leader = useLocalPlayersStore((state) => state.slots[0] ?? null)
  const step = useCourseStore((state) => state.step)
  const cupId = useCourseStore((state) => state.cupId)
  const canContinue = useCourseStore((state) => Boolean(state.cupId || state.playlist.length))
  const onCups = step === 'cups'
  const useStore = onCups ? useCupSelectionStore : useTrackSelectionStore
  const hovered = useStore((state) => (leader ? getDisplayedId(state.selections[leader.id]) : null))
  usePlayerInput(handleTrackInput)
  const slots = leader ? [leader] : []
  const title = onCups ? t('trackSelect.cupsTitle') : t(`cups.${cupId}.name`)

  return (
    <MenuPage
      step="tracks"
      title={t('trackSelect.title')}
      subtitle={leader ? t(onCups ? 'trackSelect.subtitleCups' : 'trackSelect.subtitleTracks', { player: leader.id }) : null}
      footer={
        <>
          {!onCups ? (
            <Button id="tracks-back-btn" variant="secondary" size="md" icon={ArrowLeft} onClick={() => useCourseStore.getState().backToCups()}>
              {t('trackSelect.otherCups')}
            </Button>
          ) : null}
          <p className="bg-brand-ink/85 px-3 py-2 text-sm font-semibold text-white/85">{onCups ? t('trackSelect.pendingCups') : t('trackSelect.pendingTracks')}</p>
          <Button id="tracks-continue-btn" showArrow disabled={!canContinue} onClick={continueFromTrackSelect}>
            {t('common.continue')}
          </Button>
        </>
      }
    >
      <div className="grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start">
        <motion.section key={step + cupId} variants={pageItem} initial="hidden" animate="visible" aria-label={title} className="flex flex-col gap-3">
          <h3 className="inline-flex items-center gap-2 font-display text-xl uppercase text-white [text-shadow:0.06em_0.06em_0_var(--color-brand-ink)]">
            <Trophy aria-hidden="true" className="size-5 text-brand-yellow" strokeWidth={2.5} />
            {title}
          </h3>
          <SelectionRoster
            itemIds={onCups ? CUP_IDS : getOpenCupItems()}
            slots={slots}
            useStore={useStore}
            unique={false}
            label={title}
            className={onCups ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3 sm:grid-cols-5'}
            renderCard={onCups ? renderCupCard : renderCourseCard}
          />
        </motion.section>
        <div className="flex flex-col gap-3">
          <PlaylistPanel />
          <Preview itemId={hovered} />
        </div>
      </div>
    </MenuPage>
  )
}
