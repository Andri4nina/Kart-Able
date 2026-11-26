//! Configuration du serveur, lue dans l'environnement (valeurs par defaut sinon).

use std::path::PathBuf;

#[derive(Clone, Debug)]
pub struct ServerConfig {
    /// Port d'ecoute (toutes les interfaces : les autres machines du reseau local s'y connectent).
    pub port: u16,
    /// Dossier du jeu web compile (smkw-ui/dist) servi a la racine, ou None (WebSocket seul).
    pub web_dir: Option<PathBuf>,
}

pub const DEFAULT_PORT: u16 = 2567;

impl ServerConfig {
    pub fn from_env() -> Self {
        let port = std::env::var("SMKW_PORT").ok().and_then(|value| value.parse().ok()).unwrap_or(DEFAULT_PORT);
        let web_dir = std::env::var("SMKW_WEB_DIR")
            .map(PathBuf::from)
            .ok()
            .or_else(|| Some(PathBuf::from("../smkw-ui/dist")))
            .filter(|dir| dir.join("index.html").is_file());
        Self { port, web_dir }
    }
}
