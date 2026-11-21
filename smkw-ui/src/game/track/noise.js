// Hasard déterministe pour la génération procédurale : même graine, même circuit, sur toutes
// les machines (indispensable en réseau). Calcul pur.

// Générateur pseudo-aléatoire (mulberry32) : renvoie une fonction () => [0, 1[.
export function createRandom(seed) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Valeur pseudo-aléatoire fixe d'un point entier de la grille.
function hash(ix, iz, seed) {
  let h = Math.imul(ix, 374761393) + Math.imul(iz, 668265263) + Math.imul(seed, 2147483647)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

// Bruit de valeur lissé, dans [0, 1].
export function valueNoise(x, z, seed) {
  const ix = Math.floor(x)
  const iz = Math.floor(z)
  const fx = x - ix
  const fz = z - iz
  const ux = fx * fx * (3 - 2 * fx)
  const uz = fz * fz * (3 - 2 * fz)
  const a = hash(ix, iz, seed)
  const b = hash(ix + 1, iz, seed)
  const c = hash(ix, iz + 1, seed)
  const d = hash(ix + 1, iz + 1, seed)
  return a + (b - a) * ux + (c - a) * uz + (a - b - c + d) * ux * uz
}

// Somme d'octaves (fbm) : détails fins sur de grandes formes, dans [0, 1].
export function fractalNoise(x, z, seed, octaves = 3) {
  let total = 0
  let amplitude = 1
  let frequency = 1
  let norm = 0
  for (let octave = 0; octave < octaves; octave += 1) {
    total += valueNoise(x * frequency, z * frequency, seed + octave * 17) * amplitude
    norm += amplitude
    amplitude *= 0.5
    frequency *= 2
  }
  return total / norm
}
