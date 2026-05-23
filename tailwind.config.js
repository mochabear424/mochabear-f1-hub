/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#080C10", panel: "#0E141B", panel2: "#121A23", line: "#1E2A36",
        txt: "#E8EEF4", mut: "#7C8A99", f1red: "#E10600",
        accent: "#2DD4BF", gold: "#F4C430", grn: "#3FB950"
      },
      fontFamily: {
        display: ["Archivo", "sans-serif"],
        cond: ["Rajdhani", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"]
      }
    }
  },
  plugins: []
};
