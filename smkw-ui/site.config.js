// Référencement et hébergement du site (lu au build par scripts/seoPlugin.js, pas par le jeu).
// Adresse publique : variable d'environnement SITE_URL au build (domaine définitif), sinon
// l'adresse prévue de l'hébergement Vercel (voir docs/HOSTING.md).
// Codes de vérification des moteurs de recherche (balises meta) : GOOGLE_SITE_VERIFICATION,
// BING_SITE_VERIFICATION ; les fichiers de vérification (googleXXXX.html, BingSiteAuth.xml) se
// déposent simplement dans public/.

export const SITE = Object.freeze({
  name: 'Kart Able',
  author: 'Rasoamanana Andrianina',
  // Nom du projet chez l'hébergeur (adresse par défaut : https://<slug>.vercel.app).
  slug: 'rasoamanana-andrianina-kart-able',
  url: (process.env.SITE_URL || 'https://rasoamanana-andrianina-kart-able.vercel.app').replace(/\/+$/, ''),
  themeColor: '#14161c',
  locales: ['fr', 'en', 'mg'],
  defaultLocale: 'fr',
  image: '/og-image.png',
  title: 'Kart Able de Rasoamanana Andrianina : course de karts 3D multijoueur',
  description:
    "Kart Able, le jeu de course de karts 3D de Rasoamanana Andrianina : jusqu'à 32 pilotes, 16 circuits en 4 coupes (prairies, montagnes, neige, terre battue), drift et mini-turbos, tremplins, deltaplane, objets, écran partagé jusqu'à 8 joueurs et parties en réseau local. Gratuit, dans le navigateur ou à installer sur Windows, macOS et Linux.",
  keywords: ['Kart Able', 'Rasoamanana Andrianina', 'jeu de kart', 'course de karts', 'jeu de course 3D', 'jeu multijoueur', 'écran partagé', 'jeu navigateur', 'kart racing', 'LAN'],
  googleVerification: process.env.GOOGLE_SITE_VERIFICATION || '',
  bingVerification: process.env.BING_SITE_VERIFICATION || '',
})
