<!--
  Change email page.

  Allows a logged-in user to update the email address linked to their account.
  Requires the user to verify ownership of the new email via a code.
-->
<template>
  <div class="flex flex-col h-full bg-white">
    <van-nav-bar :title="t('change_email_title')" left-arrow @click-left="router.back()" />

    <div class="flex-1 overflow-y-auto pt-4">
      <van-form @submit="handleSubmit">
        <van-cell-group inset>
          <van-field
            v-model="email"
            type="email"
            name="email"
            :label="t('change_email_new')"
            :placeholder="t('change_email_placeholder')"
            :rules="[
              { required: true, message: t('field_required') },
              { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t('email_invalid') },
            ]"
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
            :label="t('change_email_code')"
            :placeholder="t('change_code_placeholder')"
            :rules="[{ required: true, message: t('field_required') }]"
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
            {{ t('change_submit') }}
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

const email = ref('')
const code = ref('')
const isLoading = ref(false)
const cooldown = ref(0)

let cooldownTimer: ReturnType<typeof setInterval>

async function sendCode() {
  if (!email.value) { Toast(t('field_required')); return }
  try {
    await userStore.sendVerificationCode(email.value)
    Toast(t('code_sent'))
    cooldown.value = 60
    cooldownTimer = setInterval(() => { cooldown.value--; if (cooldown.value <= 0) clearInterval(cooldownTimer) }, 1000)
  } catch { Toast(t('send_code_failed')) }
}

onUnmounted(() => {
  clearInterval(cooldownTimer)
})

async function handleSubmit() {
  isLoading.value = true
  try {
    await userStore.changeEmail(email.value, code.value)
    Toast(t('change_success'))
    router.back()
  } catch (e: unknown) {
    Toast(e instanceof Error ? e.message : t('change_failed'))
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
