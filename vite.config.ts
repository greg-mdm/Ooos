import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  base: '/',

  // A per-build id, stamped in at build time and used to cache-bust the
  // watchlist embed (see IWatchlist.tsx).
  //
  // That embed is served straight out of public/, so GitHub Pages gives it
  // max-age=600 and a returning visitor keeps whatever copy they last fetched
  // for ten minutes. The manual ?v=N rule the guide sets for the .dc.html
  // bundles works there because those change deliberately and rarely. It does
  // not work here: the watchlist carries live figures and news, it changes
  // often, and the rule depends on somebody remembering. On 2026-08-25 nobody
  // did, and the page went on telling readers a finished tournament was
  // "happening now".
  //
  // So this one busts itself. Every deploy mints a new id, the embed URL
  // changes with it, and the freshest copy is always the one served. The cost
  // is re-fetching 101KB of HTML after a deploy; its images sit on their own
  // URLs and stay cached. Deliberately NOT applied to Greek Lexicon.dc.html,
  // which is 1.7MB and would charge every visitor that on every unrelated
  // push.
  define: {
    __EMBED_BUILD__: JSON.stringify(Date.now().toString(36)),
  },

  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
