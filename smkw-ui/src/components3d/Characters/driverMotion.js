import { MathUtils } from 'three'
import { addBoneTurn, createBoneMotion } from './boneMotion'

// Vie du pilote, ajoutée aux poses clés de driverRig (buste et tête seulement) :
// - à l'arrêt : il respire et regarde autour de lui ;
// - en roulant : buste penché avec la vitesse, tête qui vibre avec le moteur ;
// - turbo : plaqué en arrière ; drift : buste et tête penchés vers l'intérieur ;
// - en l'air : tête qui regarde en bas ; choc : tête secouée ; arrivée : il se balance.
// Mouvement réduit : seulement les inclinaisons (aucune oscillation).
export function createDriverMotion(root, rig) {
  const spine = createBoneMotion(root, rig.spine)
  const head = createBoneMotion(root, rig.head)
  const state = { time: 0, speed: 0, boost: 0, drift: 0, air: 0 }

  // `input` : { speed 0..1, boost 0/1, drift -1..1, air 0/1, cheer, panic } ; `blend` : poses amorties.
  function apply(input, blend, delta, reducedMotion) {
    state.time += reducedMotion ? 0 : delta
    state.speed = MathUtils.damp(state.speed, input.speed ?? 0, 4, delta)
    state.boost = MathUtils.damp(state.boost, input.boost ?? 0, 6, delta)
    state.drift = MathUtils.damp(state.drift, input.drift ?? 0, 6, delta)
    state.air = MathUtils.damp(state.air, input.air ?? 0, 10, delta)
    const t = state.time
    const still = 1 - Math.min(1, state.speed * 4)
    const wave = reducedMotion ? 0 : 1

    const breath = Math.sin(t * 2.1) * 0.03 * wave
    const cheerSway = Math.sin(t * 7) * 0.12 * blend.cheer * wave
    addBoneTurn(spine, 0.1 * state.speed - 0.16 * state.boost + breath, cheerSway * 0.5, state.drift * 0.14 + cheerSway)

    const look = Math.sin(t * 0.7) * 0.45 * still * wave
    const engine = Math.sin(t * 31) * 0.02 * state.speed * wave
    const shake = Math.sin(t * 24) * 0.3 * blend.panic * wave
    addBoneTurn(head, 0.16 * state.air + engine - breath * 0.5, look + shake, -state.drift * 0.18)
  }

  return { apply }
}
