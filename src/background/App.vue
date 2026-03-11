<!--
  Background page root component.

  There is no visible UI in the background page. All logic lives in the
  <script setup> block and in the composables/services it calls.

  The component renders an empty <div> purely to satisfy Vue's requirement
  for a single root element.
-->
<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { APP_VERSION } from '@/constants'

// ---------------------------------------------------------------------------
// Install / update lifecycle
// ---------------------------------------------------------------------------

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.info(`[bg] Infinity New Tab v${APP_VERSION} installed.`)
    // TODO: open a welcome / onboarding tab on first install.
  } else if (details.reason === 'update') {
    console.info(`[bg] Updated from ${details.previousVersion} → ${APP_VERSION}`)
    // TODO: show a changelog notification on major updates.
  }
})

// ---------------------------------------------------------------------------
// Message bus
// ---------------------------------------------------------------------------

chrome.runtime.onMessage.addListener(
  (
    message: { type: string; payload?: unknown },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void,
  ) => {
    switch (message.type) {
      case 'GET_VERSION':
        sendResponse({ version: APP_VERSION })
        break

      // TODO: handle SYNC_PUSH, SYNC_PULL, WALLPAPER_CHANGE, etc.

      default:
        // Unknown message – ignore silently.
        break
    }

    // Return true to keep the message channel open for async responses.
    return true
  },
)

// ---------------------------------------------------------------------------
// Alarms (periodic tasks)
// ---------------------------------------------------------------------------

/**
 * Set up a repeating alarm for wallpaper auto-change.
 * The interval is read from chrome.storage so it stays in sync with the
 * settings the user chose in the new-tab page.
 */
function setupWallpaperAlarm(intervalMinutes: number) {
  chrome.alarms.clear('wallpaper-autochange', () => {
    if (intervalMinutes > 0) {
      chrome.alarms.create('wallpaper-autochange', {
        periodInMinutes: intervalMinutes,
      })
    }
  })
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'wallpaper-autochange') {
    // TODO: notify all open new-tab pages to rotate the wallpaper.
    chrome.runtime.sendMessage({ type: 'WALLPAPER_AUTO_CHANGE' })
  }
})

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

onMounted(() => {
  // Read the auto-change interval from storage and arm the alarm.
  chrome.storage.local.get('store-settings', (data) => {
    const interval: number = data['store-settings']?.autoChangeInterval ?? 0
    setupWallpaperAlarm(interval)
  })
})
</script>
