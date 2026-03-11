/**
 * Service Worker source (src/sw.ts)
 *
 * Compiled → sw.js at the extension root.
 *
 * Uses Workbox 6 (workbox-build) to:
 *   • Pre-cache static extension assets so the new-tab page loads instantly
 *     even when the user is offline.
 *   • Serve cached responses with a stale-while-revalidate strategy for API
 *     responses and wallpaper images.
 *
 * NOTE: The sw.js file committed in this repository is the already-compiled
 * output of this source.  When the project is built with `npm run build`,
 * workbox-build's `injectManifest` step reads this file, injects the
 * `__WB_MANIFEST` precache list, and writes the final sw.js to dist/.
 */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, PrecacheEntry } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import {
  StaleWhileRevalidate,
  CacheFirst,
  NetworkFirst,
} from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

// ---------------------------------------------------------------------------
// Core
// ---------------------------------------------------------------------------

// Take control of all clients immediately after installation.
clientsClaim()

// __WB_MANIFEST is replaced by workbox-build with the list of assets to
// pre-cache.  During development it is an empty array.
precacheAndRoute(self.__WB_MANIFEST ?? [])

// ---------------------------------------------------------------------------
// Runtime caching strategies
// ---------------------------------------------------------------------------

// API responses – NetworkFirst so the user always gets fresh data when
// online, but falls back to the cache when offline.
registerRoute(
  ({ url }) => url.hostname === 'api.infinitynewtab.com',
  new NetworkFirst({
    cacheName: 'infinity-api',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 }),
    ],
  }),
)

// Wallpaper images – CacheFirst because they rarely change.
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'infinity-images',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      }),
    ],
  }),
)

// Extension fonts – StaleWhileRevalidate.
registerRoute(
  ({ request }) =>
    request.destination === 'font' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'infinity-static',
  }),
)

// ---------------------------------------------------------------------------
// Type augmentation for TypeScript
// ---------------------------------------------------------------------------

declare global {
  interface ServiceWorkerGlobalScope {
    __WB_MANIFEST: Array<string | PrecacheEntry>
  }
  // TypeScript resolves `self` in module context as Window; augment it too.
  interface Window {
    __WB_MANIFEST: Array<string | PrecacheEntry>
  }
}
