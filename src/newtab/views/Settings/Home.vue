<!--
  Settings home page.

  Lists the top-level settings groups:
    • Appearance (wallpaper, border radii)
    • Widgets (search, clock, sites)
    • Language
    • Account
    • Sync
    • About / Third party
-->
<template>
  <div class="flex flex-col h-full bg-gray-50">
    <van-nav-bar
      :title="t('settings_title')"
      left-arrow
      @click-left="router.back()"
    />

    <div class="flex-1 overflow-y-auto">
      <!-- Appearance -->
      <van-cell-group :title="t('settings_appearance')" inset class="mt-4">
        <van-cell
          :title="t('settings_wallpaper')"
          is-link
          @click="router.push({ name: RouteType.WALLPAPER })"
        >
          <template #icon><span class="mr-2">🖼</span></template>
        </van-cell>

        <van-cell :title="t('settings_search_radius')" center>
          <template #label>
            <van-slider
              v-model="searchRadius"
              :min="0"
              :max="100"
              @change="onSearchRadiusChange"
            />
          </template>
        </van-cell>

        <van-cell :title="t('settings_icon_radius')" center>
          <template #label>
            <van-slider
              v-model="iconRadius"
              :min="0"
              :max="100"
              @change="onIconRadiusChange"
            />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- Widgets -->
      <van-cell-group :title="t('settings_widgets')" inset class="mt-4">
        <van-cell :title="t('settings_show_search')" center>
          <template #right-icon>
            <van-switch v-model="showSearch" @change="v => settingsStore.update({ showSearch: v })" />
          </template>
        </van-cell>
        <van-cell :title="t('settings_show_clock')" center>
          <template #right-icon>
            <van-switch v-model="showClock" @change="v => settingsStore.update({ showClock: v })" />
          </template>
        </van-cell>
        <van-cell :title="t('settings_show_sites')" center>
          <template #right-icon>
            <van-switch v-model="showSites" @change="v => settingsStore.update({ showSites: v })" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- Account & sync -->
      <van-cell-group :title="t('settings_account')" inset class="mt-4">
        <van-cell
          :title="userStore.isLoggedIn ? userStore.displayName : t('settings_login')"
          is-link
          @click="router.push({ name: userStore.isLoggedIn ? 'settings-user' : 'login' })"
        >
          <template #icon><span class="mr-2">👤</span></template>
        </van-cell>
        <van-cell :title="t('settings_sync')" is-link @click="router.push({ name: 'settings-sync' })">
          <template #icon><span class="mr-2">☁️</span></template>
        </van-cell>
      </van-cell-group>

      <!-- Misc -->
      <van-cell-group :title="t('settings_other')" inset class="mt-4">
        <van-cell :title="t('settings_language')" is-link @click="router.push({ name: 'settings-language' })">
          <template #icon><span class="mr-2">🌐</span></template>
        </van-cell>
        <van-cell :title="t('settings_about')" is-link @click="router.push({ name: 'settings-about' })">
          <template #icon><span class="mr-2">ℹ️</span></template>
        </van-cell>
        <van-cell :title="t('settings_third_party')" is-link @click="router.push({ name: 'settings-third-party' })">
          <template #icon><span class="mr-2">📦</span></template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useUserStore } from '@/stores/user'
import { t } from '@/utils/i18n'
import { RouteType } from '@/constants'

const router = useRouter()
const settingsStore = useSettingsStore()
const userStore = useUserStore()

const searchRadius = ref(settingsStore.settings.searchRadius)
const iconRadius = ref(settingsStore.settings.iconRadius)
const showSearch = ref(settingsStore.settings.showSearch)
const showClock = ref(settingsStore.settings.showClock)
const showSites = ref(settingsStore.settings.showSites)

function onSearchRadiusChange(val: number) {
  settingsStore.update({ searchRadius: val })
}

function onIconRadiusChange(val: number) {
  settingsStore.update({ iconRadius: val })
}

onMounted(() => {
  searchRadius.value = settingsStore.settings.searchRadius
  iconRadius.value = settingsStore.settings.iconRadius
  showSearch.value = settingsStore.settings.showSearch
  showClock.value = settingsStore.settings.showClock
  showSites.value = settingsStore.settings.showSites
})
</script>

<style scoped></style>
