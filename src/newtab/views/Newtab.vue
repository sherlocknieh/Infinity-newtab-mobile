<!--
  Main new-tab view.

  This is the first thing a user sees when they open a new tab. It renders:
    • A full-screen wallpaper (delegated to App.vue background layer).
    • A clock widget (hours, minutes, date).
    • A search bar wired to the selected search engine.
    • A grid of site shortcuts.
    • A floating action button that opens the settings panel.
-->
<template>
  <div class="page-container flex flex-col">
    <!-- Clock -->
    <section class="flex-1 flex-center flex-col select-none">
      <div class="text-white text-7xl font-light tracking-widest drop-shadow-lg">
        {{ formattedTime }}
      </div>
      <div v-if="settingsStore.settings.showDate" class="text-white text-lg mt-2 opacity-80">
        {{ formattedDate }}
      </div>
    </section>

    <!-- Search bar -->
    <section
      v-if="settingsStore.settings.showSearch"
      class="px-4 pb-4"
    >
      <!-- TODO: replace with the SearchBar component -->
      <div
        class="flex items-center bg-white bg-opacity-80 h-12 px-4"
        :style="{ borderRadius: `${settingsStore.settings.searchRadius}px` }"
      >
        <span class="iconfont text-gray-400 mr-2">🔍</span>
        <input
          v-model="searchQuery"
          class="flex-1 bg-transparent outline-none text-gray-700"
          :placeholder="t('search_placeholder')"
          @keydown.enter="handleSearch"
        />
      </div>
    </section>

    <!-- Site shortcuts grid -->
    <section
      v-if="settingsStore.settings.showSites"
      class="px-4 pb-safe"
    >
      <!-- TODO: replace with the SiteGrid component -->
      <p class="text-white text-center text-sm opacity-60">{{ t('your_shortcuts') }}</p>
    </section>

    <!-- FAB – opens settings -->
    <button
      class="absolute bottom-6 right-4 w-10 h-10 bg-white bg-opacity-20 rounded-full flex-center shadow"
      @click="goToSettings"
    >
      ⚙️
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { t } from '@/utils/i18n'
import { RouteType } from '@/constants'

const router = useRouter()
const settingsStore = useSettingsStore()

const searchQuery = ref('')
const now = ref(new Date())
let clockTimer: ReturnType<typeof setInterval>

// --- Clock ---
const formattedTime = computed(() => {
  const h = now.value.getHours()
  const m = now.value.getMinutes().toString().padStart(2, '0')
  if (settingsStore.settings.clockFormat === '12h') {
    const h12 = h % 12 || 12
    return `${h12}:${m}`
  }
  return `${h.toString().padStart(2, '0')}:${m}`
})

const formattedDate = computed(() =>
  now.value.toLocaleDateString(settingsStore.settings.lang.replace('_', '-'), {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }),
)

// --- Search ---
function handleSearch() {
  if (!searchQuery.value.trim()) return

  const engines: Record<string, string> = {
    google: 'https://www.google.com/search?q=',
    baidu: 'https://www.baidu.com/s?wd=',
    bing: 'https://www.bing.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
  }

  const base = engines[settingsStore.settings.searchEngine] ?? engines.google
  window.location.href = base + encodeURIComponent(searchQuery.value)
}

function goToSettings() {
  router.push({ name: RouteType.SETTINGS })
}

onMounted(() => {
  clockTimer = setInterval(() => { now.value = new Date() }, 1000)
})

onUnmounted(() => {
  clearInterval(clockTimer)
})
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 16px);
}
</style>
