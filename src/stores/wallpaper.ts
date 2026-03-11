/**
 * Wallpaper store
 *
 * Manages the current wallpaper selection, wallpaper categories, and
 * transitions.  Wallpaper data is persisted to chrome.storage.local via the
 * StoreKey.WALLPAPER key so it survives browser restarts.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { StoreKey } from '@/constants'
import { getStorage, setStorage } from '@/utils/storage'
import http from '@/utils/http'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Wallpaper {
  id: string
  url: string
  thumbUrl: string
  category: string
  author?: string
  /** Whether the user has saved this wallpaper to their favourites. */
  isFavourite?: boolean
}

export interface WallpaperCategory {
  id: string
  name: string
  cover: string
}

export type WallpaperSource = 'online' | 'local' | 'custom'

export interface WallpaperState {
  current: Wallpaper | null
  source: WallpaperSource
  /** Opacity of the wallpaper overlay (0–100). */
  maskOpacity: number
  /** Whether to blur the wallpaper behind widgets. */
  blur: boolean
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useWallpaperStore = defineStore(StoreKey.WALLPAPER, () => {
  // ---- state ----
  const current = ref<Wallpaper | null>(null)
  const source = ref<WallpaperSource>('online')
  const maskOpacity = ref(0)
  const blur = ref(false)
  const categories = ref<WallpaperCategory[]>([])
  const isLoading = ref(false)
  const isFetchingCategories = ref(false)

  // ---- getters ----
  const currentUrl = computed(() => current.value?.url ?? '')
  const hasWallpaper = computed(() => current.value !== null)

  // ---- actions ----

  async function load(): Promise<void> {
    const saved = await getStorage(StoreKey.WALLPAPER) as WallpaperState | undefined
    if (saved) {
      current.value = saved.current
      source.value = saved.source ?? 'online'
      maskOpacity.value = saved.maskOpacity ?? 0
      blur.value = saved.blur ?? false
    }
  }

  async function persist(): Promise<void> {
    await setStorage(StoreKey.WALLPAPER, {
      current: current.value,
      source: source.value,
      maskOpacity: maskOpacity.value,
      blur: blur.value,
    })
  }

  async function setWallpaper(wallpaper: Wallpaper, wallpaperSource: WallpaperSource = 'online'): Promise<void> {
    current.value = wallpaper
    source.value = wallpaperSource
    await persist()
  }

  async function clearWallpaper(): Promise<void> {
    current.value = null
    source.value = 'online'
    await persist()
  }

  async function fetchCategories(): Promise<void> {
    if (isFetchingCategories.value) return
    isFetchingCategories.value = true
    try {
      const data = await http.get<WallpaperCategory[]>('/wallpaper/categories')
      categories.value = data
    } catch (err) {
      console.error('[wallpaper] fetchCategories failed', err)
    } finally {
      isFetchingCategories.value = false
    }
  }

  async function fetchWallpapers(categoryId: string): Promise<Wallpaper[]> {
    isLoading.value = true
    try {
      return await http.get<Wallpaper[]>(`/wallpaper/list?category=${categoryId}`)
    } catch (err) {
      console.error('[wallpaper] fetchWallpapers failed', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  return {
    // state
    current,
    source,
    maskOpacity,
    blur,
    categories,
    isLoading,
    isFetchingCategories,
    // getters
    currentUrl,
    hasWallpaper,
    // actions
    load,
    persist,
    setWallpaper,
    clearWallpaper,
    fetchCategories,
    fetchWallpapers,
  }
})
