/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/*.ejs",
    "./views/partials/*.ejs",
    "./js/main.js"
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '760px',
      lg: '960px',
      xl: '1440px'
    },
    extend: {},
  },
  plugins: [require("daisyui")],
// daisyUI config (optional)
  daisyui: {
  styled: true,
  themes: ["light", "night"],
  base: true,
  utils: true,
  logs: true,
  rtl: false,
  prefix: "",
  darkTheme: "night",
  },

}
