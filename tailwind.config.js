/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#050B18',
          surface: '#0D1728',
          surfaceAlt: '#12223A',
          border: '#1F3354',
        },
        brand: {
          DEFAULT: '#22D3EE',
          soft: '#A5F3FC',
          dark: '#042F3A',
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
        glow: '0 0 28px rgba(34, 211, 238, 0.24)',
      },
    },
  },
  plugins: [],
};
