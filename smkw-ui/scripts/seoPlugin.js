import { SITE } from '../site.config.js'

// Référencement (plugin Vite) : balises de la page (titre, description, auteur, partage social,
// langues, données structurées VideoGame, vérification Google / Bing si fournie) et, au build,
// robots.txt et sitemap.xml (même plan du site pour Google Search Console et Bing Webmaster
// Tools). Configuration : site.config.js.
const escape = (text) => String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const meta = (attribute, key, content) => `<meta ${attribute}="${key}" content="${escape(content)}" />`

function headTags() {
  const image = `${SITE.url}${SITE.image}`
  const alternates = SITE.locales.map((locale) => `<link rel="alternate" hreflang="${locale}" href="${SITE.url}/?lang=${locale}" />`)
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: SITE.name,
    url: `${SITE.url}/`,
    image,
    description: SITE.description,
    author: { '@type': 'Person', name: SITE.author },
    creator: { '@type': 'Person', name: SITE.author },
    genre: ['Racing', 'Kart racing'],
    gamePlatform: ['Web browser', 'Windows', 'macOS', 'Linux'],
    applicationCategory: 'Game',
    operatingSystem: 'Windows, macOS, Linux, Web',
    playMode: ['SinglePlayer', 'MultiPlayer'],
    numberOfPlayers: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 32 },
    inLanguage: SITE.locales,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  }
  return [
    meta('name', 'description', SITE.description),
    meta('name', 'author', SITE.author),
    meta('name', 'keywords', SITE.keywords.join(', ')),
    meta('name', 'application-name', SITE.name),
    meta('name', 'robots', 'index, follow, max-image-preview:large'),
    `<link rel="canonical" href="${SITE.url}/" />`,
    ...alternates,
    `<link rel="alternate" hreflang="x-default" href="${SITE.url}/" />`,
    `<link rel="manifest" href="/manifest.webmanifest" />`,
    `<link rel="apple-touch-icon" href="/icon-192.png" />`,
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', `${SITE.name} - ${SITE.author}`),
    meta('property', 'og:title', SITE.title),
    meta('property', 'og:description', SITE.description),
    meta('property', 'og:url', `${SITE.url}/`),
    meta('property', 'og:image', image),
    meta('property', 'og:locale', 'fr_FR'),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', SITE.title),
    meta('name', 'twitter:description', SITE.description),
    meta('name', 'twitter:image', image),
    SITE.googleVerification ? meta('name', 'google-site-verification', SITE.googleVerification) : '',
    SITE.bingVerification ? meta('name', 'msvalidate.01', SITE.bingVerification) : '',
    `<script type="application/ld+json">${JSON.stringify(structured)}</script>`,
  ].filter(Boolean)
}

function sitemap() {
  const lastmod = new Date().toISOString().slice(0, 10)
  const links = SITE.locales.map((locale) => `    <xhtml:link rel="alternate" hreflang="${locale}" href="${SITE.url}/?lang=${locale}" />`).join('\n')
  const entry = (loc, priority) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n${links}\n  </url>`
  // Une seule page (application) : l'adresse canonique, avec ses variantes de langue.
  const urls = [entry(`${SITE.url}/`, '1.0')]
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
}

const robots = () => `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`

export function seoPlugin() {
  return {
    name: 'kart-able-seo',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replace('<title>Kart Able</title>', `<title>${escape(SITE.title)}</title>\n    ${headTags().join('\n    ')}`),
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap() })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots() })
    },
  }
}
