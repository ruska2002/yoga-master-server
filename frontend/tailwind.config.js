/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: { 
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        dancing: ['Dancing Script', 'cursive'],
        Bitcount: ["Bitcount Ink"]

      },
    },
  },
  plugins: [],
}
