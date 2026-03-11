import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import { resolve } from 'path'

/**
 * Multi-page Vite config for the Infinity New Tab Chrome extension.
 *
 * Entry points mirror the three HTML pages declared in manifest.json:
 *   - newtab     → chrome_url_overrides.newtab
 *   - popup      → browser_action.default_popup
 *   - background → background.page
 *
 * Static extension assets (manifest.json, _locales/, icon/, vendor/,
 * favicon.ico, sw.js) live in public/ and are copied as-is to dist/.
 * After `npm run build` the dist/ directory is ready to load as a
 * Chrome extension via chrome://extensions → Load unpacked.
 */
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS(),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  build: {
    outDir: 'dist',
    // Clean dist/ on every build so stale assets are removed.
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',

    rollupOptions: {
      // HTML entry points are at the root-level page directories so that
      // Vite outputs dist/newtab/index.html, dist/popup/index.html and
      // dist/background/index.html — matching the paths in manifest.json.
      input: {
        newtab: resolve(__dirname, 'newtab/index.html'),
        popup: resolve(__dirname, 'popup/index.html'),
        background: resolve(__dirname, 'background/index.html'),
      },
      output: {
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia', 'vant'],
        },
      },
    },
  },

  server: {
    port: 3000,
  },
})
