# Phase 3A : réseau local, application de bureau, référencement

## Demande

Deux coupes de plus (neige, terre) aux noms originaux ; SEO et hébergement au nom de Rasoamanana Andrianina, Kart Able ; sitemaps pour Google et Bing (fichiers de vérification fournis plus tard) ; installateurs Windows, Linux et macOS ; les joueurs de l'application et ceux du web jouent ensemble en LAN ; backend en Rust. Objets : plus tard.

## Fait

- **Coupes** Frostbloom (neige) et Dustrail (terre battue), 8 circuits. [elements/track-select.md](../elements/track-select.md)
- **SEO** : balises, données structurées, image de partage, `robots.txt`, `sitemap.xml`. [elements/seo.md](../elements/seo.md)
- **Hébergement** : Vercel (`vercel.json`, projet rasoamanana-andrianina-kart-able), Docker pour le serveur, guide pas à pas. [HOSTING.md](../HOSTING.md)
- **Serveur Rust** `smkw-api` : salons, relais WebSocket, jeu web servi, adresse LAN. [elements/lan-multiplayer.md](../elements/lan-multiplayer.md)
- **Réseau local** dans le jeu : connexion, salons, joueurs de chaque machine, lobby commun, course synchronisée.
- **Application de bureau** Tauri et installateurs par GitHub Actions. [elements/desktop-app.md](../elements/desktop-app.md)
- Intégration continue (`ci.yml`) : vérifications du jeu et build du serveur.

## Vérifié

- Coupes : simulation 32 karts (tous arrivent, aucune chute), captures neige et terre.
- Serveur : `cargo build`, `/api/info`, jeu servi, `sitemap.xml` servi.
- LAN : deux onglets (hôte et invité) sur le serveur Rust ; salon créé et rejoint, profils échangés, départ commun sur le même circuit avec la même graine, karts des deux machines visibles chez l'autre (écart de 1 à 2 m, dû au délai).
- `npm run check`, `npm run build` OK.

## Limites connues

- Objets non synchronisés entre machines (en attente des objets définitifs).
- Installateurs macOS et Linux construits seulement par GitHub Actions (pas sur cette machine Windows) ; non signés.
- Le site public (https) ne joint pas le réseau local : les joueurs web ouvrent l'adresse de l'hôte.
