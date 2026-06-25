/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderColor: {
        // Default color for the bare `border` utility (which now replaces drop
        // shadows across the app). Light gray border on the dark surfaces.
        DEFAULT: "#1f2937", // gray-800
      },
    },
  },
  plugins: [],
}
