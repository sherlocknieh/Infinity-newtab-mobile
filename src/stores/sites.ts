/**
 * Sites store
 *
 * Manages the user's site shortcuts grid.
 * Each site has a name, URL, and optional icon.
 * Persisted to chrome.storage.local under StoreKey.SITES.
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { StoreKey } from '@/constants'
import { getStorage, setStorage } from '@/utils/storage'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Site {
  id: string
  name: string
  url: string
  /** Remote icon URL or data-URL for a custom uploaded icon. */
  icon?: string
  /** Single character used as a text avatar when no icon is available. */
  iconText?: string
  /** Background colour for the text avatar. */
  iconColor?: string
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

const DEFAULT_SITES: Site[] = [
  { id: 'google', name: 'Google', url: 'https://google.com', icon: 'https://www.google.com/favicon.ico' },
  { id: 'youtube', name: 'YouTube', url: 'https://youtube.com', icon: 'https://www.youtube.com/favicon.ico' },
  { id: 'github', name: 'GitHub', url: 'https://github.com', icon: 'https://github.com/favicon.ico' },
  { id: 'twitter', name: 'X / Twitter', url: 'https://x.com', icon: 'https://x.com/favicon.ico' },
]

export const useSitesStore = defineStore(StoreKey.SITES, () => {
  // ---- state ----
  const sites = ref<Site[]>([...DEFAULT_SITES])
  const isReady = ref(false)

  // ---- actions ----

  async function load(): Promise<void> {
    const saved = await getStorage(StoreKey.SITES) as Site[] | undefined
    if (saved && Array.isArray(saved)) {
      sites.value = saved
    }
    isReady.value = true
  }

  async function persist(): Promise<void> {
    await setStorage(StoreKey.SITES, sites.value)
  }

  async function addSite(site: Omit<Site, 'id'>): Promise<void> {
    const newSite: Site = {
      ...site,
      id: `site-${Date.now()}`,
    }
    sites.value = [...sites.value, newSite]
    await persist()
  }

  async function removeSite(id: string): Promise<void> {
    sites.value = sites.value.filter(s => s.id !== id)
    await persist()
  }

  async function updateSite(id: string, patch: Partial<Omit<Site, 'id'>>): Promise<void> {
    sites.value = sites.value.map(s => s.id === id ? { ...s, ...patch } : s)
    await persist()
  }

  async function reorder(newOrder: Site[]): Promise<void> {
    sites.value = newOrder
    await persist()
  }

  return {
    // state
    sites,
    isReady,
    // actions
    load,
    persist,
    addSite,
    removeSite,
    updateSite,
    reorder,
  }
})
