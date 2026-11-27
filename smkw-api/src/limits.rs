//! Limites du serveur, surtout utiles en ligne (serveur public sur Internet) : un client ou un
//! salon de trop est refuse proprement plutot que de saturer la machine.

/// Connexions simultanees au plus.
pub const MAX_CLIENTS: usize = 400;
/// Salons ouverts au plus.
pub const MAX_ROOMS: usize = 100;
/// Taille maximale d'un message (octets) : l'etat de 32 karts tient tres largement dedans.
pub const MAX_MESSAGE_BYTES: usize = 64 * 1024;
/// Intervalle des pings (s) : garde la connexion ouverte derriere les proxys des hebergeurs,
/// qui coupent une WebSocket silencieuse (salon en attente).
pub const PING_SECONDS: u64 = 20;
