<!--
  SiteGrid component.

  Displays a scrollable grid of site shortcuts. Each site is shown as an icon
  (fetched from the site's favicon) above a short label. Tapping a site opens
  it in the current tab.

  A long-press (or right-click) on a site item shows a context menu with the
  option to remove the shortcut.

  An "Add" button at the end of the grid opens a dialog for adding a new site.
-->
<template>
  <div class="site-grid">
    <div class="grid grid-cols-4 gap-3">
      <!-- Site tiles -->
      <div
        v-for="site in sitesStore.sites"
        :key="site.id"
        class="flex flex-col items-center gap-1 cursor-pointer"
        @click="openSite(site)"
        @contextmenu.prevent="confirmRemove(site)"
      >
        <!-- Icon -->
        <div
          class="site-icon flex-center rounded-full overflow-hidden bg-white bg-opacity-20"
          :style="{ borderRadius: `${iconRadius}%` }"
        >
          <img
            v-if="site.icon"
            :src="site.icon"
            :alt="site.name"
            class="w-full h-full object-cover"
            @error="handleIconError($event, site)"
          />
          <span
            v-else
            class="text-white text-lg font-semibold"
            :style="{ backgroundColor: site.iconColor || '#4C84FF' }"
          >
            {{ site.iconText || site.name.charAt(0).toUpperCase() }}
          </span>
        </div>
        <!-- Label -->
        <span class="text-white text-xs text-center leading-tight max-w-full truncate w-full opacity-90">
          {{ site.name }}
        </span>
      </div>

      <!-- Add button -->
      <div
        class="flex flex-col items-center gap-1 cursor-pointer"
        @click="showAddDialog = true"
      >
        <div
          class="site-icon flex-center bg-white bg-opacity-20"
          :style="{ borderRadius: `${iconRadius}%` }"
        >
          <span class="text-white text-2xl font-light leading-none">+</span>
        </div>
        <span class="text-white text-xs opacity-60">{{ t('add') }}</span>
      </div>
    </div>

    <!-- Add site dialog -->
    <van-dialog
      v-model:show="showAddDialog"
      :title="t('add')"
      show-cancel-button
      :confirm-button-text="t('confirm')"
      :cancel-button-text="t('cancel')"
      @confirm="handleAddSite"
      @cancel="resetForm"
    >
      <div class="p-4 space-y-3">
        <van-field
          v-model="newSiteName"
          :label="t('please_input_name')"
          :placeholder="t('please_input_name')"
          required
        />
        <van-field
          v-model="newSiteUrl"
          :label="t('please_input_url')"
          :placeholder="t('please_input_url')"
          required
        />
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSitesStore, type Site } from '@/stores/sites'
import { useSettingsStore } from '@/stores/settings'
import { t } from '@/utils/i18n'
import { Dialog, Toast } from 'vant'

const sitesStore = useSitesStore()
const settingsStore = useSettingsStore()

const iconRadius = computed(() => settingsStore.settings.iconRadius)

const showAddDialog = ref(false)
const newSiteName = ref('')
const newSiteUrl = ref('')

function openSite(site: Site) {
  let url = site.url
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url
  }
  window.location.href = url
}

function resetForm() {
  newSiteName.value = ''
  newSiteUrl.value = ''
}

async function handleAddSite() {
  const name = newSiteName.value.trim()
  let url = newSiteUrl.value.trim()

  if (!name || !url) {
    Toast(t('field_required'))
    return
  }

  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url
  }

  // Build favicon URL from the domain.
  let icon: string | undefined
  try {
    const origin = new URL(url).origin
    icon = `${origin}/favicon.ico`
  } catch {
    icon = undefined
  }

  await sitesStore.addSite({ name, url, icon })
  Toast(t('add_success'))
  resetForm()
}

async function confirmRemove(site: Site) {
  try {
    await Dialog.confirm({
      message: site.name,
      confirmButtonText: t('done'),
      cancelButtonText: t('cancel'),
    })
    await sitesStore.removeSite(site.id)
  } catch {
    // User cancelled
  }
}

function handleIconError(event: Event, site: Site) {
  // On icon load failure, hide the img so the fallback letter shows.
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  // Remove icon from site so it won't be retried.
  sitesStore.updateSite(site.id, { icon: undefined })
}
</script>

<style scoped>
.site-icon {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
}
</style>
