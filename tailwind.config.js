/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        '3xl': '0 5px 10px 0 rgba(222, 221, 232, 0.56)',
      }

    },
  },
  plugins: [],
}

