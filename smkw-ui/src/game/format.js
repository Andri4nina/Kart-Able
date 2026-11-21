// Formatage pur, sans dépendance React ni Three.

export function formatRaceTime(seconds) {
  const totalMs = Math.max(0, Math.floor(seconds * 1000))
  const minutes = Math.floor(totalMs / 60000)
  const secs = Math.floor((totalMs % 60000) / 1000)
  const ms = totalMs % 1000
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`
}

const ORDINAL_SUFFIXES = { 1: 'st', 2: 'nd', 3: 'rd' }

export function ordinalSuffix(n) {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return 'th'
  return ORDINAL_SUFFIXES[n % 10] ?? 'th'
}
