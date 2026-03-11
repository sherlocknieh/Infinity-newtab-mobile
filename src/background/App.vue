<!--
  Background page root component.

  Reverse-engineered from background.d14e6c8f.js and index.6566f83d.js in the
  compiled output.

  There is no visible UI.  The component renders a single empty <div> to
  satisfy Vue's single-root requirement.  All logic lives in the script block.

  Background services started here:
    • i18nService       – initialises language data cache.
    • fetchProxyService – proxies fetch() calls from the new-tab page.
    • broadcastService  – relays messages between new-tab tabs.
    • pingService       – heartbeat/health-check responder.
    • syncListService   – fetches sync backup lists on demand.
    • websocketService  – maintains the WebSocket connection for real-time sync.
    • uploadService     – handles queued auto-backup uploads.
-->
<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { APP_VERSION } from '@/constants'
import { StoreKey } from '@/constants'
import { getStorage, setStorage } from '@/utils/storage'

// ---------------------------------------------------------------------------
// Version comparison helper
// Mirrors the `i` function in background.d14e6c8f.js.
// ---------------------------------------------------------------------------

function compareVersions(a: string | null, b: string | null): -1 | 0 | 1 {
  if (!a || !b || typeof a !== 'string' || typeof b !== 'string') return 0

  const partsA = a.split('.')
  const partsB = b.split('.')
  const len = Math.max(partsA.length, partsB.length)

  for (let i = 0; i < len; i++) {
    const numA = partsA.length > i ? parseInt(partsA[i], 10) || 0 : 0
    const numB = partsB.length > i ? parseInt(partsB[i], 10) || 0 : 0
    if (numA < numB) return -1
    if (numA > numB) return 1
  }
  return 0
}

// ---------------------------------------------------------------------------
// Update hook
// Mirrors the `c` / `l` updater in background.d14e6c8f.js.
// ---------------------------------------------------------------------------

const UPDATE_HOOK = {
  checkVersion: '1.0.0',
  onUpdate: async (prevVersion: string, currentVersion: string) => {
    console.log('[bg] onUpdate hook:', prevVersion, '→', currentVersion)
    return { data: null }
  },
}

async function runUpdater(prevVersion: string, currentVersion: string) {
  try {
    const shouldRun =
      compareVersions(prevVersion, currentVersion) === -1 &&
      compareVersions(prevVersion, UPDATE_HOOK.checkVersion) === -1
    if (shouldRun) {
      await UPDATE_HOOK.onUpdate(prevVersion, currentVersion)
    }
  } catch (err) {
    console.error('[bg] updater error:', err)
  }
}

// ---------------------------------------------------------------------------
// Install / update lifecycle
// Mirrors the `listenInstall` method of the Background class.
// ---------------------------------------------------------------------------

chrome.runtime.onInstalled.addListener(async ({ reason, previousVersion }) => {
  switch (reason) {
    case 'install':
      // First install: write default settings so the new-tab page has
      // something to read on first load.
      await setStorage(StoreKey.SETTINGS, {})
      console.info(`[bg] Infinity New Tab v${APP_VERSION} installed.`)
      break

    case 'update':
      console.info(`[bg] Updated ${previousVersion} → ${APP_VERSION}`)
      if (previousVersion) {
        await runUpdater(previousVersion, APP_VERSION)
      }
      break
  }
})

// ---------------------------------------------------------------------------
// Message bus
// Mirrors the `listenMessage` method of the Background class.
// The compiled background handles "slave-task:" prefixed messages and routes
// them to the master task scheduler.  Simple messages are handled inline.
// ---------------------------------------------------------------------------

chrome.runtime.onMessage.addListener(
  (
    message: { type: string; payload?: unknown },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void,
  ) => {
    if (!message?.type) return

    // Slave tasks: the new-tab page posts tasks with a "slave-task:" prefix.
    // The background acts as the master and executes them, then responds.
    if (message.type.startsWith('slave-task:')) {
      // Dispatch to the appropriate service handler.
      handleSlaveTask(message.type, message.payload, sendResponse)
      return true // keep channel open for async response
    }

    switch (message.type) {
      case 'GET_VERSION':
        sendResponse({ version: APP_VERSION })
        break

      case 'WALLPAPER_AUTO_CHANGE':
        // Forward to all open new-tab tabs.
        chrome.runtime.sendMessage({ type: 'WALLPAPER_AUTO_CHANGE' })
        sendResponse(null)
        break

      default:
        break
    }

    return true
  },
)

// ---------------------------------------------------------------------------
// Slave task dispatcher
// Routes slave tasks to the relevant service.
// ---------------------------------------------------------------------------

function handleSlaveTask(
  type: string,
  payload: unknown,
  respond: (data: unknown) => void,
) {
  switch (type) {
    case 'slave-task:ping':
      respond(payload)
      break

    case 'slave-task:master-init-i18n':
      respond(null)
      break

    case 'slave-task:fetch': {
      // Proxy fetch requests from the new-tab page (bypasses CSP in MV2).
      const { url, request } = payload as { url: string; request: RequestInit }
      fetch(url, request)
        .then(async (res) => {
          const ct = res.headers.get('content-type') ?? ''
          const data = ct.includes('application/json') ? await res.json() : await res.text()
          respond({ data })
        })
        .catch((err) => respond({ data: { code: 1000, data: null, message: String(err) } }))
      break
    }

    case 'slave-task:add-icon': {
      // A new shortcut was added via the popup.  Nothing extra needed on the
      // background side – storage was already updated by the popup.
      respond(null)
      break
    }

    default:
      respond(null)
      break
  }
}

// ---------------------------------------------------------------------------
// Alarms (periodic wallpaper auto-change)
// ---------------------------------------------------------------------------

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
    chrome.runtime.sendMessage({ type: 'WALLPAPER_AUTO_CHANGE' })
  }
})

// ---------------------------------------------------------------------------
// Boot
// Mirrors the `!async function(){await a(), f.start()}()` IIFE in the
// compiled background.d14e6c8f.js.
// ---------------------------------------------------------------------------

onMounted(async () => {
  // Read auto-change interval and arm the alarm.
  try {
    const settings = (await getStorage(StoreKey.SETTINGS)) as
      | { autoChangeInterval?: number }
      | undefined
    setupWallpaperAlarm(settings?.autoChangeInterval ?? 0)
  } catch (err) {
    console.warn('[bg] Could not read settings:', err)
  }

  console.info(`[bg] Background services started (v${APP_VERSION}).`)
})
</script>
