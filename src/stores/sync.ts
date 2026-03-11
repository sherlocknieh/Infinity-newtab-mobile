/**
 * Sync store
 *
 * Handles cloud synchronisation of user data (settings, sites, wallpaper,
 * todos, notes) via the Infinity API WebSocket + REST back-end.
 * Persisted to chrome.storage.local under StoreKey.SYNC.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { StoreKey, WS_BASE } from '@/constants'
import { getStorage, setStorage } from '@/utils/storage'
import http, { ApiError } from '@/utils/http'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error'

export interface SyncPayload {
  settings?: unknown
  wallpaper?: unknown
  sites?: unknown
  todos?: unknown
  notes?: unknown
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useSyncStore = defineStore(StoreKey.SYNC, () => {
  // ---- state ----
  const status = ref<SyncStatus>('idle')
  const lastSyncedAt = ref<number | null>(null)
  const error = ref<string | null>(null)
  /** Items waiting to be merged after a conflict resolution. */
  const pendingRestore = ref<SyncPayload | null>(null)
  /** True while the WebSocket connection is being established. */
  const isConnecting = ref(false)

  let ws: WebSocket | null = null

  // ---- getters ----
  const isSyncing = computed(() => status.value === 'syncing')
  const hasPendingRestore = computed(() => pendingRestore.value !== null)

  // ---- actions ----

  async function load(): Promise<void> {
    const saved = await getStorage(StoreKey.SYNC) as {
      lastSyncedAt: number | null
      pendingRestore: SyncPayload | null
    } | undefined

    if (saved) {
      lastSyncedAt.value = saved.lastSyncedAt ?? null
      pendingRestore.value = saved.pendingRestore ?? null
    }
  }

  async function persist(): Promise<void> {
    await setStorage(StoreKey.SYNC, {
      lastSyncedAt: lastSyncedAt.value,
      pendingRestore: pendingRestore.value,
    })
  }

  /** Push local data to the cloud. */
  async function push(payload: SyncPayload): Promise<void> {
    status.value = 'syncing'
    error.value = null
    try {
      await http.post('/sync/push', payload)
      lastSyncedAt.value = Date.now()
      status.value = 'success'
      await persist()
    } catch (e) {
      status.value = 'error'
      error.value = e instanceof ApiError ? e.message : 'Sync push failed'
      throw e
    }
  }

  /** Pull cloud data and return it so the caller can apply it. */
  async function pull(): Promise<SyncPayload> {
    status.value = 'syncing'
    error.value = null
    try {
      const data = await http.get<SyncPayload>('/sync/pull')
      lastSyncedAt.value = Date.now()
      status.value = 'success'
      await persist()
      return data
    } catch (e) {
      status.value = 'error'
      error.value = e instanceof ApiError ? e.message : 'Sync pull failed'
      throw e
    }
  }

  /** Connect to the sync WebSocket for real-time updates. */
  function connectWS(token: string): void {
    if (ws && ws.readyState === WebSocket.OPEN) return
    isConnecting.value = true

    ws = new WebSocket(`${WS_BASE}/sync?token=${encodeURIComponent(token)}`)

    ws.addEventListener('open', () => {
      isConnecting.value = false
    })

    ws.addEventListener('message', (event: MessageEvent) => {
      // TODO: parse incoming sync events and apply them to the relevant stores.
      console.debug('[sync] ws message', event.data)
    })

    ws.addEventListener('close', () => {
      isConnecting.value = false
      ws = null
    })

    ws.addEventListener('error', () => {
      isConnecting.value = false
      error.value = 'WebSocket connection error'
    })
  }

  function disconnectWS(): void {
    ws?.close()
    ws = null
  }

  function setPendingRestore(data: SyncPayload): void {
    pendingRestore.value = data
    persist()
  }

  function clearPendingRestore(): void {
    pendingRestore.value = null
    persist()
  }

  return {
    // state
    status,
    lastSyncedAt,
    error,
    pendingRestore,
    isConnecting,
    // getters
    isSyncing,
    hasPendingRestore,
    // actions
    load,
    persist,
    push,
    pull,
    connectWS,
    disconnectWS,
    setPendingRestore,
    clearPendingRestore,
  }
})
