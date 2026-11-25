import { PALETTE } from '../World/palette'

// Attitude et couleur de chaque pièce d'une case à objets (aucune allocation) : elle flotte,
// tourne, change lentement de teinte (cristal) ; une case dorée est plus grosse, or et blanc.
// Prise : la case disparaît puis regrossit à sa réapparition (0,4 s).
const GROW = 0.4

function base(box, time, out) {
  const grow = box.active ? 1 : Math.max(0, 1 - box.timer / GROW)
  out.visible = box.active || box.timer < GROW
  out.y = 1.05 + Math.sin(time * 2.2 + box.x) * 0.14
  out.scale = grow * (box.lucky ? 1.2 : 1)
  return grow
}

function hue(box, time, out, lightness) {
  if (box.lucky) out.color.set(PALETTE.yellow)
  else out.color.setHSL((time * 0.12 + box.x * 0.013 + box.z * 0.007) % 1, 0.85, lightness)
}

export function writeShell(box, time, out) {
  base(box, time, out)
  out.yaw = time * 0.9 + box.z
  out.tilt = 0.35
  hue(box, time, out, 0.6)
}

export function writeCore(box, time, out) {
  base(box, time, out)
  out.yaw = -time * 2.4
  out.scale *= 0.9 + 0.15 * Math.sin(time * 6 + box.x)
  out.color.set(box.lucky ? '#fff3b0' : '#ffffff')
}

export function writeRing(box, time, out) {
  base(box, time, out)
  out.yaw = time * 1.7 + box.x
  out.tilt = 1.2 + Math.sin(time * 1.3 + box.z) * 0.25
  hue(box, time + 2, out, 0.6)
}

export function writeHalo(box, time, out) {
  const grow = base(box, time, out)
  out.y = 0.05
  out.yaw = 0
  out.scale = grow * (box.lucky ? 1.35 : 1) * (0.92 + 0.08 * Math.sin(time * 3 + box.x))
  hue(box, time, out, 0.5)
}
