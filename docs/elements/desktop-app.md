# Application de bureau (Windows, macOS, Linux)

- **Type** : application (Tauri 2) + livraison
- **Fichiers** : `smkw-desktop/` (Cargo.toml, src/main.rs, tauri.conf.json, capabilities/, icons/, package.json), `.github/workflows/desktop-release.yml`
- **Phase** : 3A

## Rôle

Installer Kart Able comme un jeu, et **héberger les parties en réseau local**. Au démarrage, l'application lance le serveur `smkw-api` (bibliothèque Rust embarquée) sur le port 2567, toutes interfaces, avec le jeu web compilé (ressource `web/`), puis ouvre sa fenêtre (WebView du système) sur `http://127.0.0.1:2567`. Les autres joueurs du réseau rejoignent depuis leur navigateur (`http://<IP>:2567`) ou leur propre application. Si le port est pris (une autre instance), le suivant est utilisé.

## Installateurs

GitHub Actions (tag `v*`) : Windows `.msi` et `-setup.exe` (installation pour l'utilisateur), macOS `.dmg` (Apple Silicon et Intel), Linux `.deb`, `.rpm`, `.AppImage`. Voir [docs/HOSTING.md](../HOSTING.md).

## Dépendances

`tauri` 2, `tokio`, `smkw-api` (chemin local) ; CLI `@tauri-apps/cli` (npm). Linux : WebKitGTK 4.1. Windows : WebView2 (présent sur Windows 10 et 11).

## Conformité règles d'or

- [x] Le jeu est le même que sur le web (aucune UI propre à l'application)
- [x] Icônes générées aux couleurs du jeu, sans dégradé ni emoji
- [x] Aucune API Tauri appelée par le jeu (permissions minimales `core:default`)

## Évolutions prévues

Signature des installateurs (Windows, Apple), mises à jour automatiques, découverte des salons sans saisir d'adresse.
