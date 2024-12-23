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
        secondary: "#1d283c",
        action: "#2869ff",
        actionHover: "#6291fd"
      },
      borderRadius: {
        general: "0.25rem"
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

