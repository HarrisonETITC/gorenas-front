/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./src/**/*.{html,ts,css}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#101827",
        secondary: "#1d283c",
        action: "#2869ff",
        actionHover: "#6291fd"
      },
      borderRadius: {
        general: "0.25rem",
        left: "5rem 0rem 0rem 5rem",
        right: "0rem 5rem 5rem 0rem",
      },
      borderColor: {
        action: "#2869ff"
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

