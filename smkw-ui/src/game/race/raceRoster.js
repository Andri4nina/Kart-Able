import { CHARACTERS } from '../../config/characters'
import { RACE } from '../../config/race'
import { VEHICLES } from '../../config/vehicles'
import { createRandom } from '../track/noise'

// Pilotes ordinateur du mode course (config/gameModes.js : bots) : le peloton est complété
// jusqu'à RACE.fieldSize avec des personnages qu'aucun joueur n'a choisis, sur des véhicules
// tirés au hasard (graine de la partie). Niveau étalé : le premier de la grille est le plus fort.
const SKILL = { best: 0.97, worst: 0.86 }

export function buildRaceBots(mode, players, seed) {
  if (!mode.bots) return []
  const random = createRandom(seed)
  const taken = new Set(players.map((player) => player.characterId))
  const pool = CHARACTERS.map((character) => character.id).filter((id) => !taken.has(id))
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  const count = Math.min(pool.length, Math.max(0, RACE.fieldSize - players.length))
  return Array.from({ length: count }, (_, index) =>
    Object.freeze({
      id: `CPU${index + 1}`,
      characterId: pool[index],
      vehicleId: VEHICLES[Math.floor(random() * VEHICLES.length)].id,
      skill: SKILL.best - ((SKILL.best - SKILL.worst) * index) / Math.max(1, count - 1),
      lane: (random() * 2 - 1) * 0.5,
    }),
  )
}

// Ordre de la grille : les pilotes ordinateur devant, les joueurs derrière (ils remontent le
// peloton, comme dans les jeux de kart). Sans bots, les joueurs dans l'ordre de la partie.
// Mis en cache par partie : identité stable pour les composants.
const rosters = new WeakMap()

export function getRaceRoster(match) {
  if (!match) return []
  if (!rosters.has(match)) {
    const bots = (match.bots ?? []).map((bot) => Object.freeze({ ...bot, isBot: true }))
    const humans = match.players.map((player) => Object.freeze({ ...player, isBot: false }))
    rosters.set(match, Object.freeze([...bots, ...humans]))
  }
  return rosters.get(match)
}

export function getRacerOrder(match, racerId) {
  return getRaceRoster(match).findIndex((racer) => racer.id === racerId)
}
