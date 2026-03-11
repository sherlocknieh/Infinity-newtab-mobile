<!--
  Sync settings page.

  Lets the user:
    • Trigger a manual cloud push / pull.
    • See the last-synced timestamp.
    • Resolve any pending merge conflicts (restore from cloud).
-->
<template>
  <div class="flex flex-col h-full bg-gray-50">
    <van-nav-bar :title="t('sync_title')" left-arrow @click-left="router.back()" />

    <div class="flex-1 overflow-y-auto">
      <!-- Status card -->
      <van-cell-group inset class="mt-4">
        <van-cell :title="t('sync_last_synced')">
          <template #value>
            <span class="text-gray-500 text-sm">
              {{ lastSyncedLabel }}
            </span>
          </template>
        </van-cell>
        <van-cell :title="t('sync_status')">
          <template #value>
            <van-loading v-if="syncStore.isSyncing" size="16" />
            <span v-else-if="syncStore.status === 'success'" class="text-green-500">✓</span>
            <span v-else-if="syncStore.status === 'error'" class="text-red-500">✗</span>
            <span v-else class="text-gray-400">–</span>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- Actions -->
      <van-cell-group inset class="mt-4">
        <van-cell
          :title="t('sync_push')"
          is-link
          @click="handlePush"
        />
        <van-cell
          :title="t('sync_pull')"
          is-link
          @click="handlePull"
        />
      </van-cell-group>

      <!-- Pending restore -->
      <van-cell-group v-if="syncStore.hasPendingRestore" inset class="mt-4">
        <van-notice-bar :text="t('sync_pending_restore_notice')" color="#1989fa" background="#ecf9ff" />
        <van-cell :title="t('sync_apply_restore')" is-link @click="handleApplyRestore" />
        <van-cell :title="t('sync_discard_restore')" is-link @click="syncStore.clearPendingRestore" />
      </van-cell-group>

      <!-- Error message -->
      <div v-if="syncStore.error" class="mx-4 mt-4 p-3 bg-red-50 rounded text-red-600 text-sm">
        {{ syncStore.error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSyncStore } from '@/stores/sync'
import { useSettingsStore } from '@/stores/settings'
import { useWallpaperStore } from '@/stores/wallpaper'
import { useSitesStore } from '@/stores/sites'
import { t } from '@/utils/i18n'
import { Toast } from 'vant'

const router = useRouter()
const syncStore = useSyncStore()
const settingsStore = useSettingsStore()
const wallpaperStore = useWallpaperStore()
const sitesStore = useSitesStore()

const lastSyncedLabel = computed(() => {
  if (!syncStore.lastSyncedAt) return t('never')
  return new Date(syncStore.lastSyncedAt).toLocaleString()
})

async function handlePush() {
  try {
    await syncStore.push({
      settings: settingsStore.settings,
      wallpaper: {
        current: wallpaperStore.current,
        source: wallpaperStore.source,
        maskOpacity: wallpaperStore.maskOpacity,
        blur: wallpaperStore.blur,
      },
      sites: sitesStore.sites,
    })
    Toast(t('sync_push_success'))
  } catch {
    Toast(t('sync_push_failed'))
  }
}

async function handlePull() {
  try {
    const data = await syncStore.pull()
    if (data.settings) {
      await settingsStore.save(data.settings as Parameters<typeof settingsStore.save>[0])
    }
    if (data.wallpaper) {
      const wp = data.wallpaper as { current: Parameters<typeof wallpaperStore.setWallpaper>[0]; source: Parameters<typeof wallpaperStore.setWallpaper>[1]; maskOpacity: number; blur: boolean }
      if (wp.current) {
        await wallpaperStore.setWallpaper(wp.current, wp.source ?? 'online')
      }
      if (typeof wp.maskOpacity === 'number') {
        wallpaperStore.maskOpacity = wp.maskOpacity
      }
      if (typeof wp.blur === 'boolean') {
        wallpaperStore.blur = wp.blur
      }
      await wallpaperStore.persist()
    }
    if (data.sites && Array.isArray(data.sites)) {
      await sitesStore.reorder(data.sites as Parameters<typeof sitesStore.reorder>[0])
    }
    Toast(t('sync_pull_success'))
  } catch {
    Toast(t('sync_pull_failed'))
  }
}

async function handleApplyRestore() {
  const data = syncStore.pendingRestore
  if (!data) return
  if (data.settings) {
    await settingsStore.save(data.settings as Parameters<typeof settingsStore.save>[0])
  }
  if (data.wallpaper) {
    const wp = data.wallpaper as { current: Parameters<typeof wallpaperStore.setWallpaper>[0]; source: Parameters<typeof wallpaperStore.setWallpaper>[1]; maskOpacity: number; blur: boolean }
    if (wp.current) {
      await wallpaperStore.setWallpaper(wp.current, wp.source ?? 'online')
    }
    if (typeof wp.maskOpacity === 'number') {
      wallpaperStore.maskOpacity = wp.maskOpacity
    }
    if (typeof wp.blur === 'boolean') {
      wallpaperStore.blur = wp.blur
    }
    await wallpaperStore.persist()
  }
  if (data.sites && Array.isArray(data.sites)) {
    await sitesStore.reorder(data.sites as Parameters<typeof sitesStore.reorder>[0])
  }
  syncStore.clearPendingRestore()
  Toast(t('sync_restore_applied'))
}
</script>

<style scoped></style>
