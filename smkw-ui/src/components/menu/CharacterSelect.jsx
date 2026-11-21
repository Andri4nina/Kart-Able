import { getCharacter } from '../../config/characters'
import { CHARACTER_IDS } from '../../game/characterSelectionRules'
import { continueToVehicleSelect, handleCharacterInput } from '../../game/characterSelect'
import { useTranslation } from '../../i18n/useTranslation'
import { useCharacterSelectionStore } from '../../stores/characterSelectionStore'
import { CharacterCard } from '../players/CharacterCard'
import { PanelCharacterInfo } from '../players/PanelCharacterInfo'
import { SelectionRoster } from '../selection/SelectionRoster'
import { SelectionScreen } from '../selection/SelectionScreen'

// Fonctions stables (niveau module) : les panneaux mémoïsés ne se re-rendent pas pour rien.
const getCharacterNameKey = (characterId) => `characters.${characterId}.name`
const renderCharacterInfo = (characterId, selection) => (
  <PanelCharacterInfo character={getCharacter(characterId)} direction={selection.lastMove} />
)
const renderCharacterCard = ({ itemId, cursors, owner }) => (
  <CharacterCard characterId={itemId} cursors={cursors} owner={owner} />
)

// Sélection des personnages : personnage seul en 3D, visages dans le roster, nom dans la
// présélection, aucune statistique. Un personnage confirmé est réservé à un seul joueur.
// Ensuite : sélection des véhicules.
export function CharacterSelect() {
  const { t } = useTranslation()

  return (
    <SelectionScreen
      step="characters"
      title={t('characterSelect.title')}
      subtitle={t('characterSelect.subtitle')}
      useStore={useCharacterSelectionStore}
      unique
      onInput={handleCharacterInput}
      onContinue={continueToVehicleSelect}
      continueId="characters-continue-btn"
      getNameKey={getCharacterNameKey}
      renderInfo={renderCharacterInfo}
      roster={(slots) => (
        <SelectionRoster
          itemIds={CHARACTER_IDS}
          slots={slots}
          useStore={useCharacterSelectionStore}
          unique
          label={t('characterSelect.roster')}
          // 4 x 4 tuiles carrées : largeur bornée par la hauteur restante sous la preview 3D,
          // pour que les quatre rangées tiennent à l'écran.
          className="mx-auto w-full max-w-[26rem] grid-cols-4 lg:max-w-[calc(53dvh-7.5rem)]"
          renderCard={renderCharacterCard}
        />
      )}
    />
  )
}
