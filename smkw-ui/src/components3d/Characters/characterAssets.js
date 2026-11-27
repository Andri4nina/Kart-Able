import marloUrl from '../../assets/models/Character/animated_lowpoly_character.glb'
import pyroxUrl from '../../assets/models/Character/fire_lowpoly.glb'
import mitsuUrl from '../../assets/models/Character/free_-_toy_cat.glb'
import gibusUrl from '../../assets/models/Character/gentle_stickman.glb'
import dieselUrl from '../../assets/models/Character/lowpoly_biker.glb'
import tempoUrl from '../../assets/models/Character/lowpoly_character_-_dancing.glb'
import kosmoUrl from '../../assets/models/Character/michi_bot.glb'
import timoUrl from '../../assets/models/Character/mini_chibi_kid_free_demo.glb'
import zenjiUrl from '../../assets/models/Character/mini_chibi_master_free_demo.glb'
import rubisUrl from '../../assets/models/Character/my_first_attempt.glb'
import pomponUrl from '../../assets/models/Character/piggy_6.glb'
import friskoUrl from '../../assets/models/Character/popsicles_penguim.glb'
import noxUrl from '../../assets/models/Character/puro_plushie.glb'
import voltUrl from '../../assets/models/Character/robot.glb'
import ossoUrl from '../../assets/models/Character/skeleton.glb'
import miellaUrl from '../../assets/models/Character/smol_ame_bee.glb'

import steevUrl from '../../assets/models/Character/steev.glb'
import imposterUrl from '../../assets/models/Character/imposter.glb'
import ninoUrl from '../../assets/models/Character/ninja.glb'

// Modèles GLB des personnages (exports Sketchfab, échelles d'origine très différentes : chaque
// modèle est ramené à la hauteur de son gabarit, voir prepareCharacter.js).
// - yaw     : quart de tour pour que le personnage regarde +Z ;
// - clip    : animation utilisée pour la pose (première image) ; `loop` la joue en boucle ;
// - tint    : modèle sans couleur, teinté à la couleur du personnage ;
// - portrait: [centre, hauteur] du cadrage du visage, en fraction de la hauteur du modèle ;
// - driverPose: false si le squelette ne se prête pas à la pose assise automatique (driverPose.js).
// Vérifier la licence de chaque modèle avant publication.
const HUMAN = [0.82, 0.42]
const CHIBI = [0.65, 0.8]
const ROUND = [0.6, 0.86]

const CHARACTER_ASSETS = {
  diesel: { url: dieselUrl, clip: 'man_walking', portrait: HUMAN },
  marlo: { url: marloUrl, clip: 'AIdle', loop: true, portrait: HUMAN },
  timo: { url: timoUrl, clip: 'Idle 01', loop: true, portrait: CHIBI },
  pyrox: { url: pyroxUrl, portrait: ROUND },
  // Squelette aux proportions d'os atypiques (cuisse minuscule, orteils vers le haut) : garde son animation.
  osso: { url: ossoUrl, clip: 'Take 001', loop: true, portrait: [0.7, 0.68], driverPose: false },
  rubis: { url: rubisUrl, portrait: HUMAN },
  mitsu: { url: mitsuUrl, yaw: Math.PI / 2, portrait: [0.86, 0.34] },
  volt: { url: voltUrl, yaw: Math.PI / 2, portrait: [0.68, 0.66] },
  gibus: { url: gibusUrl, clip: 'Idle', loop: true, portrait: [0.74, 0.5] },
  tempo: { url: tempoUrl, clip: 'mixamo.com', tint: true, portrait: [0.74, 0.6] },
  frisko: { url: friskoUrl, portrait: ROUND },
  kosmo: { url: kosmoUrl, clip: 'Take 001', loop: true, portrait: ROUND },
  nox: { url: noxUrl, portrait: CHIBI },
  zenji: { url: zenjiUrl, portrait: CHIBI },
  pompon: { url: pomponUrl, clip: 'Action', portrait: CHIBI },
  miella: { url: miellaUrl, portrait: CHIBI },

  // Squelette Quaternius (pieds en IK, hors de la chaîne des jambes : driverPose les rattache).
  nino: { url: ninoUrl, clip: 'CharacterArmature|Idle', loop: true, portrait: CHIBI },
  steev: { url: steevUrl, yaw: Math.PI / 2, portrait: [0.68, 0.66] },
  imposter: { url: imposterUrl, yaw: Math.PI / 2, portrait: CHIBI },
}

// Hauteur d'un personnage de gabarit « grand » (les autres à l'échelle de leur gabarit) :
// sur son socle à la sélection, et au volant (kart de 2 unités de long).
export const CHARACTER_HEIGHTS = Object.freeze({ preview: 1.65, driver: 1 })

// Pilote au squelette posé assis : hauteur du bassin au-dessus de la place des pieds du siège
// (vehicleAssets `seat`), en unités de la scène.
export const DRIVER_PELVIS_LIFT = 0.16

// Les modèles se chargent via PortraitStudio dès l'écran des joueurs locaux (cache useGLTF).
export function getCharacterAsset(characterId) {
  return CHARACTER_ASSETS[characterId] ?? null
}
