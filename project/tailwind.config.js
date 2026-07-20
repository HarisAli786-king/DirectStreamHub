/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { base: { black: "#050505", dark: "#0a0a0a", card: "#141414", hover: "#1f1f1f" }, brand: { red: "#E50914", "red-dark": "#b00710", "red-light": "#ff2a35" } },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      animation: { "fade-in": "fadeIn 0.3s ease-out", "slide-up": "slideUp 0.4s ease-out", "scale-in": "scaleIn 0.2s ease-out" },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        scaleIn: { "0%": { opacity: "0", transform: "scale(0.95)" }, "100%": { opacity: "1", transform: "scale(1)" } },
      },
    },
  },
  plugins: [],
};
