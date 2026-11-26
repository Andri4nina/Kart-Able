// Drift des pilotes ordinateur (calcul pur, aucune allocation), mêmes règles que les joueurs
// (game/race/kartDrift.js) : ils sautent à l'approche d'un virage marqué, braquent vers
// l'intérieur pendant le saut pour fixer le sens, laissent le pilotage normal doser l'arc
// (braquer dedans resserre, dehors élargit), puis relâchent à la sortie du virage pour
// prendre leur mini-turbo. Les meilleurs pilotes tiennent jusqu'au palier orange.
// `turnAhead` : virage restant du tracé (rad, différence de cap de la route entre le kart et un
// point lointain ; > 0 : virage à gauche), indépendant de l'orientation du kart (qui pivote en drift).
const START_ERROR = 0.5 // virage assez marqué pour lancer un drift
const END_ERROR = 0.15 // virage terminé : relâcher
const OFF_ROAD_GRACE = 0.4 // s hors-piste tolérées avant de relâcher
const OVERTURN = 0.75 // braquage vers l'extérieur au-delà duquel le kart tourne trop
const OVERTURN_GRACE = 0.35 // s de survirage tolérées
const TURN_IN = 0.35 // braquage vers l'intérieur nécessaire pour lancer le drift
const MIN_SPEED = 0.62 // fraction de la vitesse max pour tenter un drift
const MAX_HOLD = 4 // s au plus
const PATIENCE = 2.4 // s : virage fini sans turbo, on garde encore le drift pour le palier bleu
const EXPERT_SKILL = 0.93 // à partir de ce niveau, vise le palier orange

export function applyBotDrift(kart, out, turnAhead, dt) {
  const farError = turnAhead
  const cornerSide = -Math.sign(farError) // sens de braquage du virage (steer > 0 = droite)
  if (!kart.driftDir && kart.hop === 0) {
    // Prêt à lancer : virage marqué devant, assez vite, au sol, pas déjà en saut.
    // Le pilote braque déjà vers l'intérieur du virage (il est dedans, pas encore en approche).
    const turning = Math.sign(out.steer) === cornerSide && Math.abs(out.steer) > TURN_IN
    const wants = Math.abs(farError) > START_ERROR && turning && kart.speed > kart.stats.maxSpeed * MIN_SPEED && !kart.airborne && !kart.offRoad
    out.drift = wants && !kart.driftHeld
    kart.botDriftTime = 0
    if (out.drift) out.steer = cornerSide * Math.max(0.6, Math.abs(out.steer))
    return
  }
  if (kart.hop > 0) {
    // En l'air : braquer franchement vers l'intérieur pour choisir le sens.
    out.drift = true
    out.steer = cornerSide * Math.max(0.6, Math.abs(out.steer))
    return
  }
  if (!kart.driftDir) {
    out.drift = false
    return
  }
  kart.botDriftTime += dt
  kart.botOffRoad = kart.offRoad ? kart.botOffRoad + dt : 0
  // Survirage : le pilotage normal demande de braquer fort vers l'extérieur (le drift fait
  // tourner plus que le virage) ; au-delà d'un instant, on relâche.
  kart.botOverturn = out.steer * kart.driftDir < -OVERTURN ? kart.botOverturn + dt : 0
  const goal = kart.skill >= EXPERT_SKILL ? 2 : 1
  const cornerDone = Math.abs(farError) < END_ERROR
  const wrongSide = cornerSide !== 0 && cornerSide !== kart.driftDir && Math.abs(farError) > START_ERROR * 0.6
  const charged = kart.driftTier >= 1
  const release =
    (cornerDone && (charged || kart.botDriftTime > PATIENCE)) ||
    (kart.driftTier >= goal && Math.abs(farError) < START_ERROR) ||
    (wrongSide && (charged || kart.botDriftTime > PATIENCE * 0.5)) ||
    kart.botOffRoad > OFF_ROAD_GRACE ||
    kart.botOverturn > OVERTURN_GRACE ||
    kart.botDriftTime > MAX_HOLD
  out.drift = !release
  // Jamais de frein pendant un drift (il l'annulerait) : on lève le pied à la place.
  out.brake = 0
}
