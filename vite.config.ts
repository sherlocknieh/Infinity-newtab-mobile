import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import { resolve } from 'path'

/**
 * Multi-page Vite config for the Infinity New Tab Chrome extension.
 *
 * Entry points mirror the three HTML pages declared in manifest.json:
 *   - newtab  → chrome_url_overrides.newtab
 *   - popup   → browser_action.default_popup
 *   - background → background.page
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
    // Output into dist/ so existing compiled assets are not overwritten.
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: false,
    minify: 'terser',

    rollupOptions: {
      input: {
        newtab: resolve(__dirname, 'src/newtab/index.html'),
        popup: resolve(__dirname, 'src/popup/index.html'),
        background: resolve(__dirname, 'src/background/index.html'),
      },
      output: {
        // Keep chunk names readable for debugging.
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        // Split vendor and windicss into separate chunks as seen in the
        // compiled output (vendor.*.js, windi.*.js).
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia', 'vant'],
        },
      },
    },
  },

  // During development serve from the project root so Chrome can load the
  // extension directly with the correct asset paths.
  server: {
    port: 3000,
  },
})
