/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/main/**/*.{js,jsx,ts,tsx}',
           './src/renderer/**/*.{js,jsx,ts,tsx}',
           './public/**/*.{js,jsx,ts,tsx,html}',
           './dist/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {},
  },
  plugins: [],
}

