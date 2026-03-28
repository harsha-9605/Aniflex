/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#121212',
          card: '#1e1e1e',
          accent: '#ef4444' // A red accent for "Animeflex" vibes
        }
      }
    },
  },
  plugins: [],
}
