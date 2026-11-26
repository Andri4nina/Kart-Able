# Référencement (SEO) et sitemaps

- **Type** : service (build) + fichiers statiques
- **Fichiers** : `smkw-ui/site.config.js`, `smkw-ui/scripts/seoPlugin.js`, `smkw-ui/vite.config.js`, `smkw-ui/index.html` (`noscript`), `smkw-ui/public/` (manifest.webmanifest, og-image.png, icon-192.png, icon-512.png), `smkw-ui/src/i18n/locales.js` (`?lang=`)
- **Phase** : 3A

## Rôle

Faire trouver « Kart Able » et « Rasoamanana Andrianina » sur Google et Bing :
- titre, description, auteur, mots-clés, adresse canonique, `hreflang` (fr, en, mg via `?lang=`, que le jeu respecte) ;
- Open Graph / Twitter (image 1200 x 630) ; données structurées `VideoGame` ;
- `robots.txt` et `sitemap.xml` générés au build avec l'adresse `SITE_URL` (même sitemap pour Google Search Console et Bing Webmaster Tools) ;
- vérification : balises meta par variables (`GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`) ou fichiers déposés dans `public/`.

Procédure complète : [docs/HOSTING.md](../HOSTING.md).

## Conformité règles d'or

- [x] Image de partage et icônes en aplats (aucun dégradé), aucun emoji
- [x] Textes SEO hors de l'UI du jeu (page HTML) ; l'UI reste traduite par `t()`

## Évolutions prévues

Pages de présentation (coupes, circuits) indexables ; captures du jeu dans les données structurées.
