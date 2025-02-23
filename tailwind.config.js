/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f9f5',
          100: '#e6f4eb',
          200: '#d0eadc',
          300: '#a8dbc0',
          400: '#7ec89f',
          500: '#5bb584',
          600: '#429f6b',
          700: '#358757',
          800: '#2d6c47',
          900: '#25563a',
        },
      },
    },
  },
  plugins: [],
}