<!--
  Login page.

  Accepts email/phone + password. On success the user is navigated back to
  the previous page (or home). Shows a link to the registration and
  reset-password pages.
-->
<template>
  <div class="flex flex-col h-full bg-white">
    <van-nav-bar :title="t('login_title')" left-arrow @click-left="router.back()" />

    <div class="flex-1 flex flex-col justify-center px-6">
      <!-- Logo -->
      <div class="flex-center mb-8">
        <img src="/icon/icon96.png" alt="Infinity" class="w-16 h-16" />
      </div>

      <van-form ref="formRef" @submit="handleSubmit">
        <van-cell-group inset>
          <van-field
            v-model="account"
            name="account"
            :label="t('login_account')"
            :placeholder="t('login_account_placeholder')"
            :rules="[{ required: true, message: t('field_required') }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="password"
            :label="t('login_password')"
            :placeholder="t('login_password_placeholder')"
            :rules="[{ required: true, message: t('field_required') }]"
          />
        </van-cell-group>

        <!-- Error banner -->
        <van-notice-bar
          v-if="userStore.error"
          :text="userStore.error"
          color="#ee0a24"
          background="#fff1f0"
          wrapable
          class="mx-4 mt-3"
        />

        <div class="px-4 mt-6 space-y-3">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="userStore.isLoading"
          >
            {{ t('login_submit') }}
          </van-button>

          <div class="flex-between text-sm text-primary">
            <span class="cursor-pointer" @click="router.push({ name: 'register' })">
              {{ t('login_register') }}
            </span>
            <span class="cursor-pointer" @click="router.push({ name: 'reset-password' })">
              {{ t('login_forgot_password') }}
            </span>
          </div>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { t } from '@/utils/i18n'

const router = useRouter()
const userStore = useUserStore()

const account = ref('')
const password = ref('')

async function handleSubmit() {
  try {
    await userStore.login({ account: account.value, password: password.value })
    router.back()
  } catch {
    // Error is already stored in userStore.error
  }
}
</script>

<style scoped></style>
