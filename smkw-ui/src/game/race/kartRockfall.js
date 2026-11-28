import { hitKart } from '../items/kartHit'
import { readRock } from '../track/trackRockfalls'
import { hitObstacle } from './kartFeatures'

// Éboulements (calcul pur, aucune allocation) : un rocher qui touche le sol sur un kart (hors
// deltaplane) le fait partir en tête-à-queue ; posé sur la route, il bloque comme un
// rocher fixe (kartFeatures.js). Seulement pendant la course (temps de course positif).
const IMPACT_HEIGHT = 2.5
const state = { stage: 'idle', t: 0, height: 0 }

export function updateRockfalls(world, kart) {
  const { fallingRocks: rocks, rockfall } = world.geometry
  if (!rocks.length || world.raceTime <= 0) return
  // Zone d'éboulement à moins de ~40 m : sinon, rien à tester.
  const { count } = world.geometry.path
  if (!rockfall[kart.trackIndex] && !rockfall[(kart.trackIndex + 40) % count] && !rockfall[(kart.trackIndex - 40 + count) % count]) return
  for (const rock of rocks) {
    readRock(rock, world.raceTime, state)
    if (state.stage === 'rest') hitObstacle(rock, kart)
    else if (state.stage === 'fall' && state.height < IMPACT_HEIGHT && !kart.gliding) {
      const dx = kart.x - rock.x
      const dz = kart.z - rock.z
      if (dx * dx + dz * dz < (rock.radius + 1.2) ** 2) hitKart(kart)
    }
  }
}
