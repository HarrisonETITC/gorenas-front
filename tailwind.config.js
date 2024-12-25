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
        primary: "var(--app-bg)",
        secondary: "var(--sidebar-active-link)",
        action: "var(--action-color)",
        actionHover: "var(--action-color-hover)",
        warning: "var(--app-warning)",
        warningBold: "var(--app-warning-bold)",
        warningBoldHover: "var(--app-warning-bold-hover)"
      },
      borderRadius: {
        general: "0.25rem",
        left: "5rem 0rem 0rem 5rem",
        right: "0rem 5rem 5rem 0rem",
      },
      borderColor: {
        action: "var(--action-color)"
      },
      textColor: {
        warning: "var(--app-warning)",
        warningBold: "var(--app-warning-bold)"
      },
      content: {
        dot: "'•'"
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

