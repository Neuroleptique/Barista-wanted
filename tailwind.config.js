/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./public/css/*.{html,js,css}",
  "./views/*.ejs",
  "./views/layouts/*.ejs",
  "./views/partials/*.ejs"
  ],
  theme: {
    screen: {
      sm: '480px',
      md: '760px',
      lg: '960px',
      xl: '1440px'
    },
    extend: {},
  },
  plugins: [],
}
