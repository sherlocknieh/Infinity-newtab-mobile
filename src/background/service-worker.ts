/**
 * Background Service Worker (MV3)
 *
 * Replaces the MV2 background page. Runs as a Chrome Extension service
 * worker for the lifetime of an event-driven session.
 *
 * Responsibilities:
 *   • Install / update lifecycle hooks (chrome.runtime.onInstalled).
 *   • Handle cross-component messaging via chrome.runtime.onMessage.
 *   • Schedule periodic wallpaper auto-change alarms.
 *   • Coordinate sync operations when the user is online.
 */

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

chrome.storage.local.get('store-settings', (data) => {
  const interval: number = (data['store-settings'] as { autoChangeInterval?: number } | undefined)?.autoChangeInterval ?? 0
  setupWallpaperAlarm(interval)
})
