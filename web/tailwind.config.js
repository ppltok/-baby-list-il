/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chestnut: {
          DEFAULT: '#954535',
          hover: '#a85a4a',
          light: '#c9a8a2',
        },
        beige: {
          DEFAULT: '#D2B48C',
          light: '#e0c9a8',
          dark: '#b89b6f',
        },
        cream: {
          DEFAULT: '#FAF9F6',
          dark: '#F5F3ED',
        },
        sage: {
          DEFAULT: '#4A7C59',
          light: '#6ba57d',
        },
        terracotta: '#C4785B',
      },
      fontFamily: {
        heebo: ['Heebo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
