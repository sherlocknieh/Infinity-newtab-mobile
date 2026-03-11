/**
 * Background page entry point
 *
 * Reverse-engineered from background.d14e6c8f.js in the compiled output.
 *
 * The background page runs persistently (manifest_version: 2,
 * "persistent": true) for the lifetime of the browser session.
 *
 * Boot sequence (mirrors the compiled output):
 *   1. Initialise the i18n / storage layer.
 *   2. Start the BackgroundService which wires up Chrome API listeners and
 *      background service modules (fetch proxy, sync, WebSocket, etc.).
 *
 * The background page has no visible UI.  A minimal Vue app is created solely
 * to keep the module system consistent across all entry points (newtab, popup,
 * background) and to benefit from Pinia's cross-component state sharing.
 */

import { createApp } from 'vue'
import App from './App.vue'

// The background page mounts into the #background div declared in index.html.
// The component renders an empty <div> – all logic lives in script setup.
const app = createApp(App)
app.mount('#background')

