import { PALETTE } from '../World/palette'

// Attitude et couleur de chaque pièce d'une case à objets (aucune allocation) : le cube flotte
// et tourne, penché sur un coin ; sa teinte irisée glisse lentement (arêtes plus claires que le
// verre) ; le point d'interrogation tourne en sens inverse et pulse. Une case dorée est plus
// grosse, or et blanc. Prise : la case disparaît puis regrossit à sa réapparition (0,4 s).
const GROW = 0.4
const TILT = 0.62

function base(box, time, out) {
  const grow = box.active ? 1 : Math.max(0, 1 - box.timer / GROW)
  out.visible = box.active || box.timer < GROW
  out.y = 1.15 + Math.sin(time * 2.2 + box.x) * 0.14
  out.scale = grow * (box.lucky ? 1.2 : 1)
  return grow
}

function hue(box, time, out, saturation, lightness) {
  if (box.lucky) out.color.set(PALETTE.yellow)
  else out.color.setHSL((time * 0.12 + box.x * 0.013 + box.z * 0.007) % 1, saturation, lightness)
}

export function writeGlass(box, time, out) {
  base(box, time, out)
  out.yaw = time * 1.1 + box.z
  out.tilt = TILT
  hue(box, time, out, 1, 0.55)
}

export function writeFrame(box, time, out) {
  writeGlass(box, time, out)
  hue(box, time + 0.8, out, 1, 0.72)
}

export function writeGlyph(box, time, out) {
  base(box, time, out)
  out.yaw = -time * 1.6 + box.x
  out.scale *= 1.25 + 0.08 * Math.sin(time * 5 + box.x)
  out.color.set(box.lucky ? '#fff3b0' : '#ffffff')
}

export function writeHalo(box, time, out) {
  const grow = base(box, time, out)
  out.y = 0.05
  out.yaw = 0
  out.scale = grow * (box.lucky ? 1.35 : 1) * (0.92 + 0.08 * Math.sin(time * 3 + box.x))
  hue(box, time, out, 0.85, 0.5)
}
