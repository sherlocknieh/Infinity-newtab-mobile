<!--
  New-tab root component.

  Responsibilities:
    • Initialise all Pinia stores on mount (load persisted state).
    • Apply the current wallpaper as a full-screen background.
    • Apply CSS custom properties for dynamic border radii.
    • Gate navigation based on browser support (redirect to /not-support when
      the minimum Chrome version is not met).
    • Render <RouterView> so each sub-page is swapped in without a full reload.
-->
<template>
  <div class="page-container" :style="backgroundStyle">
    <!-- Full-screen wallpaper layer -->
    <div
      v-if="wallpaperStore.hasWallpaper"
      class="abs-full bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${wallpaperStore.currentUrl})` }"
    />

    <!-- Dim overlay -->
    <div
      v-if="wallpaperStore.maskOpacity > 0"
      class="abs-full bg-black"
      :style="{ opacity: wallpaperStore.maskOpacity / 100 }"
    />

    <!-- Router outlet -->
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWallpaperStore } from '@/stores/wallpaper'
import { useSettingsStore } from '@/stores/settings'
import { useUserStore } from '@/stores/user'
import { useSyncStore } from '@/stores/sync'
import { useSitesStore } from '@/stores/sites'
import { isSupportedChrome, isChrome } from '@/utils/platform'

const router = useRouter()
const wallpaperStore = useWallpaperStore()
const settingsStore = useSettingsStore()
const userStore = useUserStore()
const syncStore = useSyncStore()
const sitesStore = useSitesStore()

// Apply CSS custom properties for user-defined border radii.
const backgroundStyle = computed(() => ({
  '--search-radius': settingsStore.settings.searchRadius,
  '--icon-radius': settingsStore.settings.iconRadius,
}))

onMounted(async () => {
  // Redirect to the not-supported page for old/unsupported browsers.
  if (isChrome && !isSupportedChrome) {
    await router.replace('/not-support')
    return
  }

  // Hydrate all stores from persisted storage in parallel.
  await Promise.all([
    wallpaperStore.load(),
    settingsStore.load(),
    userStore.load(),
    syncStore.load(),
    sitesStore.load(),
  ])

  // If the user is logged in, refresh their profile in the background.
  if (userStore.isLoggedIn) {
    userStore.fetchProfile()
  }
})
</script>

<style scoped>
/* Scoped styles for the root layout. Component-level styles live in their own
   files; global / reset styles live in the WindiCSS base layer. */
</style>
