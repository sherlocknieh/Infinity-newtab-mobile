/**
 * i18n utilities
 *
 * Provides three helpers:
 *   • t()            – thin wrapper around chrome.i18n.getMessage()
 *   • getLang()      – returns the browser UI language code
 *   • loadLangData() – fetches the raw _locales/<lang>/messages.json and
 *                      flattens it into a simple key→string map, resolving
 *                      any placeholder tokens in the process.
 */

// ---------------------------------------------------------------------------
// Simple message lookup (Chrome i18n API)
// ---------------------------------------------------------------------------

/**
 * Looks up a localised string by key.  Falls back to the key itself when the
 * message is not found so the UI never displays an empty string.
 */
export const t = (key: string, substitutions?: string[]): string =>
  chrome.i18n.getMessage(key, substitutions) || key

// ---------------------------------------------------------------------------
// Language code
// ---------------------------------------------------------------------------

/**
 * Returns the Chrome UI language code (e.g. 'en_US', 'zh_CN').
 */
export const getLang = async (): Promise<string> =>
  chrome.i18n.getUILanguage()

// ---------------------------------------------------------------------------
// Full locale data loader (for runtime language switching)
// ---------------------------------------------------------------------------

/**
 * Fetches the messages.json for the given `lang` code and returns a flat
 * key→message map.  Placeholder tokens of the form `$KEY$` are replaced with
 * their `content` value so callers receive ready-to-display strings.
 *
 * The cache-busting query string (`?v=…`) matches the value used in the
 * compiled output.
 */
export const loadLangData = async (
  lang: string,
): Promise<Record<string, string>> => {
  // Chrome uses underscores in locale codes (e.g. zh_CN) but the directory
  // names in _locales also use underscores, so we normalise either separator.
  const langCode = lang.replace('-', '_')
  const origin = location.origin

  const res = await fetch(
    `${origin}/_locales/${langCode}/messages.json?v=1648797765101`,
  )

  if (!res.ok) {
    console.warn(`[i18n] Could not load locale "${langCode}": ${res.status}`)
    return {}
  }

  const data: Record<
    string,
    { message: string; placeholders?: Record<string, { content: string }> }
  > = await res.json()

  const result: Record<string, string> = {}

  for (const [key, val] of Object.entries(data)) {
    const { placeholders, message } = val
    result[key] = message

    // Replace placeholder tokens ($KEY$) with their resolved content values.
    if (placeholders && message) {
      for (const [pKey, pVal] of Object.entries(placeholders)) {
        // The compiled code uses the format `_${content}$_` as the
        // substitution marker so downstream code can identify dynamic parts.
        result[key] = result[key].replace(
          new RegExp(`\\$${pKey}\\$`, 'gi'),
          `_${pVal.content}$_`,
        )
      }
    }
  }

  return result
}
