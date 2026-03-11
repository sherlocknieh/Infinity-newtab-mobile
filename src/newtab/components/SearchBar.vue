<!--
  SearchBar component.

  A styled search input wired to the user's selected search engine.
  The border-radius is driven by the searchRadius setting.
-->
<template>
  <div
    class="flex items-center bg-white bg-opacity-80 h-12 px-4"
    :style="{ borderRadius: `${settingsStore.settings.searchRadius}px` }"
  >
    <!-- Search engine icon -->
    <img
      v-if="engineIcon"
      :src="engineIcon"
      :alt="settingsStore.settings.searchEngine"
      class="w-5 h-5 mr-2 object-contain flex-shrink-0"
      @error="showEngineIcon = false"
    />
    <span v-else class="text-gray-400 mr-2 flex-shrink-0">🔍</span>

    <!-- Input -->
    <input
      v-model="query"
      class="flex-1 bg-transparent outline-none text-gray-700 text-sm"
      :placeholder="t('search_placeholder')"
      @keydown.enter="handleSearch"
    />

    <!-- Clear button -->
    <button
      v-if="query"
      class="text-gray-400 ml-2 flex-shrink-0"
      @click="query = ''"
    >
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { t } from '@/utils/i18n'

const settingsStore = useSettingsStore()

const query = ref('')
const showEngineIcon = ref(true)

const ENGINE_ICONS: Record<string, string> = {
  google: 'https://www.google.com/favicon.ico',
  baidu: 'https://www.baidu.com/favicon.ico',
  bing: 'https://www.bing.com/favicon.ico',
  duckduckgo: 'https://duckduckgo.com/favicon.ico',
}

const ENGINE_URLS: Record<string, string> = {
  google: 'https://www.google.com/search?q=',
  baidu: 'https://www.baidu.com/s?wd=',
  bing: 'https://www.bing.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q=',
}

const engineIcon = computed(() => {
  if (!showEngineIcon.value) return ''
  return ENGINE_ICONS[settingsStore.settings.searchEngine] ?? ENGINE_ICONS.google
})

function handleSearch() {
  const q = query.value.trim()
  if (!q) return
  const base = ENGINE_URLS[settingsStore.settings.searchEngine] ?? ENGINE_URLS.google
  window.location.href = base + encodeURIComponent(q)
}
</script>

<style scoped></style>
