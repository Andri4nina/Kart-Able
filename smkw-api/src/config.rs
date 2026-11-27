//! Configuration du serveur, lue dans l'environnement (valeurs par defaut sinon).

use std::path::PathBuf;

#[derive(Clone, Debug)]
pub struct ServerConfig {
    /// Port d'ecoute (toutes les interfaces : les autres machines du reseau local s'y connectent).
    pub port: u16,
    /// Dossier du jeu web compile (smkw-ui/dist) servi a la racine, ou None (WebSocket seul).
    pub web_dir: Option<PathBuf>,
    /// Adresse publique du serveur sur Internet (SMKW_PUBLIC_URL, ex. https://kart-able.fly.dev) :
    /// serveur en ligne, on n'annonce alors pas d'adresse de reseau local.
    pub public_url: Option<String>,
}

pub const DEFAULT_PORT: u16 = 2567;

impl ServerConfig {
    pub fn from_env() -> Self {
        // SMKW_PORT, sinon PORT (impose par certains hebergeurs : Render, Railway...).
        let port = ["SMKW_PORT", "PORT"]
            .iter()
            .find_map(|name| std::env::var(name).ok().and_then(|value| value.parse().ok()))
            .unwrap_or(DEFAULT_PORT);
        let public_url = std::env::var("SMKW_PUBLIC_URL").ok().map(|url| url.trim_end_matches('/').to_string()).filter(|url| !url.is_empty());
        let web_dir = std::env::var("SMKW_WEB_DIR")
            .map(PathBuf::from)
            .ok()
            .or_else(|| Some(PathBuf::from("../smkw-ui/dist")))
            .filter(|dir| dir.join("index.html").is_file());
        Self { port, web_dir, public_url }
    }
}
