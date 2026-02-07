/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
       fontFamily: {
        maison: ["MaisonNeue-Book"],
        maisonLight: ["MaisonNeue-Light"],
        maisonBold: ["MaisonNeue-Bold"],
        maisonMono: ["MaisonNeue-Mono"],
      },
    },
  },
  plugins: [],
}