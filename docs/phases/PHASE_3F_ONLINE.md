# Phase 3F : jeu en ligne (Internet)

## Demande

Jouer à la fois sur le web et sur l'application de bureau, y compris à distance, chacun chez soi.

## Fait

- **Serveur** (`smkw-api`) :
  - mode en ligne (`SMKW_PUBLIC_URL`) ;
  - port `SMKW_PORT`, sinon `PORT` ;
  - salons privés ;
  - limites et ping (`limits.rs`) ;
  - charge visible dans `/api/info`.
- **Jeu** :
  - carte « Sur Internet » ;
  - connexion automatique au serveur en ligne sur le site public ;
  - adresses `wss://` ;
  - salons privés ;
  - invitation par code ;
  - `config/network.js`.
- **Déploiement** : `fly.toml` à la racine (une seule machine, arrêt automatique quand personne ne joue), `.dockerignore`, Dockerfile compatible avec `PORT`. Pas à pas dans [HOSTING.md](../HOSTING.md), section 6.
- **Application de bureau** : inchangée pour le réseau local. Elle peut aussi rejoindre le serveur en ligne (« Jouer en ligne » si elle est construite avec `VITE_ONLINE_SERVER_URL`, ou saisie de l'adresse).

## Vérifié

- **Protocole**, contre un serveur local en mode en ligne :
  - salon privé absent de la liste et rejoint par code (en minuscules aussi) ;
  - relais vers l'invité ;
  - code inconnu refusé ;
  - message trop gros refusé ;
  - salon public toujours listé.
- **Dans le jeu** :
  - connexion par « Autre serveur » ;
  - salon créé en privé ;
  - lobby avec l'invitation « Jouer en ligne » et le code.
- **Builds** :
  - `cargo build` (smkw-api) et `cargo check` (smkw-desktop) ;
  - `npm run check` et `npm run build`.
- **Non vérifié ici** :
  - le déploiement réel sur Fly.io (compte nécessaire) ;
  - une course complète entre deux machines à distance ;
  - Docker, absent de cette machine.
