# Infinity New Tab for Mobile — Source Project

**Version**: 3.0.17  
**Type**: Chrome Extension (Manifest V2)

This repository contains both the **compiled extension files** (in the project root) and the
reconstructed **source project** (in `src/`) from which it was built.

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
├── manifest.json               # Chrome Extension manifest (v2)
├── _locales/                   # i18n message bundles (20+ languages)
├── icon/                       # Extension icon files
├── assets/                     # Compiled JS/CSS/image assets
├── newtab/                     # Compiled new-tab page
├── popup/                      # Compiled popup page
├── background/                 # Compiled background page
├── sw.js                       # Compiled service worker
├── vendor/                     # Third-party vendor scripts
│
├── src/                        # ← SOURCE CODE (reconstructed)
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
│   │   ├── index.html          # New-tab HTML entry
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
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── App.vue
│   └── background/
│       ├── index.html
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

The compiled extension will be output to `dist/`.

### Load in Chrome (development)

1. Run `npm run build` (or `npm run dev` for the dev server)
2. Open `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the project root (for the existing compiled extension)
   — or the `dist/` directory (for the freshly compiled source)

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

Translation strings live in `_locales/<lang>/messages.json`.  
Supported languages include: `en`, `zh_CN`, `zh_TW`, `ja`, `ko`, `de`, `fr`, `es`, `ru`, `pt_BR`, and 15+ more.

The `t()` helper (`src/utils/i18n.ts`) wraps `chrome.i18n.getMessage()` with a fallback to the key itself.

---

## Permissions

As declared in `manifest.json`:

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

---

## Notes

- The source files in `src/` are reconstructed from the compiled output and represent the
  project structure that would produce the same functionality.  Business logic in each Vue
  component stub is a faithful approximation based on the compiled code analysis.
- The compiled files in the repository root are the original production build.
- Build output hashes will differ from the original compiled files because Vite regenerates
  content hashes on each build.
