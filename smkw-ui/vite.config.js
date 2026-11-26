import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { seoPlugin } from './scripts/seoPlugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), seoPlugin()],
  // Prêt pour les modèles 3D et textures compressées (GLB/GLTF, KTX2) des phases suivantes.
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.ktx2'],
  server: {
    port: 5173,
    strictPort: true,
    // Réseau local en développement : le serveur smkw-api (cargo run) répond sur le port 2567.
    proxy: {
      '/ws': { target: 'ws://localhost:2567', ws: true },
      '/api': 'http://localhost:2567',
    },
  },
  build: {
    // three.js seul pèse ~740 kB minifié (~190 kB gzip) : plancher incompressible d'une app 3D.
    chunkSizeWarningLimit: 800,
    rolldownOptions: {
      output: {
        // Chunks vendors séparés : ils changent rarement et restent en cache entre deux déploiements.
        codeSplitting: {
          groups: [
            { name: 'three', test: /node_modules[\\/]three[\\/]/ },
            { name: 'r3f', test: /node_modules[\\/](@react-three|three-stdlib|camera-controls|maath)[\\/]/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'motion', test: /node_modules[\\/](motion|framer-motion|motion-dom|motion-utils)[\\/]/ },
          ],
        },
      },
    },
  },
})
