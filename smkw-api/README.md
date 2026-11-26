# smkw-api

Serveur de jeu de Kart Able (code SMKW), en **Rust** : salons du réseau local (LAN), relais WebSocket des messages de jeu, et jeu web servi à la racine. Utilisé seul (binaire) ou embarqué dans l'application de bureau (`smkw-desktop`).

## Commandes

```
cargo run              # port 2567, jeu web depuis ../smkw-ui/dist s'il est compilé
cargo build --release  # binaire optimisé
```

Variables : `SMKW_PORT` (2567), `SMKW_WEB_DIR` (dossier du jeu compilé).

## Routes

- `GET /ws` : WebSocket des salons (messages JSON, voir `src/protocol.rs`) ;
- `GET /api/info` : version et adresse sur le réseau local ;
- le reste : fichiers du jeu web (repli sur `index.html`).

Les autres machines du réseau ouvrent `http://<adresse-de-l-hote>:2567` dans leur navigateur. Docker : `Dockerfile` (à construire depuis la racine du dépôt). Détails : [docs/elements/lan-multiplayer.md](../docs/elements/lan-multiplayer.md), [docs/HOSTING.md](../docs/HOSTING.md).
