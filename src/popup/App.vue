<!--
  Popup root component — "Add Site Icon"

  Reverse-engineered from popup.bde56aba.js in the compiled output.

  The popup lets the user save the current browser tab as a shortcut icon on
  their Infinity New Tab page.  Flow:

    1. On mount: read the active tab's URL and title via chrome.tabs.query().
    2. Display an editable form with the icon name and a simple colour picker.
    3. On submit ("Done"): persist the new site into chrome.storage under the
       "store-sites" key and post a "slave-task:add-icon" message so the
       new-tab page refreshes its shortcut grid.
    4. Show a success screen for 3 s then auto-close the popup.

  Note: the original uses a rich custom icon-picker component.  This
  reconstruction uses Vant primitives that produce equivalent functionality.
-->
<template>
  <!-- Success state -->
  <div v-if="added" class="add-success flex-center flex-col h-full">
    <van-icon name="success" size="48" color="#4C84FF" class="mb-12px" />
    <div class="text-14px text-3a3a3c">{{ t('add_icon_success') }}</div>
  </div>

  <!-- Add-icon form -->
  <div v-else class="add-icon flex flex-col">
    <header class="w-full">
      <h2 class="font-medium text-center pt-26px text-18px">
        {{ t('popup_title') }}
      </h2>
    </header>

    <div class="w-full px-24px box-border mt-21px">
      <!-- Site name input -->
      <van-field
        v-model="siteName"
        :placeholder="t('icon_name')"
        :label="t('icon')"
        label-width="60"
        class="mb-16px"
      />

      <hr class="bg-ededed h-1px my-28px border-none" />

      <!-- Colour picker (simplified from the original icon-picker component) -->
      <div class="flex flex-wrap gap-8px mb-16px">
        <div
          v-for="color in PRESET_COLORS"
          :key="color"
          class="w-32px h-32px rounded-full cursor-pointer border-2"
          :class="{
            'border-primary': selectedColor === color,
            'border-transparent': selectedColor !== color,
          }"
          :style="{ backgroundColor: color }"
          @click="selectedColor = color"
        />
      </div>

      <!-- Submit button -->
      <button class="mx-auto w-full mt-24px i-main-button block" @click="handleAdd">
        {{ t('done') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { StoreKey } from '@/constants'
import { t } from '@/utils/i18n'
import { getStorage, setStorage } from '@/utils/storage'

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const siteName = ref('')
const siteUrl = ref('')
const selectedColor = ref('#4C84FF')
const added = ref(false)

const PRESET_COLORS = [
  '#4C84FF',
  '#FF6B6B',
  '#FFD93D',
  '#6BCB77',
  '#845EC2',
  '#FF9671',
  '#008E9B',
  '#F9F871',
]

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

onMounted(() => {
  // Populate the form with the active tab's title and URL.
  chrome.tabs.query({ currentWindow: true, active: true }, ([tab]) => {
    if (!tab) return
    siteUrl.value = tab.url ?? ''
    siteName.value = tab.title ?? ''
  })
})

// ---------------------------------------------------------------------------
// Add icon
// ---------------------------------------------------------------------------

/**
 * Generates a lightweight unique ID with an optional prefix.
 * Mirrors the `Pe` UUID generator from ajax.31203054.js in the compiled output.
 */
function generateId(prefix = ''): string {
  return (
    prefix +
    Date.now().toString(32) +
    Math.random().toString(36).slice(2, 10)
  )
}

async function handleAdd() {
  if (!siteName.value.trim()) return

  try {
    const newSite = {
      id: generateId('siteId-'),
      uuid: generateId(''),
      name: siteName.value.trim(),
      target: siteUrl.value,
      bgType: 'color',
      bgColor: selectedColor.value,
      bgText: siteName.value.trim().slice(0, 2),
      bgImage: '',
      bgColorImage: null,
      bgFont: 30,
      type: 'web',
      updatetime: Date.now(),
    }

    // Read the existing sites list from storage.
    const stored = (await getStorage(StoreKey.SITES)) as
      | { sites?: typeof newSite[] }
      | undefined
    const sites = stored?.sites ?? []
    sites.push(newSite)

    // Persist the updated list.
    await setStorage(StoreKey.SITES, { sites })

    // Notify any open new-tab pages so they can refresh their shortcut grid.
    // The background page routes this "slave-task:" message to the master.
    chrome.runtime.sendMessage({
      type: 'slave-task:add-icon',
      payload: { data: newSite },
    })

    // Show the success state then auto-close after 3 s.
    added.value = true
    setTimeout(() => window.close(), 3000)
  } catch (err) {
    console.error('[popup] handleAdd error:', err)
  }
}
</script>

<style scoped>
.add-icon {
  width: 360px;
  min-height: 480px;
}

.add-success {
  width: 360px;
  height: 536px;
}

.i-main-button {
  display: block;
  height: 44px;
  border-radius: 22px;
  background-color: #4c84ff;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

.i-main-button:active {
  opacity: 0.85;
}
</style>
