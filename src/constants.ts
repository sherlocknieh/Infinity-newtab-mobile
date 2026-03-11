// ---------------------------------------------------------------------------
// App-wide constants
// All magic strings/numbers should be imported from here rather than inlined.
// ---------------------------------------------------------------------------

export const APP_VERSION = '3.0.17'

/** Shared secret used for request signing / token derivation.
 *  NOTE: This value is already present in the distributed compiled extension
 *  binary and is not a credential that grants access on its own. It is kept
 *  here to match the compiled output exactly. Do not use this pattern for
 *  new secrets – prefer environment variables injected at build time. */
export const SECRET_KEY = 'jksjiowufowjlkfsmcvuv'

export const API_BASE = 'https://api.infinitynewtab.com/v2'
export const ICON_API = 'https://infinity-api.infinitynewtab.com'
export const WS_BASE = 'https://ws.infinitynewtab.com'
export const BAIDU_SUGGESTION = 'https://suggestion.baidu.com'
export const GOOGLE = 'https://google.com'

// ---------------------------------------------------------------------------
// Route names – must match the names used in src/newtab/router/index.ts
// ---------------------------------------------------------------------------
export enum RouteType {
  WALLPAPER = 'mobile-wallpaper',
  SETTINGS = 'mobile-settings',
  PC_SETTINGS = 'setting',
  SITES = 'site',
  TODO = 'todo',
  NOTE = 'note',
  SEARCH = 'searcher',
}

// ---------------------------------------------------------------------------
// Pinia store IDs – used as the unique `id` passed to defineStore()
// ---------------------------------------------------------------------------
export enum StoreKey {
  WALLPAPER = 'store-wallpaper',
  SETTINGS = 'store-settings',
  PC_SETTINGS = 'store-setting',
  SITES = 'store-sites',
  SEARCH = 'store-search',
  TODO = 'store-todo',
  NOTE = 'store-note',
  USER = 'store-user',
  SYNC = 'store-sync',
  RESTORE = 'store-waitmerge',
}

// ---------------------------------------------------------------------------
// localStorage / chrome.storage key names
// ---------------------------------------------------------------------------
export const LANG_CODE_KEY = 'langCode'
export const PRE_RENDER_KEY = 'pre-render'
export const PRE_RENDER_SETTING_KEY = 'pre-render-setting'
