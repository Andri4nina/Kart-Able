import { DEMO_HUD } from '../../config/gameConfig'
import { useRaceStore } from '../../stores/raceStore'
import { useTelemetryStore } from '../../stores/telemetryStore'
import { getDisplayedLap } from '../track/lapRules'
import { getRace } from './raceSession'
import { getCountdown } from './startLights'

// Morceaux du payload de render_game_to_text pour la course (voir game/textState.js).
const round = (value, digits = 2) => Number(value.toFixed(digits))
const MS_TO_KMH = 3.6

// Monde de course : phase, feux, et chaque kart dans l'ordre du classement.
export function describeRace() {
  const world = getRace()
  if (!world) return null
  return {
    phase: world.phase,
    time: round(world.time, 3),
    raceTime: round(world.raceTime, 3),
    goAt: round(world.start.goAt, 3),
    countdown: getCountdown(world.start, world.time),
    laps: world.laps,
    itemBoxes: `${world.items.boxes.filter((box) => box.active).length}/${world.items.boxes.length}`,
    luckyBoxes: world.items.boxes.filter((box) => box.active && box.lucky).length,
    pads: world.geometry.pads.length,
    obstacles: world.geometry.obstacles.length,
    hazards: world.items.hazards.filter((entry) => entry.ttl > 0).length,
    projectiles: world.items.projectiles.filter((entry) => entry.ttl > 0).length,
    karts: world.ranking.map((kart) => ({
      id: kart.id,
      bot: kart.isBot,
      position: kart.position,
      xz: [round(kart.x, 1), round(kart.z, 1)],
      y: round(kart.y, 2),
      airborne: kart.airborne,
      yaw: round(kart.yaw, 2),
      kmh: Math.round(kart.speed * MS_TO_KMH),
      lap: getDisplayedLap(kart.progress, world.laps),
      nextGate: kart.progress.nextGate,
      distance: round(kart.raceDistance, 1),
      offRoad: kart.offRoad,
      hop: kart.hop > 0,
      drift: kart.driftDir ? { dir: kart.driftDir, tier: kart.driftTier, charge: round(kart.driftCharge) } : null,
      boost: kart.boost > 0 ? { time: round(kart.boost, 2), source: kart.boostSource, speed: kart.boostSpeed } : null,
      bump: kart.bump > 0,
      hits: kart.hits,
      item: kart.item ? `${kart.item}x${kart.itemCharges}` : kart.itemRoll > 0 ? 'rolling' : null,
      spin: kart.spin > 0,
      shield: kart.shield > 0,
      sinking: kart.sinking > 0,
      finishTime: kart.finished ? round(kart.finishTime, 3) : null,
      ...(kart.isBot ? null : { controls: { ...kart.controls, steer: round(kart.controls.steer) }, autopilot: kart.autopilot }),
    })),
  }
}

// HUD affiché : une entrée par case de l'écran partagé (valeurs de démo dans l'arène).
export function describeHud(match) {
  const telemetry = useTelemetryStore.getState()
  const race = useRaceStore.getState()
  const laps = match?.laps ?? DEMO_HUD.laps
  return {
    demoValues: !match?.trackId,
    raceTimeSeconds: round(telemetry.raceTime, 3),
    countdown: race.countdown,
    go: race.go,
    results: race.results?.map((entry) => `${entry.position}. ${entry.id}${entry.time === null ? '' : ` ${round(entry.time, 3)}`}`) ?? null,
    viewports: (match?.players ?? []).map((player, order) => {
      const standing = race.standings[player.id]
      const live = telemetry.players[player.id]
      return {
        id: player.id,
        position: standing ? `${standing.position}/${race.total}` : `${order + 1}/${match.players.length}`,
        lap: `${standing?.lap ?? DEMO_HUD.lap}/${laps}`,
        speedKmh: Math.round(live?.speed ?? 0),
        timeSeconds: round(live?.time ?? telemetry.raceTime, 3),
        finished: standing?.finished ?? false,
      }
    }),
  }
}
