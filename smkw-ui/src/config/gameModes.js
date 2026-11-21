// Définition des modes de jeu : unique source de vérité pour le menu et les futurs systèmes.
// Ajouter un mode = ajouter une entrée ici, ses textes dans src/locales/*.json
// (modes.<id>.name / modes.<id>.description) et son visuel dans components/menu/modeVisuals.js.

export const MAX_LOCAL_PLAYERS = 8
export const MAX_ONLINE_PLAYERS = 32

export const PLAY_TYPES = Object.freeze({
  LOCAL: 'local',
  ONLINE: 'online',
})

export const PLAY_TYPE_LIMITS = Object.freeze({
  [PLAY_TYPES.LOCAL]: MAX_LOCAL_PLAYERS,
  [PLAY_TYPES.ONLINE]: MAX_ONLINE_PLAYERS,
})

// players.<type> : nombre maximum de joueurs (0 = type non disponible pour ce mode).
// Les limites sont toujours plafonnées par PLAY_TYPE_LIMITS.
// tracks : le mode se court sur un circuit (choix de la coupe et du circuit, config/cups.js).
// bots : des pilotes ordinateur complètent le peloton (config/race.js : fieldSize).
export const GAME_MODES = Object.freeze([
  {
    id: 'race',
    players: { local: MAX_LOCAL_PLAYERS, online: MAX_ONLINE_PLAYERS },
    teams: false,
    tracks: true,
    bots: true,
  },
  {
    id: 'timeTrial',
    // Contre-la-montre : solo face au chrono, sans adversaire ni partie en ligne.
    players: { local: 1, online: 0 },
    teams: false,
    tracks: true,
    bots: false,
  },
  {
    id: 'battle',
    players: { local: MAX_LOCAL_PLAYERS, online: MAX_ONLINE_PLAYERS },
    teams: false,
  },
  {
    id: 'rocketGol',
    players: { local: MAX_LOCAL_PLAYERS, online: MAX_ONLINE_PLAYERS },
    teams: true,
  },
])

export const ROOM_CODE_LENGTH = 6
