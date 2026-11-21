import { Lock } from 'lucide-react'
import { memo } from 'react'
import { useTranslation } from '../../i18n/useTranslation'
import { RosterCursors } from '../selection/RosterCursors'
import { CharacterAvatar } from './CharacterAvatar'
import { getPlayerColors } from './playerVisuals'

// Carte du roster des personnages : une tuile carrée, le portrait seul (le nom se lit dans la
// présélection). Dessus : les curseurs des joueurs qui le présélectionnent. `owner` : joueur
// qui l'a confirmé ; le portrait est alors grisé et marqué de son identifiant.
export const CharacterCard = memo(function CharacterCard({ characterId, cursors, owner }) {
  const { t } = useTranslation()
  const highlighted = cursors.length > 0 && !owner
  const shadow = highlighted ? 'shadow-[4px_4px_0_0_var(--color-brand-yellow)]' : 'shadow-[4px_4px_0_0_rgb(0_0_0/0.35)]'

  return (
    <div id={`roster-${characterId}`} data-reserved-by={owner?.id ?? undefined} title={t(`characters.${characterId}.name`)} className="relative aspect-square w-full">
      <CharacterAvatar
        characterId={characterId}
        size="fill"
        className={`transition duration-200 ease-out ${shadow} ${owner ? 'opacity-35' : ''}`}
      />
      <RosterCursors cursors={cursors} className="top-1" />
      {owner ? (
        <span
          aria-label={t('selection.reservedBy', { player: owner.id })}
          className={`absolute bottom-1 right-1 inline-flex items-center gap-1 px-1.5 py-0.5 font-display text-[10px] leading-none text-brand-ink ${getPlayerColors(owner.index).bg}`}
        >
          <Lock aria-hidden="true" className="size-3" strokeWidth={3} />
          {owner.id}
        </span>
      ) : null}
    </div>
  )
})
