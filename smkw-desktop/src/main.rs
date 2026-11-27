//! Kart Able, application de bureau (Windows, macOS, Linux).
//!
//! Au demarrage, l'application lance le serveur de jeu (smkw-api) sur toutes les interfaces,
//! avec le jeu web embarque (ressource `web/`), puis ouvre sa fenetre sur ce serveur. Les autres
//! joueurs du reseau local jouent avec elle : depuis leur propre application (adresse de l'hote)
//! ou simplement depuis un navigateur ouvert sur http://<adresse-de-l-hote>:2567.

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::net::TcpListener;
use std::path::PathBuf;
use std::time::Duration;

use smkw_api::{ServerConfig, DEFAULT_PORT};
use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};

/// Premier port libre a partir du port par defaut (une autre instance peut deja l'occuper).
fn free_port() -> u16 {
    (DEFAULT_PORT..DEFAULT_PORT + 20).find(|port| TcpListener::bind(("0.0.0.0", *port)).is_ok()).unwrap_or(DEFAULT_PORT)
}

fn web_dir(app: &tauri::App) -> Option<PathBuf> {
    let bundled = app.path().resource_dir().ok().map(|dir| dir.join("web"));
    let candidates = [bundled, Some(PathBuf::from("../smkw-ui/dist"))];
    candidates.into_iter().flatten().find(|dir| dir.join("index.html").is_file())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let port = free_port();
            let config = ServerConfig { port, web_dir: web_dir(app), public_url: None };
            tauri::async_runtime::spawn(async move {
                if let Err(error) = smkw_api::serve(config).await {
                    eprintln!("Serveur de jeu arrete : {error}");
                }
            });
            // Le serveur ecoute presque aussitot ; on attend qu'il reponde avant d'ouvrir la fenetre.
            for _ in 0..50 {
                if std::net::TcpStream::connect(("127.0.0.1", port)).is_ok() {
                    break;
                }
                std::thread::sleep(Duration::from_millis(100));
            }
            let url = format!("http://127.0.0.1:{port}/").parse().expect("adresse locale");
            WebviewWindowBuilder::new(app, "main", WebviewUrl::External(url))
                .title("Kart Able")
                .inner_size(1280.0, 720.0)
                .min_inner_size(960.0, 540.0)
                .build()?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Kart Able n'a pas pu demarrer");
}
