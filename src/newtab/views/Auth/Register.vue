<!--
  Registration page.

  Collects username, email/phone, a verification code, and a password.
  On success the user is navigated to home.
-->
<template>
  <div class="flex flex-col h-full bg-white">
    <van-nav-bar :title="t('register_title')" left-arrow @click-left="router.back()" />

    <div class="flex-1 overflow-y-auto px-0 pt-4">
      <van-form @submit="handleSubmit">
        <van-cell-group inset>
          <van-field
            v-model="username"
            name="username"
            :label="t('register_username')"
            :placeholder="t('register_username_placeholder')"
            :rules="[{ required: true, message: t('field_required') }]"
          />
          <van-field
            v-model="account"
            name="account"
            :label="t('register_account')"
            :placeholder="t('register_account_placeholder')"
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
            :label="t('register_code')"
            :placeholder="t('register_code_placeholder')"
            :rules="[{ required: true, message: t('field_required') }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="password"
            :label="t('register_password')"
            :placeholder="t('register_password_placeholder')"
            :rules="[{ required: true, min: 6, message: t('password_too_short') }]"
          />
        </van-cell-group>

        <van-notice-bar
          v-if="userStore.error"
          :text="userStore.error"
          color="#ee0a24"
          background="#fff1f0"
          wrapable
          class="mx-4 mt-3"
        />

        <div class="px-4 mt-6">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="userStore.isLoading"
          >
            {{ t('register_submit') }}
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
import { Toast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const account = ref('')
const code = ref('')
const password = ref('')
const cooldown = ref(0)

let cooldownTimer: ReturnType<typeof setInterval>

async function sendCode() {
  if (!account.value) {
    Toast(t('account_required'))
    return
  }
  try {
    await userStore.sendVerificationCode(account.value)
    Toast(t('code_sent'))
    cooldown.value = 60
    cooldownTimer = setInterval(() => {
      cooldown.value--
      if (cooldown.value <= 0) clearInterval(cooldownTimer)
    }, 1000)
  } catch {
    Toast(t('send_code_failed'))
  }
}

onUnmounted(() => {
  clearInterval(cooldownTimer)
})

async function handleSubmit() {
  try {
    await userStore.register({
      username: username.value,
      account: account.value,
      password: password.value,
      code: code.value,
    })
    router.replace({ name: 'home' })
  } catch {
    // Error is already stored in userStore.error
  }
}
</script>

<style scoped></style>
