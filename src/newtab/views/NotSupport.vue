<!--
  Not supported page.

  Shown when the extension detects that the current browser does not meet the
  minimum requirements (Chrome ≥ 80, as declared in manifest.json).
  Displays a friendly message and links to the supported browsers.
-->
<template>
  <div class="page-container flex-center flex-col bg-white p-8 text-center">
    <img
      src="/assets/not-support.a171583e.jpg"
      alt="Not supported"
      class="w-48 h-48 object-contain mb-6"
    />

    <h2 class="text-xl font-semibold text-gray-800 mb-2">
      {{ t('not_support_title') }}
    </h2>

    <p class="text-gray-500 text-sm leading-relaxed max-w-xs">
      {{ t('not_support_desc') }}
    </p>

    <!-- Firefox download link -->
    <div class="mt-8 flex-center gap-4">
      <img src="/assets/firefox.efa43abd.png" alt="Firefox" class="w-10 h-10" />
      <van-button
        type="primary"
        round
        size="small"
        @click="openUrl('https://www.mozilla.org/firefox/')"
      >
        {{ t('not_support_download_firefox') }}
      </van-button>
    </div>

    <!-- Chrome download link -->
    <div class="mt-4">
      <van-button
        plain
        type="primary"
        round
        size="small"
        @click="openUrl('https://www.google.com/chrome/')"
      >
        {{ t('not_support_download_chrome') }}
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/utils/i18n'

function openUrl(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped></style>
