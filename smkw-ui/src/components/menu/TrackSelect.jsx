import { Trophy } from 'lucide-react'
import { motion } from 'motion/react'
import { pageItem } from '../../animations/variants'
import { CUPS } from '../../config/cups'
import { continueFromTrackSelect, handleTrackInput } from '../../game/trackSelect'
import { getDisplayedId, SELECTION_STATUS } from '../../game/selection/selectionRules'
import { usePlayerInput } from '../../input/usePlayerInput'
import { useTranslation } from '../../i18n/useTranslation'
import { useLocalPlayersStore } from '../../stores/localPlayersStore'
import { useTrackSelectionStore } from '../../stores/trackSelectionStore'
import { SelectionPanel } from '../selection/SelectionPanel'
import { SelectionRoster } from '../selection/SelectionRoster'
import { TrackCard } from '../tracks/TrackCard'
import { TrackPreview } from '../tracks/TrackPreview'
import { Button } from '../ui/Button'
import { MenuPage } from './MenuPage'

// Fonctions stables (niveau module) : le panneau mémoïsé ne se re-rend pas pour rien.
const renderTrackCard = ({ itemId, cursors }) => <TrackCard trackId={itemId} cursors={cursors} />
const renderTrackInfo = () => null

// Choix de la coupe et du circuit (modes de course), après les véhicules : P1 choisit pour
// tout le monde. Une rangée de 4 circuits par coupe, aperçu du circuit présélectionné.
// Ensuite : le lobby.
export function TrackSelect() {
  const { t } = useTranslation()
  const leader = useLocalPlayersStore((state) => state.slots[0] ?? null)
  const selection = useTrackSelectionStore((state) => (leader ? state.selections[leader.id] : null))
  usePlayerInput(handleTrackInput)

  const trackId = getDisplayedId(selection)
  const confirmed = selection?.status === SELECTION_STATUS.CONFIRMED
  const slots = leader ? [leader] : []

  return (
    <MenuPage
      step="tracks"
      title={t('trackSelect.title')}
      subtitle={leader ? t('trackSelect.subtitle', { player: leader.id }) : null}
      footer={
        <>
          <p className="bg-brand-ink/85 px-3 py-2 text-sm font-semibold text-white/85">
            {confirmed ? t('trackSelect.confirmed') : t('trackSelect.pending')}
          </p>
          <Button id="tracks-continue-btn" showArrow disabled={!confirmed} onClick={continueFromTrackSelect}>
            {t('common.continue')}
          </Button>
        </>
      }
    >
      <div className="grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start">
        <div className="flex flex-col gap-5">
          {CUPS.map((cup) => (
            <motion.section key={cup.id} variants={pageItem} aria-label={t(`cups.${cup.id}.name`)} className="flex flex-col gap-3">
              <h3 className="inline-flex items-center gap-2 font-display text-xl uppercase text-white [text-shadow:0.06em_0.06em_0_var(--color-brand-ink)]">
                <Trophy aria-hidden="true" className="size-5 text-brand-yellow" strokeWidth={2.5} />
                {t(`cups.${cup.id}.name`)}
              </h3>
              <SelectionRoster
                itemIds={cup.trackIds}
                slots={slots}
                useStore={useTrackSelectionStore}
                unique={false}
                label={t('trackSelect.roster', { cup: t(`cups.${cup.id}.name`) })}
                className="grid-cols-2 sm:grid-cols-4"
                renderCard={renderTrackCard}
              />
            </motion.section>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {trackId ? <TrackPreview trackId={trackId} /> : null}
          {leader ? <SelectionPanel slot={leader} useStore={useTrackSelectionStore} unique={false} renderInfo={renderTrackInfo} /> : null}
        </div>
      </div>
    </MenuPage>
  )
}
