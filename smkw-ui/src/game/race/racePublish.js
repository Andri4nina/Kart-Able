import { START_LIGHTS } from '../../config/race'
import { useRaceStore } from '../../stores/raceStore'
import { useTelemetryStore } from '../../stores/telemetryStore'
import { getDisplayedLap } from '../track/lapRules'
import { getDriftGauge } from './kartDrift'
import { getBestLap } from './raceProgress'
import { RACE_PHASES } from './raceWorld'
import { getLightsOn } from './startLights'

// Publication de l'état de la course vers l'interface :
// - télémétrie (vitesse, temps de chaque joueur) à chaque frame, sans allocation ;
// - raceStore (phase, feux, classement, résultats) seulement quand une valeur change.
const MS_TO_KMH = 3.6

function standingsChanged(standings, world) {
  for (const kart of world.humans) {
    const entry = standings[kart.id]
    if (!entry || entry.position !== kart.position || entry.finished !== kart.finished) return true
    if (entry.lap !== getDisplayedLap(kart.progress, world.laps)) return true
    if (entry.item !== kart.item || entry.charges !== kart.itemCharges || entry.rolling !== kart.itemRoll > 0) return true
    if (entry.shield !== kart.shield > 0) return true
  }
  return false
}

function buildStandings(world) {
  return Object.fromEntries(
    world.humans.map((kart) => [
      kart.id,
      {
        position: kart.position,
        lap: getDisplayedLap(kart.progress, world.laps),
        finished: kart.finished,
        item: kart.item,
        charges: kart.itemCharges,
        rolling: kart.itemRoll > 0,
        shield: kart.shield > 0,
      },
    ]),
  )
}

// Classement final : les arrivés avec leur temps, les autres à leur place du moment.
export function buildResults(world) {
  return world.ranking.map((kart) => ({
    id: kart.id,
    isBot: kart.isBot,
    playerIndex: kart.playerIndex,
    characterId: kart.characterId,
    position: kart.position,
    time: kart.finished ? kart.finishTime : null,
    bestLap: getBestLap(kart),
    lapTimes: [...kart.lapTimes],
  }))
}

export function publishRace(world) {
  const telemetry = useTelemetryStore.getState()
  for (const kart of world.humans) {
    const entry = telemetry.players[kart.id]
    if (!entry) continue
    entry.speed = Math.abs(kart.speed) * MS_TO_KMH
    entry.time = kart.finished ? kart.finishTime : Math.max(0, world.raceTime)
    entry.driftTier = kart.driftTier
    entry.driftGauge = kart.driftDir ? getDriftGauge(kart.driftCharge) : -1
    entry.boost = kart.boost
  }
  telemetry.publish(Math.max(0, world.raceTime))

  const race = useRaceStore.getState()
  const lightsOn = getLightsOn(world.start, world.time)
  const go = world.phase === RACE_PHASES.RACING && world.raceTime < START_LIGHTS.goShown
  const results = world.phase === RACE_PHASES.RESULTS && !race.results
  const standings = standingsChanged(race.standings, world)
  if (race.phase === world.phase && race.lightsOn === lightsOn && race.go === go && !results && !standings) return
  race.publish({
    phase: world.phase,
    lightsOn,
    go,
    total: world.karts.length,
    ...(standings ? { standings: buildStandings(world) } : null),
    ...(results ? { results: buildResults(world) } : null),
  })
}
