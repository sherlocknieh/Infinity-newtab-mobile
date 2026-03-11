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
      <SearchBar />
    </section>

    <!-- Site shortcuts grid -->
    <section
      v-if="settingsStore.settings.showSites"
      class="px-4 pb-safe"
    >
      <SiteGrid />
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
import { RouteType } from '@/constants'
import SearchBar from '@/newtab/components/SearchBar.vue'
import SiteGrid from '@/newtab/components/SiteGrid.vue'

const router = useRouter()
const settingsStore = useSettingsStore()

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
