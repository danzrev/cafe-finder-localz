/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm café paper background — the base canvas of the app.
        paper: {
          DEFAULT: '#FBF7EF',
          deep: '#F4EDDF',
        },
        // Deep espresso — primary text & ink. Reads as freshly roasted coffee.
        espresso: {
          DEFAULT: '#241A12',
          soft: '#3A2C20',
        },
        // Mid cocoa tones for body text and muted content.
        cocoa: {
          DEFAULT: '#5D4E41',
          light: '#857464',
        },
        // Poured-milk latte wash for cards and surfaces.
        latte: {
          DEFAULT: '#EDE3D0',
          light: '#F5EEDF',
        },
        // Foliage green — locally-grown coffee leaf. The signature accent.
        leaf: {
          DEFAULT: '#42693F',
          deep: '#345430',
          light: '#5C8257',
        },
        // Mango gold — used sparingly for ratings and highlights.
        mango: {
          DEFAULT: '#DF9A2E',
          deep: '#C9821C',
        },
        // Translucent overlays.
        crema: 'rgba(36, 26, 18, 0.06)',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Work Sans', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.02em',
      },
      borderRadius: {
        dewdrop: '1.5rem',
      },
      boxShadow: {
        soft: '0 2px 12px rgba(36, 26, 18, 0.06)',
        lift: '0 12px 40px rgba(36, 26, 18, 0.12)',
      },
      maxWidth: {
        page: '72rem',
      },
    },
  },
  plugins: [],
};