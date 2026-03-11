/**
 * Vue Router configuration for the new-tab page.
 *
 * Uses hash history so navigation works inside a Chrome extension page where
 * the URL never changes at the origin level.
 */

import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { RouteType } from '@/constants'

const routes: RouteRecordRaw[] = [
  {
    // Root – the actual new-tab view with clock, search and shortcuts.
    path: '/',
    name: 'home',
    component: () => import('../views/Newtab.vue'),
  },
  {
    // Wallpaper picker sheet.
    path: '/wallpaper',
    name: RouteType.WALLPAPER,
    component: () => import('../views/Wallpaper.vue'),
  },
  {
    // Settings root (acts as a layout with nested routes).
    path: '/settings',
    name: RouteType.SETTINGS,
    component: () => import('../views/Settings/Index.vue'),
    children: [
      {
        path: '',
        name: 'settings-home',
        component: () => import('../views/Settings/Home.vue'),
      },
      {
        path: 'user',
        name: 'settings-user',
        component: () => import('../views/Settings/User.vue'),
      },
      {
        path: 'sync',
        name: 'settings-sync',
        component: () => import('../views/Settings/Sync.vue'),
      },
      {
        path: 'language',
        name: 'settings-language',
        component: () => import('../views/Settings/Language.vue'),
      },
      {
        path: 'about',
        name: 'settings-about',
        component: () => import('../views/Settings/About.vue'),
      },
      {
        path: 'third-party',
        name: 'settings-third-party',
        component: () => import('../views/Settings/ThirdParty.vue'),
      },
    ],
  },
  // ---- Auth routes ----
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Auth/Login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Auth/Register.vue'),
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('../views/Auth/ResetPassword.vue'),
  },
  {
    path: '/change-email',
    name: 'change-email',
    component: () => import('../views/Auth/ChangeEmail.vue'),
  },
  {
    path: '/change-phone',
    name: 'change-phone',
    component: () => import('../views/Auth/ChangePhone.vue'),
  },
  {
    path: '/set-password',
    name: 'set-password',
    component: () => import('../views/Auth/SetPassword.vue'),
  },
  // ---- Fallback for unsupported browsers ----
  {
    path: '/not-support',
    name: 'not-support',
    component: () => import('../views/NotSupport.vue'),
  },
  // Catch-all – redirect to home.
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
