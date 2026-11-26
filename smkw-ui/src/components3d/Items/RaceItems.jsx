import { ITEM_BOXES, ITEMS } from '../../config/items'
import { writeFakeGlass, writeFakeGlyph, writeFrame, writeGlass, writeGlyph, writeHalo } from './boxPose'
import { ItemInstances } from './ItemInstances'
import { ITEM_GEOMETRIES, ITEM_MATERIALS } from './itemResources'

// Objets de la course en 3D : cases à objets (cube de verre prismatique, arêtes, point
// d'interrogation, halo au sol : boxPose.js ; dorées au hasard), pièges posés ou tenus (flaque
// d'huile, fausse case), projectiles (orbes à la couleur de l'objet, comète en vol). Lus dans le
// monde de course (game/items) ; rien ici ne décide du jeu.
const BOX_CAPACITY = 64
const HAZARD_CAPACITY = 48
const PROJECTILE_CAPACITY = 24
const PROJECTILE_SIZE = { comet: 1.7, bounceOrb: 0.9 }

const boxes = (world) => world.items.boxes
const hazards = (world) => world.items.hazards
const projectiles = (world) => world.items.projectiles

function writeSlick(entry, _time, out) {
  out.visible = entry.ttl > 0 && entry.itemId === 'oilSlick'
  out.y = entry.held ? 0.3 : 0.06
  out.yaw = entry.x
  out.scale = entry.held ? 0.55 : Math.min(1, entry.age * 6)
}

function writeProjectile(entry, time, out) {
  out.visible = entry.ttl > 0
  out.y = entry.mode === 'leader' ? 0.6 + entry.y : entry.held ? 0.35 : 0.55
  out.yaw = time * 8
  out.tilt = entry.mode === 'leader' ? time * 5 : 0
  out.scale = (PROJECTILE_SIZE[entry.itemId] ?? 1) * (entry.held ? 0.6 : 1)
  out.color.set(ITEMS[entry.itemId]?.color ?? '#ffffff')
}

// Ordre de rendu : le point d'interrogation (opaque) avant le verre translucide qui l'entoure.
const BOX_PARTS = [
  ['glyphs', 'boxGlyph', writeGlyph, boxes],
  ['fake-glyphs', 'boxGlyph', writeFakeGlyph, hazards],
  ['frames', 'boxFrame', writeFrame, boxes],
  ['glass', 'boxGlass', writeGlass, boxes],
  ['fake-glass', 'boxGlass', writeFakeGlass, hazards],
  ['halos', 'boxHalo', writeHalo, boxes],
]

export function RaceItems() {
  return (
    <group name="race-items" userData={{ boxRadius: ITEM_BOXES.radius }}>
      {BOX_PARTS.map(([name, key, write, pool]) => (
        <ItemInstances key={name} name={`item-box-${name}`} geometry={ITEM_GEOMETRIES[key]} material={ITEM_MATERIALS[key]} capacity={pool === boxes ? BOX_CAPACITY : HAZARD_CAPACITY} pool={pool} write={write} colored />
      ))}
      <ItemInstances name="item-hazards" geometry={ITEM_GEOMETRIES.slick} material={ITEM_MATERIALS.slick} capacity={HAZARD_CAPACITY} pool={hazards} write={writeSlick} />
      <ItemInstances name="item-projectiles" geometry={ITEM_GEOMETRIES.orb} material={ITEM_MATERIALS.orb} capacity={PROJECTILE_CAPACITY} pool={projectiles} write={writeProjectile} colored />
    </group>
  )
}
