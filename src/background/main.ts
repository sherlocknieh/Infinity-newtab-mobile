/**
 * Background page entry point
 *
 * The background page runs persistently (manifest_version: 2,
 * "persistent": true) for the lifetime of the browser session.
 *
 * Responsibilities:
 *   • Install / update lifecycle hooks (chrome.runtime.onInstalled).
 *   • Handle cross-component messaging via chrome.runtime.onMessage.
 *   • Schedule periodic wallpaper auto-change alarms.
 *   • Coordinate sync operations when the user is online.
 */

import { createApp } from 'vue'
import App from './App.vue'

// Minimal Vue app – the background page has no visible UI but Vue keeps
// the module system consistent across all entry points.
const app = createApp(App)
app.mount('#app')
