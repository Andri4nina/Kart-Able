// Bosses et creux d'un circuit (calcul pur, une fois par circuit), d'après config/tracks.js :
// - bumps : [fraction du tour, longueur m, amplitude m, longueur d'onde m ?] : la route ondule
//   (bosse puis creux, en alternance) ; prise vite, une bosse fait décoller (kartVertical.js).
// Modifie `path.y` (avant le calcul du relief), en fondu aux deux bouts : pas de marche.
export const BUMP_WAVE = 30

const smooth = (t) => t * t * (3 - 2 * t)

export function applyBumps(track, path) {
  for (const [fraction, length, amplitude, wave = BUMP_WAVE] of track.bumps ?? []) {
    const first = Math.floor((fraction * path.length) / path.step)
    const steps = Math.round(length / path.step)
    for (let k = 0; k <= steps; k += 1) {
      const d = k * path.step
      const fade = smooth(Math.max(0, Math.min(1, d / (wave / 2), (length - d) / (wave / 2))))
      path.y[(first + k) % path.count] += amplitude * Math.sin((2 * Math.PI * d) / wave) * fade
    }
  }
}
