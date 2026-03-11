# Infinity New Tab for Mobile — Source Project

**Version**: 3.0.17  
**Type**: Chrome Extension (Manifest V2)

---

## Tech Stack

| Layer | Library / Tool | Version |
|-------|----------------|---------|
| Framework | Vue 3 | ^3.2 |
| Router | Vue Router | ^4.0 |
| State | Pinia | ^2.0 |
| UI | Vant (mobile) | ^3.4 |
| CSS | Windi CSS | ^3.5 |
| Build | Vite | ^2.8 |
| Lang | TypeScript | ^4.5 |
| SW | Workbox | ^6.2.4 |
| HTTP | Fetch (custom wrapper) | — |

---

## Project Structure

```
.
├── public/                     # Static extension assets (copied to dist/ as-is)
│   ├── manifest.json           # Chrome Extension manifest (v2)
│   ├── favicon.ico
│   ├── sw.js                   # Service worker (compiled from src/sw.ts)
│   ├── _locales/               # i18n message bundles (20+ languages)
│   ├── icon/                   # Extension icon files
│   ├── vendor/                 # Third-party vendor scripts (QQ SDK)
│   └── assets/                 # Static images referenced by source components
│
├── newtab/
│   └── index.html              # New-tab HTML entry point
├── popup/
│   └── index.html              # Popup HTML entry point
├── background/
│   └── index.html              # Background page HTML entry point
│
├── src/                        # TypeScript / Vue source code
│   ├── constants.ts            # App-wide constants & enums
│   ├── sw.ts                   # Service worker source
│   ├── types/
│   │   └── chrome.d.ts         # TypeScript types for Chrome APIs
│   ├── utils/
│   │   ├── storage.ts          # chrome.storage / IDB / localStorage
│   │   ├── platform.ts         # Browser / OS detection
│   │   ├── i18n.ts             # i18n helpers
│   │   └── http.ts             # Typed HTTP client
│   ├── stores/
│   │   ├── wallpaper.ts        # Pinia: wallpaper state
│   │   ├── settings.ts         # Pinia: user settings
│   │   ├── user.ts             # Pinia: auth / user profile
│   │   └── sync.ts             # Pinia: cloud sync
│   ├── newtab/
│   │   ├── main.ts             # Vue app bootstrap
│   │   ├── App.vue             # Root component
│   │   ├── router/
│   │   │   └── index.ts        # Vue Router config
│   │   └── views/
│   │       ├── Newtab.vue      # Main new-tab page (clock, search, shortcuts)
│   │       ├── Wallpaper.vue   # Wallpaper picker
│   │       ├── NotSupport.vue  # Unsupported browser page
│   │       ├── Auth/
│   │       │   ├── Login.vue
│   │       │   ├── Register.vue
│   │       │   ├── ResetPassword.vue
│   │       │   ├── ChangeEmail.vue
│   │       │   ├── ChangePhone.vue
│   │       │   └── SetPassword.vue
│   │       └── Settings/
│   │           ├── Index.vue   # Settings layout wrapper
│   │           ├── Home.vue    # Main settings list
│   │           ├── User.vue    # Profile / account
│   │           ├── Sync.vue    # Cloud sync / backup
│   │           ├── Language.vue
│   │           ├── About.vue
│   │           └── ThirdParty.vue
│   ├── popup/
│   │   ├── main.ts
│   │   └── App.vue
│   └── background/
│       ├── main.ts
│       └── App.vue
│
├── package.json
├── vite.config.ts              # Multi-page Vite build config
├── tsconfig.json
└── windi.config.ts             # WindiCSS config
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 16
- npm ≥ 7

### Install dependencies

```bash
npm install
```

### Build

```bash
npm run build
```

The compiled extension is output to `dist/`.  After the build completes, `dist/` contains
everything the browser needs — no extra copy steps required.

### Load in Chrome

1. Run `npm run build`
2. Open `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `dist/` directory

---

## API Endpoints

| Base URL | Purpose |
|----------|---------|
| `https://api.infinitynewtab.com/v2` | Main REST API |
| `https://infinity-api.infinitynewtab.com` | Icon / asset CDN |
| `https://ws.infinitynewtab.com` | WebSocket (real-time sync) |
| `https://suggestion.baidu.com` | Baidu search suggestions |

---

## i18n

Translation strings live in `public/_locales/<lang>/messages.json`.  
Supported languages include: `en`, `zh_CN`, `zh_TW`, `ja`, `ko`, `de`, `fr`, `es`, `ru`, `pt_BR`, and 15+ more.

The `t()` helper (`src/utils/i18n.ts`) wraps `chrome.i18n.getMessage()` with a fallback to the key itself.

---

## Permissions

As declared in `public/manifest.json`:

```json
"permissions": [
  "storage",
  "unlimitedStorage",
  "activeTab",
  "notifications",
  "https://google.com/",
  "https://suggestion.baidu.com/",
  "background"
]
```
