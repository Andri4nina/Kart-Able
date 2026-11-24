# smkw-api

Serveur de jeu autoritaire de Kart Able (code SMKW), en **Rust**. **Squelette seulement** : le multijoueur arrive dans sa propre phase.

## Pourquoi Rust

- Binaire unique, léger (quelques Mo, peu de mémoire) : facile à déployer sur un petit VPS ou Fly.io.
- Simulation à pas fixe (1/120 s) rapide et prévisible, sans pause de ramasse-miettes.
- Les règles de course du client (`smkw-ui/src/game/race`, calcul pur sans React ni Three) seront portées telles quelles, avec les mêmes réglages (`config/kartTuning.js`), pour que la prédiction client reste cohérente.

## Pile prévue (ajoutée à la phase multijoueur, pas avant)

- `tokio` (runtime), `axum` (HTTP + WebSocket), `serde` / `serde_json` (messages), `tracing` (journaux)
- PostgreSQL uniquement pour les comptes et la progression (plus tard)

## Commandes

```
cargo run              # lance le squelette (affiche la configuration)
cargo build --release  # binaire optimisé
```

Variables : `SMKW_PORT` (2567 par défaut).

Structure cible : voir [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md). Règles : [docs/REGLES_D_OR.md](../docs/REGLES_D_OR.md).
