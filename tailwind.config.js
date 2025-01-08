/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./src/**/*.{html,ts,css}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        primary: "var(--app-bg)",
        secondary: "var(--sidebar-active-link)",
        btnSecondary: "var(--app-secondary)",
        btnSecondaryHover: "var(--app-secondary-hover)",
        action: "var(--action-color)",
        actionHover: "var(--action-color-hover)",
        warning: "var(--app-warning)",
        warningBold: "var(--app-warning-bold)",
        warningBoldHover: "var(--app-warning-bold-hover)",
        "side-var": "var(--sidebar)"
      },
      borderRadius: {
        general: "0.25rem",
        left: "5rem 0rem 0rem 5rem",
        right: "0rem 5rem 5rem 0rem",
      },
      borderColor: {
        action: "var(--action-color)",
        sidebar: "var(--sidebar)",
        sidebarActive: "var(--sidebar-active-link)"
      },
      textColor: {
        contentMain: "var(--app-content-main-color)",
        warning: "var(--app-warning)",
        warningBold: "var(--app-warning-bold)",
        sidebarActive: "var(--sidebar-active-link)",
        "side-main-color": "var(--sidebar-main-color)"
      },
      content: {
        dot: "'•'"
      }
    },
  },
}

