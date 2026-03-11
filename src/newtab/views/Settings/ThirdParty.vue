<!--
  Third-party licences page.

  Lists all open-source libraries used by the extension along with their
  SPDX licence identifiers and links to the upstream repositories.
-->
<template>
  <div class="flex flex-col h-full bg-gray-50">
    <van-nav-bar :title="t('third_party_title')" left-arrow @click-left="router.back()" />

    <div class="flex-1 overflow-y-auto">
      <van-cell-group inset class="mt-4">
        <van-cell
          v-for="lib in LIBRARIES"
          :key="lib.name"
          :title="lib.name"
          :label="lib.licence"
          is-link
          @click="openUrl(lib.url)"
        />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { t } from '@/utils/i18n'

const router = useRouter()

// Key third-party dependencies used in this extension.
const LIBRARIES = [
  { name: 'Vue 3', licence: 'MIT', url: 'https://github.com/vuejs/core' },
  { name: 'Vue Router', licence: 'MIT', url: 'https://github.com/vuejs/router' },
  { name: 'Pinia', licence: 'MIT', url: 'https://github.com/vuejs/pinia' },
  { name: 'Vant', licence: 'MIT', url: 'https://github.com/youzan/vant' },
  { name: 'VueUse', licence: 'MIT', url: 'https://github.com/vueuse/vueuse' },
  { name: 'Axios', licence: 'MIT', url: 'https://github.com/axios/axios' },
  { name: 'Workbox', licence: 'MIT', url: 'https://github.com/GoogleChrome/workbox' },
  { name: 'WindiCSS', licence: 'MIT', url: 'https://github.com/windicss/windicss' },
  { name: 'idb', licence: 'ISC', url: 'https://github.com/jakearchibald/idb' },
  { name: 'Vite', licence: 'MIT', url: 'https://github.com/vitejs/vite' },
]

function openUrl(url: string) {
  chrome.tabs.create({ url })
}
</script>

<style scoped></style>
