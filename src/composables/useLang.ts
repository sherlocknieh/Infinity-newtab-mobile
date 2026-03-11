/**
 * useLang composable
 *
 * Reverse-engineered from composables.33790437.js in the compiled output.
 *
 * Provides reactive access to the browser UI language code and a convenience
 * flag for Chinese (zh-CN) interfaces that show alternative UI patterns.
 */

import { ref, computed, onMounted } from 'vue'
import { getLang } from '@/utils/i18n'

export function useLang() {
  const lang = ref('')

  /** True when the UI language is Simplified Chinese. */
  const isZh = computed(() => lang.value === 'zh-CN')

  onMounted(async () => {
    lang.value = await getLang()
  })

  return { lang, isZh }
}
