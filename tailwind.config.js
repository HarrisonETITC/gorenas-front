/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      backgroundColor: {
        secondary: "#1d283c"
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

