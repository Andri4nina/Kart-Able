// Rythme des pilotes : un bot loin devant le meilleur joueur ralentit un peu, loin derrière il
// accélère un peu (course serrée). Après l'arrivée, le pilote automatique roule tranquillement.
export function updatePace(world) {
  let lead = -Infinity
  for (const kart of world.humans) lead = Math.max(lead, kart.finished ? Infinity : kart.raceDistance)
  for (const kart of world.karts) {
    if (!kart.isBot) kart.topFactor = kart.finished ? 0.85 : kart.autopilot ? 0.97 : 1
    else if (Number.isFinite(lead)) kart.topFactor = kart.skill * Math.min(1.07, Math.max(0.93, 1 - (kart.raceDistance - lead) / 2500))
    else kart.topFactor = kart.skill
  }
}
