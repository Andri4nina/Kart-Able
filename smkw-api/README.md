# smkw-api

Serveur de jeu autoritaire de Kart Able (code SMKW). **Pas encore implémenté** : il arrive avec la phase multijoueur.

## Stack prévue

- Node.js
- Colyseus (rooms, synchronisation d'état, gestion des joueurs) sur WebSocket
- PostgreSQL uniquement pour les comptes et la progression (plus tard)

## Déploiement prévu

VPS, Railway ou Fly.io (le frontend `smkw-ui` est déployé séparément sur Vercel).

Structure cible : voir [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md). Règles : [docs/REGLES_D_OR.md](../docs/REGLES_D_OR.md).
