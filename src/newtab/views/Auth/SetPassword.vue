<!--
  Set / change password page.

  Allows a logged-in user to update their password by supplying the old
  password alongside the new one.
-->
<template>
  <div class="flex flex-col h-full bg-white">
    <van-nav-bar :title="t('set_password_title')" left-arrow @click-left="router.back()" />

    <div class="flex-1 overflow-y-auto pt-4">
      <van-form @submit="handleSubmit">
        <van-cell-group inset>
          <van-field
            v-model="oldPassword"
            type="password"
            name="oldPassword"
            :label="t('set_password_old')"
            :placeholder="t('set_password_old_placeholder')"
            :rules="[{ required: true, message: t('field_required') }]"
          />
          <van-field
            v-model="newPassword"
            type="password"
            name="newPassword"
            :label="t('set_password_new')"
            :placeholder="t('set_password_new_placeholder')"
            :rules="[{ required: true, min: 6, message: t('password_too_short') }]"
          />
          <van-field
            v-model="confirmPassword"
            type="password"
            name="confirmPassword"
            :label="t('set_password_confirm')"
            :placeholder="t('set_password_confirm_placeholder')"
            :rules="[
              { required: true, message: t('field_required') },
              { validator: checkConfirm, message: t('password_mismatch') },
            ]"
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
            {{ t('set_password_submit') }}
          </van-button>
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
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

function checkConfirm(val: string) {
  return val === newPassword.value
}

async function handleSubmit() {
  isLoading.value = true
  try {
    await userStore.setPassword(oldPassword.value, newPassword.value)
    showToast(t('set_password_success'))
    router.back()
  } catch (e: unknown) {
    showToast(e instanceof Error ? e.message : t('set_password_failed'))
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
