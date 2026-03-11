import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import { crx } from '@crxjs/vite-plugin'
import { resolve } from 'path'
import manifest from './manifest.json'

/**
 * Vite config for the Infinity New Tab Chrome extension, managed by CRXJS.
 *
 * CRXJS reads manifest.json to discover all entry points automatically:
 *   - newtab  → chrome_url_overrides.newtab
 *   - popup   → action.default_popup
 *   - background → background.service_worker
 */
export default defineConfig({
  plugins: [
    vue(),
    WindiCSS(),
    crx({ manifest }),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',
  },

  server: {
    port: 3000,
  },
})
