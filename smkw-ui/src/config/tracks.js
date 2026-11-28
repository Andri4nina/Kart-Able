import { CANYON_TRACKS } from './trackData/canyonCup'
import { DUET_TRACKS } from './trackData/duetCup'
import { DUST_TRACKS } from './trackData/dustCup'
import { FORMULA_TRACKS } from './trackData/formulaCup'
import { FROST_TRACKS } from './trackData/frostCup'
import { KAIROS_TRACKS } from './trackData/kairosCup'
import { PAX_TRACKS } from './trackData/paxCup'
import { SUMMIT_TRACKS } from './trackData/summitCup'
import { WATER_TRACKS } from './trackData/waterCup'

// Circuits : unique source de vérité. Un circuit n'est qu'une poignée de données ; la route, le
// terrain, l'eau, la végétation et le décor en sont générés (game/track, components3d/Track).
// - path  : points de contrôle [x, z, largeur, hauteur?] en mètres, boucle fermée dans le sens
//           de course ; le premier point est la ligne de départ / arrivée (précédée d'une ligne
//           droite pour la grille de 32 karts). La hauteur (0 par défaut) crée montées et
//           descentes ; garder la grille de départ à plat et la route à 0 près de l'eau (~70 m) ;
// - hills : amplitude (m) des collines du paysage autour de la route (0 par défaut) ;
// - itemRows : fractions du tour des rangées de cases à objets (config/items.js sinon) ;
// - pads : [fraction, position latérale -1..1] : pads d'accélération (BOOSTS.pad) ;
// - obstacles : [fraction, position latérale -1..1, rayon ?] : rochers sur la route ;
// - ramps : [fraction, position latérale -1..1, largeur m ?] : tremplins à figures ;
// - gliders : [fraction, longueur m] : rampe de vol puis brèche au-dessus de l'eau, franchie en
//   deltaplane (game/track/trackJumps.js) ; sur une ligne droite, route à hauteur 0 ;
// - splits : [fraction, longueur m, largeur m, style ?] : embranchement, séparation centrale
//   (herbe, haie, muret, canal, rochers) entre deux voies (game/track/trackSplits.js) ; élargir la
//   route (points de contrôle) à cet endroit ;
// - crossings : [fraction, longueur m] : les deux voies échangent leurs côtés, l'une sur un pont,
//   l'autre dans une tranchée dessous (game/track/trackCrossings.js) ; route large, hauteur 0 ;
// - waterways : [fraction, longueur m] : voie d'eau, les karts y flottent et glissent
//   (game/track/trackWaterways.js) ; route à hauteur 0 ;
// - dives : [fraction, longueur m, profondeur m] : la route plonge sous un lagon et y roule
//   (game/track/trackDives.js) ; route à hauteur 0 autour ;
// - bumps : [fraction, longueur m, amplitude m, longueur d'onde m ?] : bosses et creux de la
//   route, qui font décoller (game/track/trackBumps.js) ;
// - rockfalls : [fraction, longueur m, nombre ?] : éboulements, rochers qui tombent sur la route
//   puis y restent un moment (game/track/trackRockfalls.js) ;
// - lakes : plans d'eau elliptiques { x, z, rx, rz, angle } ; un lac à moins de 8 m du bord
//           ouvre la barrière : on peut y tomber (game/track/trackFences.js) ;
// - theme : ambiance (config/trackThemes.js) ; seed : graine du placement de la végétation.
// Dessinés pour le défi avec 32 karts, puis agrandis (TRACK_SCALE) pour laisser de la place aux
// dépassements : grille de départ à 26 m de large, sections techniques à 17-20 m, épingles et
// chicanes, eau au bord de certains virages, rochers et pads qui imposent un choix de
// trajectoire. Contrôle : measureTrackClearance (game/track/trackGeometry.js).
// Les valeurs ci-dessous sont avant mise à l'échelle (positions, largeurs, hauteurs, lacs).
// Textes : tracks.<id>.name et tracks.<id>.description.

// Données des circuits : config/trackData/<coupe>.js (une liste par coupe).
const TRACK_DEFINITIONS = [...KAIROS_TRACKS, ...SUMMIT_TRACKS, ...FROST_TRACKS, ...DUST_TRACKS, ...PAX_TRACKS, ...DUET_TRACKS, ...WATER_TRACKS, ...CANYON_TRACKS, ...FORMULA_TRACKS]

// Mise à l'échelle de tous les circuits : positions (et lacs) x size, largeurs x width,
// hauteurs x height (les pentes restent du même ordre sur des distances plus longues).
export const TRACK_SCALE = Object.freeze({ size: 1.5, width: 1.3, height: 1.3 })

function scaleTrack(track) {
  const { size, width, height } = TRACK_SCALE
  return Object.freeze({
    ...track,
    path: track.path.map(([x, z, w, y = 0]) => [x * size, z * size, w * width, y * height]),
    lakes: track.lakes.map((lake) => ({ ...lake, x: lake.x * size, z: lake.z * size, rx: lake.rx * size, rz: lake.rz * size })),
  })
}

export const TRACKS = Object.freeze(TRACK_DEFINITIONS.map(scaleTrack))

export const TRACK_IDS = Object.freeze(TRACKS.map((track) => track.id))

export function getTrack(trackId) {
  return TRACKS.find((track) => track.id === trackId) ?? null
}
