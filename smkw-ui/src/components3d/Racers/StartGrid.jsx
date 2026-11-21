import { getRaceRoster } from '../../game/race/raceRoster'
import { getRaceStartSlot } from '../../game/race/startSlots'
import { useSessionStore } from '../../stores/sessionStore'
import { PALETTE, PLAYER_COLORS } from '../World/palette'
import { GridBox } from './GridBox'
import { RacerKart } from './RacerKart'

// Pilotes de la partie en cours (joueurs et ordinateurs) dans l'ordre de la grille de départ
// (game/race/raceRoster.js) : celle du circuit choisi, ou celle de l'arène pour les modes sans
// circuit. Cases peintes à la couleur du joueur (blanches pour l'ordinateur).
// Absente hors partie : le menu garde sa scène décorative.
export function StartGrid() {
  const match = useSessionStore((state) => state.match)
  if (!match?.players?.length) return null
  const roster = getRaceRoster(match)
  const slots = roster.map((_, order) => getRaceStartSlot(match, order))

  return (
    <>
      <group name="start-boxes">
        {roster.map((racer, order) => (
          <GridBox key={racer.id} slot={slots[order]} color={racer.isBot ? PALETTE.white : PLAYER_COLORS[racer.index % PLAYER_COLORS.length]} />
        ))}
      </group>
      <group name="start-grid">
        {roster.map((racer, order) => (
          <RacerKart key={racer.id} racer={racer} slot={slots[order]} />
        ))}
      </group>
    </>
  )
}
