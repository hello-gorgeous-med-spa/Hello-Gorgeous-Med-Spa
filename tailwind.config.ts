import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      colors: {
        // Aesthetic Record-style clinical palette
        clinical: {
          bg: "#F3F7F8",
          surface: "#FFFFFF",
          border: "#E2E8F0",
          navy: "#002168",
          navyLight: "#1e3a5f",
          blue: "#2D63A4",
          blueLight: "#5E94C2",
          blueMuted: "#94a3b8",
        },
        // Hello Gorgeous brand (use for CTAs/accents only)
        hg: {
          pink: "#FF2D8E",
          pinkDeep: "#FF2D8E",
          bgSoft: "#FDF7FA",
          dark: "#000000",
          gray: "#5E5E66",
          border: "#EAE4E8",
        },
        ink: {
          950: "#07070A",
          900: "#0C0C12",
          800: "#141420",
          700: "#1D1D2B",
          600: "#2A2A3C",
          500: "#3A3A52",
          400: "#565675",
          300: "#78789B",
          200: "#A9A9C4",
          100: "#D6D6E6",
          50: "#F3F3F8"
        },
        brand: {
          50: "#FFF0F7",
          100: "#FFE0F0",
          200: "#FFC1E2",
          300: "#FF92CC",
          400: "#FF5FB1",
          500: "#FF2D95",
          600: "#F01280",
          700: "#C90A68",
          800: "#9B0B52",
          900: "#730A3F",
          950: "#4B062A"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,45,149,.2), 0 18px 55px rgba(255,45,149,.18)",
        card: "0 1px 0 rgba(7,7,10,.06), 0 12px 32px rgba(7,7,10,.08)",
        clinical: "0 1px 3px rgba(0,33,104,.06), 0 4px 12px rgba(0,0,0,.04)"
      },
      borderRadius: {
        xl: "16px",
        "2xl": "22px"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;

