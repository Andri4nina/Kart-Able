// Horloge commune des shaders du circuit (vagues, herbe au vent) : un seul uniform partagé,
// avancé une fois par frame par TrackWorld (fixe en mouvement réduit).
export const trackTime = { value: 0 }
