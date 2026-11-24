// Palette 3D de l'identité visuelle (couleurs pleines, flat shading, aucune texture).
export const PALETTE = Object.freeze({
  sky: '#8ccff2',
  grass: '#7cc46a',
  gridCell: '#6db35c',
  gridSection: '#5b9f4b',
  asphalt: '#2f3440',
  red: '#e63946',
  yellow: '#ffc93c',
  orange: '#ff7a1a',
  blue: '#3aa0ff',
  purple: '#c45cff',
  white: '#f5f7fa',
  rubber: '#23262d',
  hemiSky: '#eaf6ff',
  hemiGround: '#6a9a55',
})

// Mêmes valeurs que les tokens Tailwind class-* et player-* (index.css).
export const CLASS_COLORS = Object.freeze({
  tank: '#2f80ed',
  standard: '#2bb673',
  speed: '#e63946',
  special: '#8e5cf7',
})

export const PLAYER_COLORS = Object.freeze(['#e63946', '#2f80ed', '#ffc93c', '#2bb673', '#ff7a1a', '#8e5cf7', '#ff5fa2', '#19c3c3'])

// Teinte de l'objet vitrine selon le mode choisi dans le menu (mêmes accents que les cartes).
export const MODE_COLORS = Object.freeze({
  race: '#e63946',
  timeTrial: '#ffc93c',
  battle: '#ff7a1a',
  rocketGol: '#2f80ed',
})
