/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        warm: {
          50: '#FFF8F0',
          100: '#FFF0DE',
          200: '#FFE0BD',
          300: '#FFD09C',
          400: '#D4A574',
          500: '#8B6F47',
          600: '#7A6140',
          700: '#695339',
          800: '#584531',
          900: '#47372A',
        },
        sage: {
          50: '#F0F7F2',
          100: '#D9EDDE',
          200: '#B3DBBD',
          300: '#7CB69D',
          400: '#5FA184',
          500: '#4A8C6E',
          600: '#3B7259',
          700: '#2C5844',
          800: '#1D3E2F',
          900: '#0E241A',
        },
        coral: {
          50: '#FFF3EE',
          100: '#FFE4D9',
          200: '#FFC9B3',
          300: '#E8845C',
          400: '#D67040',
          500: '#C45C24',
          600: '#A34B1D',
          700: '#823A16',
          800: '#61290F',
          900: '#401808',
        },
      },
      fontFamily: {
        display: ['Caveat', 'cursive'],
        body: ['Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
