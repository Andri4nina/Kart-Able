// Archétypes de pilotage, gabarits et personnages. Aucune donnée de jeu dans les composants :
// l'UI lit cette configuration, la sélection ne stocke qu'un characterId.
//
// Les statistiques d'archétype (sur 10, voir config/stats.js) sont des modificateurs de
// gameplay pour la phase physique : elles ne sont pas affichées à la sélection des personnages
// (les stats affichées sont celles des véhicules, en solo).
// Textes : clés i18n classes.<id>.*, sizes.<id>.* et characters.<id>.*

export const CHARACTER_CLASSES = Object.freeze({
  // Lourd et solide : pousse les autres, mais lent à lancer et à tourner. Vitesse de pointe
  // dans la moyenne (sans quoi il perd 2 s au tour sans compensation réelle).
  tank: {
    id: 'tank',
    stats: { topSpeed: 6, acceleration: 3, weight: 9, handling: 3, drift: 4, toughness: 9 },
    mechanic: null,
  },
  // Équilibré : aucun point faible, aucun point fort marqué.
  standard: {
    id: 'standard',
    stats: { topSpeed: 6, acceleration: 6, weight: 5, handling: 6, drift: 6, toughness: 5 },
    mechanic: null,
  },
  // Très rapide et excellent en drift, mais reprise lente, léger et nerveux.
  speed: {
    id: 'speed',
    stats: { topSpeed: 9, acceleration: 4, weight: 3, handling: 3, drift: 9, toughness: 3 },
    mechanic: null,
  },
  // Aéroglisseur : survole le hors-piste (aucun ralentissement) et ouvre d'autres trajectoires,
  // en échange d'une adhérence faible, d'un drift court et d'une grande fragilité aux chocs.
  // Total de statistiques le plus bas : sa force est la mécanique, pas les chiffres.
  special: {
    id: 'special',
    stats: { topSpeed: 6, acceleration: 7, weight: 2, handling: 4, drift: 3, toughness: 2 },
    mechanic: { id: 'hover', ignoresOffRoad: true },
  },
})

export const CLASS_ORDER = Object.freeze(['tank', 'standard', 'speed', 'special'])

// Gabarits : hauteur relative d'un personnage (1 = grand). Tous les modèles sont ramenés à la
// hauteur de leur gabarit, quelle que soit leur taille d'origine.
export const CHARACTER_SIZES = Object.freeze({
  small: { id: 'small', scale: 0.64 },
  medium: { id: 'medium', scale: 0.82 },
  large: { id: 'large', scale: 1 },
})

export const SIZE_ORDER = Object.freeze(['small', 'medium', 'large'])

// 16 personnages, 4 par archétype (une colonne du roster par archétype, ligne par ligne).
// `color` : identité colorée du personnage (peinture de son kart, fond de son portrait) ;
// mêmes valeurs que les tokens Tailwind char-* (index.css, vérifiés par check:rules).
export const ROSTER_COLUMNS = 4

export const CHARACTERS = Object.freeze([
  { id: 'diesel', classId: 'tank', size: 'large', color: '#b5651d' },
  { id: 'marlo', classId: 'standard', size: 'medium', color: '#7b4dff' },
  { id: 'timo', classId: 'speed', size: 'small', color: '#2bb673' },
  { id: 'pyrox', classId: 'special', size: 'large', color: '#ff6a13' },

  { id: 'osso', classId: 'tank', size: 'large', color: '#f2ede0' },
  { id: 'rubis', classId: 'standard', size: 'medium', color: '#e0115f' },
  { id: 'mitsu', classId: 'speed', size: 'small', color: '#b8a9ff' },
  { id: 'volt', classId: 'special', size: 'large', color: '#a3e635' },

  { id: 'gibus', classId: 'tank', size: 'large', color: '#7a1f3d' },
  { id: 'tempo', classId: 'standard', size: 'medium', color: '#ff3fa4' },
  { id: 'frisko', classId: 'speed', size: 'small', color: '#5ce1e6' },
  { id: 'kosmo', classId: 'special', size: 'medium', color: '#2f6fed' },

  { id: 'nox', classId: 'tank', size: 'medium', color: '#1f1f2b' },
  { id: 'zenji', classId: 'standard', size: 'small', color: '#0f8b8d' },
  { id: 'pompon', classId: 'speed', size: 'small', color: '#ff9ec4' },
  { id: 'miella', classId: 'special', size: 'small', color: '#ffc21a' },

  { id: 'nino', classId: 'speed', size: 'small', color: '#ff6a13' },
  { id: 'steev', classId: 'special', size: 'large', color: '#a3e635' },
  { id: 'imposter', classId: 'standard', size: 'medium', color: '#e0115f' },
])

export function getCharacter(characterId) {
  return CHARACTERS.find((character) => character.id === characterId) ?? null
}

export function getCharacterClass(characterId) {
  const character = getCharacter(characterId)
  return character ? CHARACTER_CLASSES[character.classId] : null
}

// Hauteur relative du gabarit du personnage (1 = grand), 1 par défaut.
export function getCharacterScale(characterId) {
  return CHARACTER_SIZES[getCharacter(characterId)?.size]?.scale ?? 1
}

export function getCharacterColor(characterId) {
  return getCharacter(characterId)?.color ?? null
}
