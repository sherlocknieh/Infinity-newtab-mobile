<!--
  Reset password page.

  The user enters their account (email or phone), receives a verification code,
  then sets a new password.
-->
<template>
  <div class="flex flex-col h-full bg-white">
    <van-nav-bar :title="t('reset_password_title')" left-arrow @click-left="router.back()" />

    <div class="flex-1 overflow-y-auto pt-4">
      <van-form @submit="handleSubmit">
        <van-cell-group inset>
          <van-field
            v-model="account"
            name="account"
            :label="t('reset_account')"
            :placeholder="t('reset_account_placeholder')"
            :rules="[{ required: true, message: t('field_required') }]"
          >
            <template #button>
              <van-button
                size="small"
                type="primary"
                :disabled="cooldown > 0"
                @click.prevent="sendCode"
              >
                {{ cooldown > 0 ? `${cooldown}s` : t('send_code') }}
              </van-button>
            </template>
          </van-field>

          <van-field
            v-model="code"
            name="code"
            :label="t('reset_code')"
            :placeholder="t('reset_code_placeholder')"
            :rules="[{ required: true, message: t('field_required') }]"
          />

          <van-field
            v-model="newPassword"
            type="password"
            name="newPassword"
            :label="t('reset_new_password')"
            :placeholder="t('reset_new_password_placeholder')"
            :rules="[{ required: true, min: 6, message: t('password_too_short') }]"
          />
        </van-cell-group>

        <div class="px-4 mt-6">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="isLoading"
          >
            {{ t('reset_submit') }}
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { t } from '@/utils/i18n'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const account = ref('')
const code = ref('')
const newPassword = ref('')
const isLoading = ref(false)
const cooldown = ref(0)

let cooldownTimer: ReturnType<typeof setInterval>

async function sendCode() {
  if (!account.value) { showToast(t('account_required')); return }
  try {
    await userStore.sendVerificationCode(account.value)
    showToast(t('code_sent'))
    cooldown.value = 60
    cooldownTimer = setInterval(() => { cooldown.value--; if (cooldown.value <= 0) clearInterval(cooldownTimer) }, 1000)
  } catch { showToast(t('send_code_failed')) }
}

onUnmounted(() => {
  clearInterval(cooldownTimer)
})

async function handleSubmit() {
  isLoading.value = true
  try {
    await userStore.resetPassword(account.value, code.value, newPassword.value)
    showToast(t('reset_success'))
    router.replace({ name: 'login' })
  } catch (e: unknown) {
    showToast(e instanceof Error ? e.message : t('reset_failed'))
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
