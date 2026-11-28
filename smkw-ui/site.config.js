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
  slug: 'kart-able',
  url: (process.env.SITE_URL || 'https://kart-able.vercel.app').replace(/\/+$/, ''),
  themeColor: '#14161c',
  locales: ['fr', 'en', 'mg'],
  defaultLocale: 'fr',
  image: '/og-image.png',
  title: 'Kart Able de Rasoamanana Andrianina : course de karts 3D multijoueur',
  description:
    "Kart Able, le jeu de course de karts 3D de Rasoamanana Andrianina : jusqu'à 32 pilotes, 28 circuits en 7 coupes (prairies, montagnes, neige, terre battue, coupe technique, routes à deux voies avec ponts et tranchées, courses sur et sous l'eau), drift et mini-turbos, tremplins, deltaplane, objets, écran partagé jusqu'à 8 joueurs, parties en réseau local et en ligne. Gratuit, dans le navigateur ou à installer sur Windows, macOS et Linux.",
  keywords: ['Kart Able', 'Rasoamanana Andrianina', 'jeu de kart', 'course de karts', 'jeu de course 3D', 'jeu multijoueur', 'écran partagé', 'jeu navigateur', 'kart racing', 'LAN', 'jeu en ligne'],
  googleVerification: process.env.GOOGLE_SITE_VERIFICATION || '',
  bingVerification: process.env.BING_SITE_VERIFICATION || '',
})
