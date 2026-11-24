//! Configuration du serveur, lue dans l'environnement (valeurs par defaut sinon).

pub struct ServerConfig {
    pub port: u16,
    /// Frequence de simulation (Hz) : meme pas fixe que le client (RACE.step = 1/120 s).
    pub tick_rate: u32,
}

impl ServerConfig {
    pub fn from_env() -> Self {
        let port = std::env::var("SMKW_PORT").ok().and_then(|value| value.parse().ok()).unwrap_or(2567);
        Self { port, tick_rate: 120 }
    }
}
