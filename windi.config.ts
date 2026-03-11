import { defineConfig } from 'windicss/helpers'

/**
 * WindiCSS configuration for Infinity New Tab mobile extension.
 * Mirrors the utility classes observed in the compiled CSS output.
 */
export default defineConfig({
  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        primary: '#4C84FF',
        danger: '#FF4D4F',
        warning: '#FAAD14',
        success: '#52C41A',
      },
      fontFamily: {
        iconfont: ['iconfont', 'sans-serif'],
      },
      borderRadius: {
        full: '9999px',
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom)',
      },
    },
  },

  shortcuts: {
    // Frequently used layout helpers found across compiled templates.
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'abs-full': 'absolute inset-0',
    'page-container': 'relative h-full w-full overflow-hidden',
  },

  // Scan compiled output to include any utility classes already in use.
  extract: {
    include: ['src/**/*.{vue,ts,tsx,html}'],
    exclude: ['node_modules', 'dist'],
  },

  plugins: [],
})
