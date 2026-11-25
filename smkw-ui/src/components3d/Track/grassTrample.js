import { DataTexture, LinearFilter, RedFormat, UnsignedByteType } from 'three'

// Herbe écrasée : carte vue de dessus (même emprise que la texture du circuit) où chaque kart
// marque son passage ; l'herbe s'y couche (shader de grassField.js) puis se relève peu à peu.
// Purement visuel, mise à jour au CPU (petite texture 8 bits, envoyée au plus tous les
// STAMP_INTERVAL s).
const RESOLUTION = 512
const RECOVERY = 6 // unités (sur 255) regagnées par seconde : ~40 s pour se relever
const STAMP_INTERVAL = 1 / 20
const HEAL_INTERVAL = 0.5 // s entre deux passes de repousse (parcours de toute la carte)
const WHEELS = [[-0.55, -0.8], [0.55, -0.8], [-0.55, 0.7], [0.55, 0.7]]

export function createTrampleMap(field) {
  const data = new Uint8Array(RESOLUTION * RESOLUTION)
  const texture = new DataTexture(data, RESOLUTION, RESOLUTION, RedFormat, UnsignedByteType)
  texture.magFilter = LinearFilter
  texture.minFilter = LinearFilter
  texture.needsUpdate = true
  return { texture, data, origin: field.origin, size: field.size, timer: 0, healTimer: 0, recovery: 0, race: null }
}

function stamp(map, x, z) {
  const column = Math.floor(((x - map.origin[0]) / map.size) * RESOLUTION)
  const row = Math.floor(((z - map.origin[1]) / map.size) * RESOLUTION)
  if (column < 0 || row < 0 || column >= RESOLUTION || row >= RESOLUTION) return
  map.data[row * RESOLUTION + column] = 255
}

// Une frame : marque les roues des karts au sol ; relève l'herbe. `world` peut être null.
export function updateTrampleMap(map, world, dt) {
  if (world !== map.race) {
    map.race = world
    map.data.fill(0)
  }
  map.timer += dt
  if (map.timer < STAMP_INTERVAL) return
  const elapsed = map.timer
  map.timer = 0
  map.recovery += RECOVERY * elapsed
  map.healTimer += elapsed
  const heal = map.healTimer >= HEAL_INTERVAL ? Math.floor(map.recovery) : 0
  if (heal > 0) {
    map.healTimer = 0
    map.recovery -= heal
    const { data } = map
    for (let i = 0; i < data.length; i += 1) if (data[i]) data[i] = data[i] > heal ? data[i] - heal : 0
  }
  if (world) {
    for (const kart of world.karts) {
      if (kart.sinking > 0 || kart.airborne || Math.abs(kart.speed) < 0.5) continue
      const cos = Math.cos(kart.yaw)
      const sin = Math.sin(kart.yaw)
      for (const [lx, lz] of WHEELS) stamp(map, kart.x + lx * cos + lz * sin, kart.z - lx * sin + lz * cos)
    }
  }
  map.texture.needsUpdate = true
}
