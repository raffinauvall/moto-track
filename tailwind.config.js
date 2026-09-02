/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#0A0A0A',
          surface: '#161616',
          surfaceAlt: '#1E1E1E',
          border: '#2A2A2A',
        },
        brand: {
          DEFAULT: '#34D399',
          soft: '#A7F3D0',
          dark: '#052E2B',
        },
      },
      fontFamily: {
        maison: ['MaisonNeue-Book'],
        maisonLight: ['MaisonNeue-Light'],
        maisonBold: ['MaisonNeue-Bold'],
        maisonMono: ['MaisonNeue-Mono'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0, 0, 0, 0.35)',
        glow: '0 0 20px rgba(52, 211, 153, 0.25)',
      },
    },
  },
  plugins: [],
};
