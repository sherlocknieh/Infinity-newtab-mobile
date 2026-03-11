/**
 * Settings store
 *
 * Manages all user-configurable preferences for the new-tab page.
 * Persisted to chrome.storage.local under StoreKey.SETTINGS.
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { StoreKey, LANG_CODE_KEY } from '@/constants'
import { getStorage, setStorage, mergeStorage } from '@/utils/storage'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SearchEngine = 'google' | 'baidu' | 'bing' | 'duckduckgo' | string

export interface SearchEngineConfig {
  id: SearchEngine
  name: string
  url: string
  suggestUrl?: string
  icon?: string
}

export interface SettingsState {
  /** BCP-47 language code, e.g. 'en_US'. */
  lang: string
  /** Which search engine powers the search bar. */
  searchEngine: SearchEngine
  /** Show/hide the search bar. */
  showSearch: boolean
  /** Show/hide the site shortcuts grid. */
  showSites: boolean
  /** Show/hide the clock widget. */
  showClock: boolean
  /** 12/24 hour clock format. */
  clockFormat: '12h' | '24h'
  /** Show/hide the date below the clock. */
  showDate: boolean
  /** Enable/disable wallpaper auto-change. */
  autoChangeWallpaper: boolean
  /** Interval in minutes for auto-change (default 30). */
  autoChangeInterval: number
  /** Corner radius for search box (CSS px value, stored as a number). */
  searchRadius: number
  /** Corner radius for site icons. */
  iconRadius: number
}

const DEFAULT_SETTINGS: SettingsState = {
  lang: 'en_US',
  searchEngine: 'google',
  showSearch: true,
  showSites: true,
  showClock: true,
  clockFormat: '24h',
  showDate: true,
  autoChangeWallpaper: false,
  autoChangeInterval: 30,
  searchRadius: 54,
  iconRadius: 54,
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useSettingsStore = defineStore(StoreKey.SETTINGS, () => {
  // ---- state ----
  const settings = ref<SettingsState>({ ...DEFAULT_SETTINGS })
  const isReady = ref(false)

  // ---- actions ----

  async function load(): Promise<void> {
    const saved = await getStorage(StoreKey.SETTINGS) as Partial<SettingsState> | undefined
    if (saved) {
      settings.value = { ...DEFAULT_SETTINGS, ...saved }
    }

    // Also sync the lang setting from the dedicated langCode key.
    const storedLang = await getStorage(LANG_CODE_KEY, 'localStorage') as string | null
    if (storedLang) {
      settings.value.lang = storedLang
    }

    isReady.value = true
  }

  async function save(patch?: Partial<SettingsState>): Promise<void> {
    if (patch) {
      settings.value = { ...settings.value, ...patch }
    }
    await setStorage(StoreKey.SETTINGS, settings.value)
  }

  async function update(patch: Partial<SettingsState>): Promise<void> {
    settings.value = { ...settings.value, ...patch }
    await mergeStorage(StoreKey.SETTINGS, patch as Record<string, unknown>)
  }

  async function setLang(lang: string): Promise<void> {
    settings.value.lang = lang
    // Language is stored both in chrome.storage (part of the full settings
    // object) and in localStorage for fast pre-render access.
    await update({ lang })
    localStorage.setItem(LANG_CODE_KEY, lang)
  }

  function reset(): void {
    settings.value = { ...DEFAULT_SETTINGS }
  }

  return {
    settings,
    isReady,
    load,
    save,
    update,
    setLang,
    reset,
  }
})
