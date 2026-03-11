<!--
  Popup root component.

  The popup is a compact panel (320 × 480 px, set in CSS) that lets the user:
    • Open the new-tab page in the current tab.
    • Quickly toggle the wallpaper or search-bar visibility.
    • See a summary of their sync status.
    • Navigate to the full settings page (opens in the current tab).

  This is intentionally kept lightweight – heavy features belong in the
  new-tab page.
-->
<template>
  <div class="popup-container flex flex-col bg-white">
    <!-- Header -->
    <div class="flex-between px-4 py-3 border-b border-gray-100">
      <span class="font-semibold text-gray-800 text-sm">Infinity New Tab</span>
      <span class="text-xs text-gray-400">v{{ APP_VERSION }}</span>
    </div>

    <!-- Quick actions -->
    <div class="flex-1 overflow-y-auto p-4 space-y-3">
      <!-- Open new tab -->
      <van-button block type="primary" size="small" @click="openNewTab">
        {{ t('popup_open_newtab') }}
      </van-button>

      <!-- Settings link -->
      <van-button block plain type="primary" size="small" @click="openSettings">
        {{ t('popup_open_settings') }}
      </van-button>
    </div>

    <!-- Footer -->
    <div class="px-4 py-2 border-t border-gray-100 text-xs text-gray-400 text-center">
      {{ t('popup_footer') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { APP_VERSION } from '@/constants'
import { t } from '@/utils/i18n'

function openNewTab() {
  chrome.tabs.create({ url: chrome.runtime.getURL('newtab/index.html') })
  window.close()
}

function openSettings() {
  chrome.tabs.create({ url: chrome.runtime.getURL('newtab/index.html') + '#/settings' })
  window.close()
}
</script>

<style scoped>
.popup-container {
  width: 320px;
  min-height: 200px;
}
</style>
