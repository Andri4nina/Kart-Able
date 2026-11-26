import { sendRelay } from './lanSession'

// Course en réseau local : chaque machine envoie 20 fois par seconde l'état des karts qu'elle
// pilote (ses joueurs ; l'hôte aussi les pilotes ordinateur) et applique celui des autres aux
// karts « distants » (game/race/remoteKart.js les fait glisser vers la dernière position reçue).
// Format compact : un tableau par kart (FIELDS).
const SEND_INTERVAL = 0.05
const FIELDS = ['x', 'y', 'z', 'yaw', 'vx', 'vz', 'vy', 'speed', 'driftDir', 'driftTier', 'boost', 'hop', 'gliding', 'trick', 'trickStyle', 'spin', 'shield', 'sinking', 'lap', 'nextGate', 'finished', 'finishTime']
const BOOST_SOURCES = ['miniTurbo1', 'miniTurbo2', 'miniTurbo3', 'start', 'item', 'pad', 'trick']
let elapsed = 0

const round = (value) => Math.round(value * 1000) / 1000

function encode(kart) {
  const values = {
    ...kart,
    boost: kart.boost > 0 ? BOOST_SOURCES.indexOf(kart.boostSource) + 1 : 0,
    gliding: kart.gliding ? 1 : 0,
    shield: kart.shield > 0 ? 1 : 0,
    lap: kart.progress.lap,
    nextGate: kart.progress.nextGate,
    finished: kart.finished ? 1 : 0,
    finishTime: kart.finishTime ?? -1,
  }
  return [kart.id, ...FIELDS.map((field) => round(Number(values[field]) || 0))]
}

export function tickNetRace(world, delta) {
  if (!world.net) return
  elapsed += delta
  if (elapsed < SEND_INTERVAL) return
  elapsed = 0
  const karts = []
  for (const kart of world.karts) if (!kart.remote) karts.push(encode(kart))
  if (karts.length) sendRelay({ kind: 'karts', t: round(world.raceTime), k: karts })
}

// État reçu d'une autre machine : rangé dans kart.net (appliqué pas à pas par remoteKart.js).
export function applyKartStates(world, entries) {
  if (!world || !Array.isArray(entries)) return
  for (const entry of entries) {
    const kart = world.kartsById.get(entry[0])
    if (!kart?.remote) continue
    const target = (kart.net ??= { age: 0 })
    FIELDS.forEach((field, index) => {
      target[field] = entry[index + 1]
    })
    target.boostSource = target.boost > 0 ? BOOST_SOURCES[target.boost - 1] : null
    target.age = 0
  }
}
