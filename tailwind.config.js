/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // use classes for manual override

  content: [
    './index.html',
    './views/menuDevices/**/*.js', // all JS files in menuDevices folder
    './views/components/homeComponents/**/*.js',
    './views/devices/**/*.js', // if you still have devices folder
    './controllers/menus/**/*.js', // JS controllers that may have dynamic classes
    './views/components/homeComponents/marketView.js',
  ],

  // Important for SVGs injected by javascript
  safelist: [
    // For injected SVGs e.g. toggleEye reveal pw
    'h-5',
    'w-5',
    'text-gray-500',

    // Font families (dynamic classes injected via JS)
    'font-inter',
    'font-spectral',
    'font-rubik',
    'font-spaceGrotesk',
    'font-tagesschrift',
    'md:cursor-pointer',

    'bg-white',
    'bg-appBg',
    'bg-black',
    'bg-brand',
    'bg-appBg-white',
    'bg-gray-800',
    'bg-appBg-black',
    'dark:bg-appBg-white',
    'light:bg-appBg-black',

    'w-[43px]',
    'h-[148px]',
    'w-[86px]',
    'h-[148px]',
    'text-[11px]',
    'text-textBase-darkGray',
    'space-y-1',
    'space-y-6',
    'space-y-8',
    'rounded-md',
    'border-brand',
    'rounded-l-md',
    'rounded-r-md',
    'border',
    'border-border-strong',
    'border-r-0',
    'border-l-0',
    'w-[100px]',
    'h-[160px]',
    'lg:py-1',
    'font-black',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        brand: {
          // <-- NEW object for brand colors //nice === #0EA5A3
          DEFAULT: '#f59e0b', // your main brand yellow
          body: '#404040',
          dark: '#d97706', // optional for active/tap states
          light: '#fbbf24', // optional for hover/highlight
        },

        // Global Backgrounds
        appBg: {
          DEFAULT: '#171717', // bg-neutral-900 → main app background (deep, soft black)
          black: '#000000', // pure black → use rarely (hero or highlight sections)
          white: '#FFFFFF',
        },

        // Menus & Drawers
        menuBg: {
          mobile: '#262626', // mobile & medium slide-out menus
          dropdown: '#202020', // custom ~neutral-850 → desktop dropdowns
        },

        menuCard: {
          glass: 'rgba(255,255,255,0.08)', // square containers bg
          menuLightBg: '#e5e5e5', // alias for bg-neutral-200
        },

        // Text
        textBase: {
          primary: '#ffffff', // white → headings, primary labels
          secondary: '#d1d5db', // gray-300 → secondary (email, UID, hints)
          brandLighter: '#ffc94a',
          textColor: '#404040',
          muted: '#9ca3af', // gray-400 → meta info, less focus
          darkGray: '#A3A3A3', // gray-500 → "SPY" (subtle, neutral balance)
          error: '#fb7185', // Auth error
        },

        // Icon border wrappers
        iconBorder: {
          subtle: '#737373', // soft solid border previous: #2d2d2d
          visible: '#3a3a3a', // stronger border
          glass: 'rgba(255,255,255,0.12)', // premium glass-style border
        },

        // Buttons
        btn: {},

        // Borders & Dividers
        border: {
          strong: '#374151', // neutral-800 →  separators
          subtle: '#1f2937', // neutral-700 → lighter dividers
          glass: 'rgba(255,255,255,0.08)', // card/square outlines
          Light: '#e5e5e5', // alias for bg-neutral-200
        },

        // States
        state: {
          success: '#22C55E', // green-400
          error: '#f87171', // red-400
          warning: '#facc15', // yellow-400
        },

        primaryLighter: '#a5b4fc',
        darkGray: '#111827',
        light: '#FBFAFC', // Very light gray (text/bg on dark)
      },

      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        spaceGrotesk: ['Space Grotesk', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
        spectral: ['Spectral', 'sans-serif'],
        tagesschrift: ['Tagesschrift', 'sans-serif'],
      },

      animation: {
        gradient: 'gradient',
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('light', '.light &'); // now `light:` works like `dark:`
    },
  ],
};
