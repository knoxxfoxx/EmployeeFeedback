/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deroyal-blue': '#003087',
        'deroyal-light': '#0066CC',
      },
    },
  },
  plugins: [],
}
