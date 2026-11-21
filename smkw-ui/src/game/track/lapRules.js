// Règles de tours et de checkpoints (pures). Anti-raccourci : un tour ne compte que si toutes
// les portes ont été franchies dans l'ordre. Branchées sur le déplacement des karts en phase 2.
//
// Les karts partent derrière la porte 0 (ligne d'arrivée) : son premier franchissement lance
// le tour 1, chaque franchissement suivant (après toutes les autres portes) en ajoute un.

export function createLapProgress(gateCount) {
  return Object.freeze({ gateCount, nextGate: 0, lap: 0 })
}

// Franchissement d'une porte. `direction` : +1 dans le sens de course, -1 à contresens.
// Une porte hors d'ordre est ignorée ; repasser à l'envers la dernière porte validée l'annule.
export function crossGate(progress, gateIndex, direction = 1) {
  const { gateCount, nextGate, lap } = progress
  if (direction < 0) {
    const previous = (nextGate - 1 + gateCount) % gateCount
    if (gateIndex !== previous || lap === 0) return progress
    return Object.freeze({ gateCount, nextGate: previous, lap: previous === 0 ? lap - 1 : lap })
  }
  if (gateIndex !== nextGate) return progress
  return Object.freeze({ gateCount, nextGate: (nextGate + 1) % gateCount, lap: gateIndex === 0 ? lap + 1 : lap })
}

// Tour affiché (1 avant le premier franchissement) et course terminée.
export function getDisplayedLap(progress, laps) {
  return Math.min(laps, Math.max(1, progress.lap))
}

export function isRaceFinished(progress, laps) {
  return progress.lap > laps
}

// Le déplacement de a vers b franchit-il la porte ? Renvoie +1 (sens de course), -1 (contresens)
// ou 0. La porte est le segment centré sur (x, z), perpendiculaire à (tx, tz), de demi-largeur
// halfWidth.
export function getGateCrossing(gate, ax, az, bx, bz) {
  const along = (x, z) => (x - gate.x) * gate.tx + (z - gate.z) * gate.tz
  const before = along(ax, az)
  const after = along(bx, bz)
  if ((before < 0) === (after < 0) || before === after) return 0
  const f = before / (before - after)
  const crossX = ax + (bx - ax) * f
  const crossZ = az + (bz - az) * f
  const lateral = (crossX - gate.x) * -gate.tz + (crossZ - gate.z) * gate.tx
  if (Math.abs(lateral) > gate.halfWidth) return 0
  return after > before ? 1 : -1
}
