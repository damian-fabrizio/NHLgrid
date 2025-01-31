/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      
      colors:{
        'cell-outline2': '#251e3c',
        'cell-outline': '#a08ce3',
        'cell-hover': '#251e3c',
        'bg': '#151122',
        'bg2': '#2a2244',
      },
      maxWidth:{
        '3/4': '75%',
      },
      maxHeight:{
        '3/4': '75%',
      },
      borderWidth: {
        '3': '3px',
      },
      minHeight:{
        '26':'6.5rem',
        '25':'6.25rem',
      },
      padding: {
        'scrollbar': '17px',
      },
      fontFamily: {
        'font1': ['Montserrat'],
      }
    },
  },
  plugins: [],
}
