/**
 * Ambient type declarations for Chrome Extension APIs used by this project.
 *
 * The @types/chrome package covers the full chrome.* namespace. This file
 * adds any project-specific augmentations or re-exports for convenience.
 */

/// <reference types="chrome" />

// Vite's virtual modules (WindiCSS, etc.)
declare module 'virtual:windi.css' {
  const css: string
  export default css
}

declare module 'virtual:windi-base.css' {
  const css: string
  export default css
}

declare module 'virtual:windi-components.css' {
  const css: string
  export default css
}

declare module 'virtual:windi-utilities.css' {
  const css: string
  export default css
}

// Extend Window with any globals injected by the extension runtime.
interface Window {
  /** Set by the background page to expose the current extension version. */
  APP_VERSION?: string
}
