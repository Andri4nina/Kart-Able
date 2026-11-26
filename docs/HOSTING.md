# Héberger Kart Able (Rasoamanana Andrianina)

Trois façons de jouer, trois livraisons :

| Quoi | Où | Pour |
| --- | --- | --- |
| Jeu web (`smkw-ui/dist`) | Vercel (gratuit), projet **rasoamanana-andrianina-kart-able** | Jouer seul ou en écran partagé dans le navigateur ; référencement Google / Bing |
| Application de bureau (`smkw-desktop`) | Versions GitHub (installateurs Windows, macOS, Linux) | Jouer hors ligne et **héberger une partie en réseau local** |
| Serveur de jeu (`smkw-api`) | Machine du réseau local, ou VPS / Fly.io / Railway (Docker) | Parties en réseau sans l'application de bureau |

## 1. Site web sur Vercel

1. Sur vercel.com, **Add New Project** puis importer le dépôt GitHub `Kart-Able`.
2. **Project Name** : `rasoamanana-andrianina-kart-able` (adresse : https://rasoamanana-andrianina-kart-able.vercel.app).
3. **Root Directory** : `smkw-ui`. Le reste vient de `smkw-ui/vercel.json` (build `npm run build`, sortie `dist`, cache des fichiers, en-têtes de sécurité).
4. Variables d'environnement (Settings, Environment Variables) :
   - `SITE_URL` : l'adresse définitive (ex. `https://kart-able.mg` si un domaine est ajouté) ; sans elle, l'adresse Vercel ci-dessus ;
   - `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION` : codes des balises meta de vérification (facultatif, voir plus bas).
5. Chaque push sur `main` redéploie le site.

Domaine personnalisé : Settings, Domains, ajouter le domaine, suivre les enregistrements DNS indiqués, puis mettre `SITE_URL` à jour et redéployer (le sitemap et les balises suivent).

## 2. Référencement (SEO)

Généré au build par `smkw-ui/scripts/seoPlugin.js` d'après `smkw-ui/site.config.js` :
- titre « Kart Able de Rasoamanana Andrianina : course de karts 3D multijoueur », description, auteur, mots-clés, adresse canonique, langues (`?lang=fr|en|mg`) ;
- partage social (Open Graph, Twitter) avec `public/og-image.png` (1200 x 630) ;
- données structurées schema.org `VideoGame` (auteur : Rasoamanana Andrianina) ;
- `robots.txt` et `sitemap.xml` (dans `dist/`) ; manifeste et icônes.

### Google Search Console

1. search.google.com/search-console, ajouter une propriété **Préfixe d'URL** avec l'adresse du site.
2. Vérification, au choix :
   - fichier HTML (`googleXXXXXXXX.html`) : le déposer dans `smkw-ui/public/`, pousser, cliquer sur Valider ;
   - balise meta : copier le code (`content="..."`) dans la variable `GOOGLE_SITE_VERIFICATION` sur Vercel, redéployer.
3. Menu Sitemaps : envoyer `sitemap.xml`.

### Bing Webmaster Tools

1. bing.com/webmasters : importer depuis Google Search Console (le plus simple), ou ajouter le site.
2. Vérification : fichier `BingSiteAuth.xml` dans `smkw-ui/public/`, ou balise meta via `BING_SITE_VERIFICATION`.
3. Sitemaps : envoyer `https://<adresse>/sitemap.xml` (le même fichier sert à Google et à Bing).

## 3. Installateurs (application de bureau)

`.github/workflows/desktop-release.yml` construit les installateurs sur les machines de GitHub :

```
git tag v0.3.0
git push origin v0.3.0
```

Une version en brouillon apparaît dans l'onglet Releases du dépôt avec : Windows (`.msi`, `-setup.exe`), macOS (`.dmg` Apple Silicon et Intel), Linux (`.deb`, `.rpm`, `.AppImage`). La publier rend les liens publics. Sans certificat de signature, Windows SmartScreen et macOS Gatekeeper affichent un avertissement au premier lancement (macOS : clic droit puis Ouvrir).

Construction locale (sur la machine de son système uniquement) : `cd smkw-desktop`, `npm install`, `npm run build` ; installateurs dans `smkw-desktop/target/release/bundle/`.

## 4. Parties en réseau local (LAN)

- L'**hôte** lance l'application de bureau : elle démarre le serveur de jeu sur le port 2567 (le pare-feu demande l'autorisation la première fois : accepter pour les réseaux privés).
- Dans le jeu : Jouer, Course, **Réseau local**, Créer un salon. Le lobby affiche l'adresse à donner (ex. `http://192.168.1.20:2567`).
- Les **joueurs web** ouvrent cette adresse dans leur navigateur (même Wi-Fi ou câble), puis Réseau local : le salon apparaît, Rejoindre.
- Les **joueurs avec l'application** saisissent l'adresse de l'hôte à l'étape Connexion.

Le site web public (https) ne peut pas joindre une machine du réseau local (les navigateurs bloquent ce mélange) : pour le LAN, on passe par l'adresse de l'hôte.

## 5. Serveur seul (sans l'application)

- Sur une machine du réseau : `cd smkw-ui && npm run build`, puis `cd ../smkw-api && cargo run --release`.
- En conteneur : `docker build -f smkw-api/Dockerfile -t kart-able .` puis `docker run -p 2567:2567 kart-able`. Sur Internet (Fly.io, Railway, VPS), placer le serveur derrière HTTPS pour les WebSocket (`wss://`).
