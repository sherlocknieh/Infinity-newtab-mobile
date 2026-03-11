/**
 * New-tab entry point
 *
 * Bootstraps Vue 3 with Pinia, Vue Router and WindiCSS then mounts the
 * application into the #app div declared in newtab/index.html.
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index'

// Import WindiCSS virtual module – injected by vite-plugin-windicss.
import 'virtual:windi.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
