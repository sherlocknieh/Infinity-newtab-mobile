<!--
  User profile settings page.

  Shows the logged-in user's details and provides links to:
    • Change email address
    • Change phone number
    • Set / change password
    • Log out
-->
<template>
  <div class="flex flex-col h-full bg-gray-50">
    <van-nav-bar :title="t('settings_user_title')" left-arrow @click-left="router.back()" />

    <div class="flex-1 overflow-y-auto">
      <!-- Avatar + username -->
      <div class="flex-center flex-col py-8 bg-white">
        <van-image
          round
          width="72"
          height="72"
          :src="userStore.profile?.avatar || ''"
          class="mb-3"
        />
        <span class="text-lg font-medium text-gray-800">{{ userStore.displayName }}</span>
        <span v-if="userStore.profile?.email" class="text-sm text-gray-400 mt-1">
          {{ userStore.profile.email }}
        </span>
      </div>

      <!-- Account info cells -->
      <van-cell-group inset class="mt-4">
        <van-cell
          :title="t('user_email')"
          :value="userStore.profile?.email || t('not_set')"
          is-link
          @click="router.push({ name: 'change-email' })"
        />
        <van-cell
          :title="t('user_phone')"
          :value="userStore.profile?.phone || t('not_set')"
          is-link
          @click="router.push({ name: 'change-phone' })"
        />
        <van-cell
          :title="t('user_password')"
          :value="t('change')"
          is-link
          @click="router.push({ name: 'set-password' })"
        />
      </van-cell-group>

      <!-- Logout -->
      <div class="p-4 mt-6">
        <van-button block type="danger" plain @click="handleLogout">
          {{ t('logout') }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { t } from '@/utils/i18n'
import { showConfirmDialog } from 'vant'

const router = useRouter()
const userStore = useUserStore()

async function handleLogout() {
  await showConfirmDialog({ message: t('logout_confirm') })
  await userStore.logout()
  router.replace({ name: 'home' })
}
</script>

<style scoped></style>
