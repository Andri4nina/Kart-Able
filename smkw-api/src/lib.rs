//! Serveur de jeu de Kart Able (code SMKW), utilisable seul (binaire smkw-api) ou embarque
//! dans l'application de bureau (smkw-desktop), qui l'heberge pour les parties en reseau local.
//!
//! - `GET /ws` : WebSocket des salons (protocol.rs, rooms.rs) ;
//! - `GET /api/info` : version et adresses du serveur sur le reseau local ;
//! - le reste : le jeu web compile (smkw-ui/dist), si `web_dir` est fourni. Les joueurs du
//!   reseau local ouvrent simplement http://<adresse-de-l-hote>:<port> dans leur navigateur.

pub mod config;
pub mod protocol;
pub mod rooms;
mod socket;

use std::net::{SocketAddr, UdpSocket};
use std::sync::{Arc, Mutex};

use axum::extract::{State, WebSocketUpgrade};
use axum::response::IntoResponse;
use axum::routing::get;
use axum::{Json, Router};
use tower_http::cors::CorsLayer;
use tower_http::services::{ServeDir, ServeFile};

pub use config::{ServerConfig, DEFAULT_PORT};
use rooms::Lobby;

#[derive(Clone)]
pub struct AppState {
    pub lobby: Arc<Mutex<Lobby>>,
    pub port: u16,
}

/// Adresse de cette machine sur le reseau local (aucun paquet envoye : la socket UDP sert
/// seulement a connaitre l'interface de sortie).
pub fn lan_ip() -> Option<String> {
    let socket = UdpSocket::bind("0.0.0.0:0").ok()?;
    socket.connect("10.255.255.255:1").ok()?;
    socket.local_addr().ok().map(|address| address.ip().to_string())
}

async fn info(State(state): State<AppState>) -> impl IntoResponse {
    let addresses: Vec<String> = lan_ip().into_iter().map(|ip| format!("http://{ip}:{}", state.port)).collect();
    Json(serde_json::json!({ "name": "smkw-api", "version": env!("CARGO_PKG_VERSION"), "port": state.port, "lan": addresses }))
}

async fn websocket(upgrade: WebSocketUpgrade, State(state): State<AppState>) -> impl IntoResponse {
    upgrade.on_upgrade(move |socket| socket::run(socket, state.lobby))
}

pub fn router(config: &ServerConfig) -> Router {
    let state = AppState { lobby: Arc::new(Mutex::new(Lobby::default())), port: config.port };
    let api = Router::new().route("/ws", get(websocket)).route("/api/info", get(info)).with_state(state).layer(CorsLayer::permissive());
    match &config.web_dir {
        Some(dir) => api.fallback_service(ServeDir::new(dir).fallback(ServeFile::new(dir.join("index.html")))),
        None => api,
    }
}

/// Lance le serveur (toutes les interfaces) jusqu'a l'arret du processus.
pub async fn serve(config: ServerConfig) -> std::io::Result<()> {
    let address = SocketAddr::from(([0, 0, 0, 0], config.port));
    let listener = tokio::net::TcpListener::bind(address).await?;
    axum::serve(listener, router(&config)).await
}
