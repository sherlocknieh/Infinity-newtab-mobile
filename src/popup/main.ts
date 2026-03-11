/**
 * Popup entry point
 *
 * The popup is the small window that opens when the user clicks the
 * extension's browser-action icon. It bootstraps a minimal Vue 3 app
 * (no router needed – the popup is single-page) and mounts into #app.
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'virtual:windi.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
