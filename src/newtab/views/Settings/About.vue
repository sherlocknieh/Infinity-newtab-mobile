<!--
  About page.

  Shows the extension version, links to the official website, privacy policy,
  and a QR code for the WeChat / social-media follow page.
-->
<template>
  <div class="flex flex-col h-full bg-gray-50">
    <van-nav-bar :title="t('about_title')" left-arrow @click-left="router.back()" />

    <div class="flex-1 overflow-y-auto">
      <!-- Logo + version -->
      <div class="flex-center flex-col py-10 bg-white">
        <img src="/icon/icon96.png" alt="Infinity" class="w-20 h-20 mb-3" />
        <span class="text-lg font-semibold text-gray-800">Infinity New Tab</span>
        <span class="text-sm text-gray-400 mt-1">v{{ APP_VERSION }}</span>
      </div>

      <!-- Links -->
      <van-cell-group inset class="mt-4">
        <van-cell
          :title="t('about_website')"
          is-link
          @click="openUrl('https://infinitynewtab.com')"
        />
        <van-cell
          :title="t('about_privacy')"
          is-link
          @click="openUrl('https://infinitynewtab.com/privacy')"
        />
        <van-cell
          :title="t('about_feedback')"
          is-link
          @click="openUrl('https://infinitynewtab.com/feedback')"
        />
        <van-cell
          :title="t('about_rate')"
          is-link
          @click="openUrl('https://chrome.google.com/webstore')"
        />
      </van-cell-group>

      <!-- Social QR code -->
      <div class="flex-center flex-col mt-8 pb-8">
        <img src="/assets/qrcode.jpg" alt="QR Code" class="w-32 h-32 rounded" />
        <span class="text-xs text-gray-400 mt-2">{{ t('about_follow_wechat') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { APP_VERSION } from '@/constants'
import { t } from '@/utils/i18n'

const router = useRouter()

function openUrl(url: string) {
  chrome.tabs.create({ url })
}
</script>

<style scoped></style>
