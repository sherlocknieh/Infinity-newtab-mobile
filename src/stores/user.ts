/**
 * User / authentication store
 *
 * Handles login, registration, token refresh, profile data, and account
 * operations (change email, change phone, set/reset password).
 * Persisted to chrome.storage.local under StoreKey.USER.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { StoreKey } from '@/constants'
import { getStorage, setStorage } from '@/utils/storage'
import http, { setToken, clearToken, ApiError } from '@/utils/http'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UserProfile {
  uid: string
  username: string
  email?: string
  phone?: string
  avatar?: string
  createdAt?: string
}

export interface LoginPayload {
  account: string
  password: string
}

export interface RegisterPayload {
  username: string
  account: string
  password: string
  /** Verification code sent to email/phone. */
  code: string
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useUserStore = defineStore(StoreKey.USER, () => {
  // ---- state ----
  const profile = ref<UserProfile | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // ---- getters ----
  const isLoggedIn = computed(() => profile.value !== null && token.value !== null)
  const displayName = computed(() => profile.value?.username ?? '')

  // ---- actions ----

  async function load(): Promise<void> {
    const saved = await getStorage(StoreKey.USER) as { profile: UserProfile; token: string } | undefined
    if (saved?.token) {
      profile.value = saved.profile ?? null
      token.value = saved.token
      await setToken(saved.token)
    }
  }

  async function persist(): Promise<void> {
    await setStorage(StoreKey.USER, { profile: profile.value, token: token.value })
  }

  async function login(payload: LoginPayload): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const res = await http.post<{ token: string; user: UserProfile }>(
        '/user/login',
        payload,
      )
      profile.value = res.user
      token.value = res.token
      await setToken(res.token)
      await persist()
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Login failed'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function register(payload: RegisterPayload): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const res = await http.post<{ token: string; user: UserProfile }>(
        '/user/register',
        payload,
      )
      profile.value = res.user
      token.value = res.token
      await setToken(res.token)
      await persist()
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Registration failed'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function logout(): Promise<void> {
    profile.value = null
    token.value = null
    await clearToken()
    await persist()
  }

  async function fetchProfile(): Promise<void> {
    if (!isLoggedIn.value) return
    try {
      const data = await http.get<UserProfile>('/user/profile')
      profile.value = data
      await persist()
    } catch (e) {
      console.error('[user] fetchProfile failed', e)
    }
  }

  async function sendVerificationCode(account: string): Promise<void> {
    await http.post('/user/send-code', { account })
  }

  async function resetPassword(account: string, code: string, newPassword: string): Promise<void> {
    await http.post('/user/reset-password', { account, code, newPassword })
  }

  async function changeEmail(email: string, code: string): Promise<void> {
    await http.post('/user/change-email', { email, code })
    if (profile.value) {
      profile.value.email = email
      await persist()
    }
  }

  async function changePhone(phone: string, code: string): Promise<void> {
    await http.post('/user/change-phone', { phone, code })
    if (profile.value) {
      profile.value.phone = phone
      await persist()
    }
  }

  async function setPassword(oldPassword: string, newPassword: string): Promise<void> {
    await http.post('/user/set-password', { oldPassword, newPassword })
  }

  return {
    // state
    profile,
    token,
    isLoading,
    error,
    // getters
    isLoggedIn,
    displayName,
    // actions
    load,
    persist,
    login,
    register,
    logout,
    fetchProfile,
    sendVerificationCode,
    resetPassword,
    changeEmail,
    changePhone,
    setPassword,
  }
})
