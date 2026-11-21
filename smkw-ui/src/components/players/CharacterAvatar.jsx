import { UserRound } from 'lucide-react'
import { getCharacter } from '../../config/characters'
import { usePortraitStore } from '../../stores/portraitStore'
import { getCharacterBackground } from './playerVisuals'

const SIZES = {
  sm: 'size-10',
  md: 'size-14',
  lg: 'size-20 sm:size-24',
  // Tuile du roster : remplit sa carte (taille donnée par la grille).
  fill: 'size-full',
}

// Avatar d'un personnage : son portrait (rendu depuis son modèle 3D, portraitStore) sur un fond
// à sa couleur d'identité. Silhouette tant que le portrait n'est pas prêt, ou sans personnage.
export function CharacterAvatar({ characterId, size = 'md', className = '' }) {
  const box = SIZES[size] ?? SIZES.md
  const character = getCharacter(characterId)
  const portrait = usePortraitStore((state) => (characterId ? state.portraits[characterId] : undefined))
  const background = character ? getCharacterBackground(character.id) : 'bg-white/10'

  return (
    <span aria-hidden="true" className={`flex shrink-0 -skew-x-6 items-center justify-center overflow-hidden ${background} ${box} ${className}`}>
      {character && portrait ? (
        <img src={portrait} alt="" draggable={false} className="size-full skew-x-6 object-cover" />
      ) : (
        <UserRound className={`size-1/2 skew-x-6 ${character ? 'text-brand-ink/35' : 'text-white/60'}`} strokeWidth={2} />
      )}
    </span>
  )
}
