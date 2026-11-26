//! Serveur de jeu de Kart Able en ligne de commande : salons LAN et jeu web.
//! Variables : SMKW_PORT (2567), SMKW_WEB_DIR (../smkw-ui/dist par defaut).

use smkw_api::{lan_ip, serve, ServerConfig};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let config = ServerConfig::from_env();
    println!("smkw-api {} sur le port {}", env!("CARGO_PKG_VERSION"), config.port);
    match &config.web_dir {
        Some(dir) => println!("Jeu web servi depuis {}", dir.display()),
        None => println!("Jeu web absent (SMKW_WEB_DIR) : WebSocket seul"),
    }
    if let Some(ip) = lan_ip() {
        println!("Reseau local : http://{ip}:{}", config.port);
    }
    serve(config).await
}
