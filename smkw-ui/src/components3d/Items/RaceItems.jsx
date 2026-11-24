import { ITEM_BOXES } from '../../config/items'
import { ItemInstances } from './ItemInstances'
import { ITEM_GEOMETRIES, ITEM_MATERIALS } from './itemResources'

// Objets de la course en 3D : cases à objets (coque translucide et cœur qui tourne, qui
// regrossissent à leur réapparition), flaques d'huile posées, orbes lancés. Lus dans le monde
// de course (game/items) ; rien ici ne décide du jeu.
const BOX_CAPACITY = 64
const HAZARD_CAPACITY = 48
const PROJECTILE_CAPACITY = 24

const boxes = (world) => world.items.boxes
const hazards = (world) => world.items.hazards
const projectiles = (world) => world.items.projectiles

function writeShell(box, time, out) {
  const grow = box.active ? 1 : Math.max(0, 1 - box.timer / 0.4)
  out.visible = box.active || box.timer < 0.4
  out.y = 1 + Math.sin(time * 2 + box.x) * 0.12
  out.yaw = time * 0.9 + box.z
  out.scale = grow
}

function writeCore(box, time, out) {
  writeShell(box, time, out)
  out.yaw = -time * 2.2
}

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

export function RaceItems() {
  return (
    <group name="race-items" userData={{ boxRadius: ITEM_BOXES.radius }}>
      <ItemInstances name="item-box-shells" geometry={ITEM_GEOMETRIES.boxShell} material={ITEM_MATERIALS.boxShell} capacity={BOX_CAPACITY} pool={boxes} write={writeShell} />
      <ItemInstances name="item-box-cores" geometry={ITEM_GEOMETRIES.boxCore} material={ITEM_MATERIALS.boxCore} capacity={BOX_CAPACITY} pool={boxes} write={writeCore} />
      <ItemInstances name="item-hazards" geometry={ITEM_GEOMETRIES.slick} material={ITEM_MATERIALS.slick} capacity={HAZARD_CAPACITY} pool={hazards} write={writeHazard} />
      <ItemInstances name="item-projectiles" geometry={ITEM_GEOMETRIES.orb} material={ITEM_MATERIALS.orb} capacity={PROJECTILE_CAPACITY} pool={projectiles} write={writeProjectile} />
    </group>
  )
}
