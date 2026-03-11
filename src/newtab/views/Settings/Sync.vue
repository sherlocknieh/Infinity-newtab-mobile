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
import { t } from '@/utils/i18n'
import { Toast } from 'vant'

const router = useRouter()
const syncStore = useSyncStore()

const lastSyncedLabel = computed(() => {
  if (!syncStore.lastSyncedAt) return t('never')
  return new Date(syncStore.lastSyncedAt).toLocaleString()
})

async function handlePush() {
  try {
    // TODO: gather current store state and pass it to push().
    await syncStore.push({})
    Toast(t('sync_push_success'))
  } catch {
    Toast(t('sync_push_failed'))
  }
}

async function handlePull() {
  try {
    const _data = await syncStore.pull()
    // TODO: apply pulled data to the relevant stores.
    Toast(t('sync_pull_success'))
  } catch {
    Toast(t('sync_pull_failed'))
  }
}

function handleApplyRestore() {
  // TODO: apply pendingRestore data to all relevant stores.
  syncStore.clearPendingRestore()
  Toast(t('sync_restore_applied'))
}
</script>

<style scoped></style>
