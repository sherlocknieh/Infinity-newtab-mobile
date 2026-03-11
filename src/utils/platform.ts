/**
 * Platform detection utilities
 *
 * Used to gate features that behave differently on mobile Chrome vs desktop
 * Chrome vs Firefox, and to determine whether the extension is running inside
 * the extension context or a regular web page.
 */

// ---------------------------------------------------------------------------
// User-agent helpers
// ---------------------------------------------------------------------------

const ua = navigator.userAgent.toLowerCase()

/** True when running on a touch-based (mobile / tablet) device. */
export const isMobile: boolean =
  /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(ua)

/** True when the browser is Google Chrome (desktop or mobile). */
export const isChrome: boolean =
  /chrome/.test(ua) && !/edge|opr\//.test(ua)

/** True when running inside Firefox. */
export const isFirefox: boolean = /firefox/.test(ua)

/** True when running on Android. */
export const isAndroid: boolean = /android/.test(ua)

/** True when running on iOS (iPhone / iPad). */
export const isIOS: boolean = /iphone|ipad|ipod/.test(ua)

// ---------------------------------------------------------------------------
// Extension context helpers
// ---------------------------------------------------------------------------

/**
 * True when the code is executing inside a Chrome extension context
 * (i.e. the chrome.* APIs are available).
 */
export const isExtension: boolean =
  typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined'

/**
 * Returns the extension's base URL for constructing asset paths that work
 * both in extension pages and during local development (Vite dev server).
 */
export function getExtensionBaseUrl(): string {
  if (isExtension) {
    return chrome.runtime.getURL('/')
  }
  return '/'
}

// ---------------------------------------------------------------------------
// Chrome version helpers
// ---------------------------------------------------------------------------

/**
 * Returns the numeric major version of Chrome, or -1 when not running in
 * Chrome.
 */
export function getChromeVersion(): number {
  const match = ua.match(/chrome\/(\d+)/)
  return match ? parseInt(match[1], 10) : -1
}

/**
 * True when the Chrome major version is at or above the minimum required
 * version declared in manifest.json (80).
 */
export const isSupportedChrome: boolean =
  isChrome && getChromeVersion() >= 80
