//! Serveur de jeu autoritaire de Kart Able (code SMKW).
//!
//! Squelette seulement : le multijoueur arrive dans sa propre phase (voir docs/ARCHITECTURE.md).
//! Le serveur reprendra la simulation pure du client (smkw-ui/src/game/race : pas fixe 1/120 s,
//! reglages de config/kartTuning.js) pour rester coherent avec la prediction cote client.

mod config;

fn main() {
    let config = config::ServerConfig::from_env();
    println!(
        "smkw-api {} : squelette (aucune room). Port prevu : {}, tick : {} Hz.",
        env!("CARGO_PKG_VERSION"),
        config.port,
        config.tick_rate
    );
}
