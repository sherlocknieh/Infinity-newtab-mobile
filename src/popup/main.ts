/**
 * Popup entry point
 *
 * Reverse-engineered from popup.bde56aba.js in the compiled output.
 *
 * The popup is the small window that opens when the user clicks the
 * extension's browser-action icon.  It allows the user to add the current
 * tab as a site shortcut on the new-tab page.
 *
 * Key initialisation steps:
 *   1. Set the root font-size to 39 px so all rem/px values match the design
 *      (matches `document.documentElement.style.fontSize = "39px"` in the
 *      compiled output).
 *   2. Set the document title to the localised extension name.
 *   3. Mount the app into the #popup div declared in index.html.
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'virtual:windi.css'

// Match the compiled popup: root font-size is always 39 px.
// (Mirrors `document.documentElement.style.fontSize = "39px"` in the compiled output.)
document.documentElement.style.fontSize = '39px'

// Set document title to the localised extension name.
document.title = chrome.i18n.getMessage('extension_name') || 'Infinity New Tab'

const app = createApp(App)
app.use(createPinia())
app.mount('#popup')


