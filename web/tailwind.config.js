/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      colors:{
        darkblue:{
          700:"#020D3F"
        }
      },
      fontFamily:{
        sans: "Roboto, sans-serif"
      }
    },
  },
  plugins: [],
}
