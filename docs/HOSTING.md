# Héberger Kart Able (Rasoamanana Andrianina)

Trois façons de jouer, trois livraisons :

| Quoi | Où | Pour |
| --- | --- | --- |
| Jeu web (`smkw-ui/dist`) | Vercel (gratuit), projet **rasoamanana-andrianina-kart-able** | Jouer seul ou en écran partagé dans le navigateur ; référencement Google / Bing |
| Application de bureau (`smkw-desktop`) | Versions GitHub (installateurs Windows, macOS, Linux) | Jouer hors ligne et **héberger une partie en réseau local** |
| Serveur de jeu (`smkw-api`) | Machine du réseau local, ou VPS / Fly.io / Railway (Docker) | Parties en réseau sans l'application de bureau |
| Serveur en ligne (`smkw-api` public) | Fly.io (`fly.toml`), ou Render, Railway, VPS | **Jouer sur Internet**, chacun chez soi, web et bureau ensemble |

## 1. Site web sur Vercel

Le dépôt est prêt pour Vercel de deux façons. Les deux construisent seulement le jeu web (`smkw-ui`) ; ni le serveur Rust ni l'application de bureau ne sont envoyés.

### a. Depuis GitHub (recommandé : redéploiement à chaque push)

1. Sur vercel.com, **Add New Project**, puis importer le dépôt GitHub `Kart-Able`.
2. **Project Name** : `rasoamanana-andrianina-kart-able`. L'adresse sera https://rasoamanana-andrianina-kart-able.vercel.app.
3. **Root Directory**, au choix :
   - laisser la racine du dépôt : `vercel.json` (à la racine) installe et construit `smkw-ui` et publie `smkw-ui/dist` ;
   - ou choisir `smkw-ui` : c'est alors `smkw-ui/vercel.json` qui s'applique.

   Dans les deux cas, ces fichiers règlent le build (`npm run build`), le dossier de sortie, le cache des fichiers et les en-têtes de sécurité. Rien n'est à saisir dans l'interface.
4. Variables d'environnement (Settings, Environment Variables) :
   - `SITE_URL` : l'adresse définitive (ex. `https://kart-able.mg` si un domaine est ajouté) ; sans elle, l'adresse Vercel ci-dessus ;
   - `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION` : codes des balises meta de vérification (facultatif, voir plus bas).
5. **Deploy**. Ensuite :
   - chaque push sur `main` redéploie le site en production ;
   - chaque branche ou pull request obtient une adresse d'aperçu.

### b. En ligne de commande (sans GitHub)

Depuis `smkw-ui/` (Node 20 ou plus) :

```
npm run deploy:preview   # adresse d'aperçu
npm run deploy           # production
```

Au premier lancement, la commande Vercel (`npx vercel`) demande de se connecter, puis de lier ou de créer le projet. Le choix est gardé dans `.vercel/`, ignoré par git. Les variables se gèrent de la même façon : `npx vercel env add SITE_URL`.

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

## 6. Jouer sur Internet (serveur en ligne)

Le site Vercel ne fait que servir le jeu. Pour jouer à distance, il faut aussi un serveur de jeu public. C'est le même `smkw-api` que pour le réseau local, hébergé sur Internet. Les joueurs du site web et ceux de l'application de bureau s'y retrouvent.

### a. Déployer le serveur sur Fly.io

1. Installer la commande Fly (fly.io/docs/flyctl/install), puis `fly auth login`.
2. À la racine du dépôt : `fly launch --no-deploy --copy-config`. Garder `fly.toml`, et changer le nom de l'application s'il est pris. Mettre alors à jour `SMKW_PUBLIC_URL` dans `fly.toml`.
3. `fly deploy`, puis `fly scale count 1`. Il faut une seule machine : les salons vivent en mémoire.
4. Vérifier : `https://kart-able-server.fly.dev/api/info` doit répondre avec `"public"`.

Coût : la machine s'arrête quand personne ne joue et redémarre à la première connexion, quelques secondes au premier joueur. Fly.io demande une carte bancaire ; une si petite machine coûte quelques centimes à quelques dollars par mois selon l'usage.

Autres hébergeurs (Render, Railway, VPS) :
- construire l'image `smkw-api/Dockerfile` depuis la racine du dépôt ;
- définir `SMKW_PUBLIC_URL` ;
- le port suit `PORT` s'il est fourni ;
- l'hébergeur doit gérer HTTPS et les WebSocket.

### b. Brancher le site Vercel sur ce serveur

1. Vercel, Settings, Environment Variables : `VITE_ONLINE_SERVER_URL` = `wss://kart-able-server.fly.dev/ws`.
2. Redéployer : la variable est lue au build.

Le site affiche alors « Jouer en ligne » et s'y connecte de lui-même dans « En réseau ». Le serveur Fly sert aussi le jeu : `https://kart-able-server.fly.dev` est jouable directement, déjà relié.

Pour l'application de bureau : la construire avec la même variable (par exemple, la définir dans le workflow des installateurs) pour avoir le bouton. Sinon, on peut toujours saisir `kart-able-server.fly.dev` dans « Autre serveur ».

### c. Jouer

1. Jouer, Course, **En réseau**, **Jouer en ligne**, **Créer un salon**.
2. Donner le code du salon (6 caractères) à ses amis.
3. Ils font Jouer, Course, En réseau, Jouer en ligne, saisissent le code, puis Rejoindre.

Les salons en ligne sont privés : ils n'apparaissent pas dans la liste, seul le code permet d'entrer.
