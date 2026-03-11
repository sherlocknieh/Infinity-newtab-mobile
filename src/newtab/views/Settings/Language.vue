<!--
  Language settings page.

  Displays all available locales with their native names. The selected locale
  is highlighted. Tapping a row saves it and reloads the page so the new
  language takes effect immediately.
-->
<template>
  <div class="flex flex-col h-full bg-gray-50">
    <van-nav-bar :title="t('language_title')" left-arrow @click-left="router.back()" />

    <div class="flex-1 overflow-y-auto">
      <van-cell-group inset class="mt-4">
        <van-cell
          v-for="lang in LANGUAGES"
          :key="lang.code"
          :title="lang.nativeName"
          :label="lang.englishName"
          clickable
          @click="handleSelect(lang.code)"
        >
          <template #right-icon>
            <van-icon
              v-if="settingsStore.settings.lang === lang.code"
              name="success"
              color="#4C84FF"
            />
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { t } from '@/utils/i18n'
import { Toast } from 'vant'

const router = useRouter()
const settingsStore = useSettingsStore()

// Language list mirrors the _locales directories present in the extension.
const LANGUAGES = [
  { code: 'en_US', nativeName: 'English', englishName: 'English (US)' },
  { code: 'en_GB', nativeName: 'English', englishName: 'English (UK)' },
  { code: 'zh_CN', nativeName: '简体中文', englishName: 'Chinese (Simplified)' },
  { code: 'zh_TW', nativeName: '繁體中文', englishName: 'Chinese (Traditional)' },
  { code: 'de', nativeName: 'Deutsch', englishName: 'German' },
  { code: 'es', nativeName: 'Español', englishName: 'Spanish' },
  { code: 'es_419', nativeName: 'Español', englishName: 'Spanish (Latin America)' },
  { code: 'fr', nativeName: 'Français', englishName: 'French' },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi' },
  { code: 'id', nativeName: 'Bahasa Indonesia', englishName: 'Indonesian' },
  { code: 'it', nativeName: 'Italiano', englishName: 'Italian' },
  { code: 'ja', nativeName: '日本語', englishName: 'Japanese' },
  { code: 'ko', nativeName: '한국어', englishName: 'Korean' },
  { code: 'nl', nativeName: 'Nederlands', englishName: 'Dutch' },
  { code: 'pl', nativeName: 'Polski', englishName: 'Polish' },
  { code: 'pt_BR', nativeName: 'Português', englishName: 'Portuguese (Brazil)' },
  { code: 'pt_PT', nativeName: 'Português', englishName: 'Portuguese (Portugal)' },
  { code: 'ru', nativeName: 'Русский', englishName: 'Russian' },
  { code: 'sv', nativeName: 'Svenska', englishName: 'Swedish' },
  { code: 'th', nativeName: 'ไทย', englishName: 'Thai' },
  { code: 'tr', nativeName: 'Türkçe', englishName: 'Turkish' },
  { code: 'uk', nativeName: 'Українська', englishName: 'Ukrainian' },
  { code: 'vi', nativeName: 'Tiếng Việt', englishName: 'Vietnamese' },
]

let reloadTimer: ReturnType<typeof setTimeout> | undefined

async function handleSelect(code: string) {
  await settingsStore.setLang(code)
  Toast(t('language_changed'))
  // Reload so all static translated strings update.
  reloadTimer = setTimeout(() => window.location.reload(), 600)
}

onUnmounted(() => {
  clearTimeout(reloadTimer)
})
</script>

<style scoped></style>
