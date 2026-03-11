<!--
  Wallpaper management page.

  Allows the user to:
    • Browse wallpaper categories.
    • Select an online wallpaper from the Infinity API.
    • Upload a custom local image.
    • Clear the current wallpaper (solid colour background).
    • Adjust mask opacity and blur settings.
-->
<template>
  <div class="page-container bg-black flex flex-col">
    <!-- Header -->
    <van-nav-bar
      :title="t('wallpaper_title')"
      left-arrow
      @click-left="router.back()"
    />

    <!-- Category tabs -->
    <van-tabs v-model:active="activeCategoryId" sticky>
      <van-tab
        v-for="cat in wallpaperStore.categories"
        :key="cat.id"
        :title="cat.name"
        :name="cat.id"
      />
    </van-tabs>

    <!-- Wallpaper grid -->
    <div class="flex-1 overflow-y-auto p-2">
      <van-loading v-if="wallpaperStore.isFetchingCategories" class="flex-center h-full" />

      <div v-else class="grid grid-cols-2 gap-2">
        <!-- Clear option -->
        <div
          class="aspect-video bg-gray-800 rounded-lg flex-center cursor-pointer border-2"
          :class="{ 'border-primary': !wallpaperStore.hasWallpaper }"
          @click="handleClear"
        >
          <span class="text-white text-sm">{{ t('no_wallpaper') }}</span>
        </div>

        <!-- Wallpaper thumbnails -->
        <div
          v-for="wp in currentWallpapers"
          :key="wp.id"
          class="relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2"
          :class="{ 'border-primary': wallpaperStore.current?.id === wp.id }"
          @click="handleSelect(wp)"
        >
          <img :src="wp.thumbUrl" :alt="wp.author" class="w-full h-full object-cover" loading="lazy" />
        </div>
      </div>
    </div>

    <!-- Upload local wallpaper -->
    <div class="p-4 border-t border-gray-700">
      <van-uploader :after-read="handleUpload" accept="image/*" :max-count="1">
        <van-button block plain type="primary">{{ t('upload_wallpaper') }}</van-button>
      </van-uploader>
    </div>

    <!-- Opacity / blur sliders -->
    <div class="p-4 space-y-3">
      <div class="flex-between text-white text-sm">
        <span>{{ t('mask_opacity') }}</span>
        <span>{{ wallpaperStore.maskOpacity }}%</span>
      </div>
      <van-slider
        v-model="maskOpacity"
        :min="0"
        :max="100"
        @change="handleOpacityChange"
      />

      <van-cell-group>
        <van-cell :title="t('wallpaper_blur')" center>
          <template #right-icon>
            <van-switch v-model="blurEnabled" @change="handleBlurChange" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWallpaperStore, type Wallpaper } from '@/stores/wallpaper'
import { t } from '@/utils/i18n'

const router = useRouter()
const wallpaperStore = useWallpaperStore()

const activeCategoryId = ref<string>('')
const currentWallpapers = ref<Wallpaper[]>([])
const maskOpacity = ref(wallpaperStore.maskOpacity)
const blurEnabled = ref(wallpaperStore.blur)

// Load wallpapers when the active category changes.
watch(activeCategoryId, async (id) => {
  if (id) {
    currentWallpapers.value = await wallpaperStore.fetchWallpapers(id)
  }
})

async function handleSelect(wp: Wallpaper) {
  await wallpaperStore.setWallpaper(wp, 'online')
}

async function handleClear() {
  await wallpaperStore.clearWallpaper()
}

async function handleOpacityChange(val: number) {
  wallpaperStore.maskOpacity = val
  await wallpaperStore.persist()
}

async function handleBlurChange(val: boolean) {
  wallpaperStore.blur = val
  await wallpaperStore.persist()
}

// TODO: convert the uploaded file to a data-URL and store it locally.
function handleUpload(file: { file: File }) {
  const reader = new FileReader()
  reader.onload = async (e) => {
    const dataUrl = e.target?.result as string
    await wallpaperStore.setWallpaper(
      { id: 'custom', url: dataUrl, thumbUrl: dataUrl, category: 'custom' },
      'local',
    )
  }
  reader.readAsDataURL(file.file)
}

onMounted(async () => {
  await wallpaperStore.fetchCategories()
  if (wallpaperStore.categories.length) {
    activeCategoryId.value = wallpaperStore.categories[0].id
  }
  maskOpacity.value = wallpaperStore.maskOpacity
  blurEnabled.value = wallpaperStore.blur
})
</script>

<style scoped>
.aspect-video {
  aspect-ratio: 16 / 9;
}
</style>
