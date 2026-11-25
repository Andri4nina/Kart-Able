import { ITEM_BOXES } from '../../config/items'
import { writeCore, writeHalo, writeRing, writeShell } from './boxPose'
import { ItemInstances } from './ItemInstances'
import { ITEM_GEOMETRIES, ITEM_MATERIALS } from './itemResources'

// Objets de la course en 3D : cases à objets (cristal, cœur, anneau, halo au sol : boxPose.js ;
// dorées au hasard), flaques d'huile posées, orbes lancés. Lus dans le monde de course
// (game/items) ; rien ici ne décide du jeu.
const BOX_CAPACITY = 64
const HAZARD_CAPACITY = 48
const PROJECTILE_CAPACITY = 24

const boxes = (world) => world.items.boxes
const hazards = (world) => world.items.hazards
const projectiles = (world) => world.items.projectiles

function writeHazard(entry, _time, out) {
  out.visible = entry.ttl > 0
  out.y = 0.06
  out.yaw = entry.x
  out.scale = Math.min(1, entry.age * 6)
}

function writeProjectile(entry, time, out) {
  out.visible = entry.ttl > 0
  out.y = 0.55
  out.yaw = time * 8
  out.scale = 1
}

const BOX_PARTS = [
  ['shells', 'boxShell', writeShell],
  ['cores', 'boxCore', writeCore],
  ['rings', 'boxRing', writeRing],
  ['halos', 'boxHalo', writeHalo],
]

export function RaceItems() {
  return (
    <group name="race-items" userData={{ boxRadius: ITEM_BOXES.radius }}>
      {BOX_PARTS.map(([name, key, write]) => (
        <ItemInstances key={name} name={`item-box-${name}`} geometry={ITEM_GEOMETRIES[key]} material={ITEM_MATERIALS[key]} capacity={BOX_CAPACITY} pool={boxes} write={write} colored />
      ))}
      <ItemInstances name="item-hazards" geometry={ITEM_GEOMETRIES.slick} material={ITEM_MATERIALS.slick} capacity={HAZARD_CAPACITY} pool={hazards} write={writeHazard} />
      <ItemInstances name="item-projectiles" geometry={ITEM_GEOMETRIES.orb} material={ITEM_MATERIALS.orb} capacity={PROJECTILE_CAPACITY} pool={projectiles} write={writeProjectile} />
    </group>
  )
}
