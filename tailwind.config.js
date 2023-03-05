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
  themes: ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"],
  base: true,
  utils: true,
  logs: true,
  rtl: false,
  prefix: "",
  darkTheme: "night",
  },

}
