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
        /* ========================================
           HELLO GORGEOUS BRAND SYSTEM
           ONLY: White, Black, Hot Pink
           NO GRAY ALLOWED
           ======================================== */
        
        // Primary brand colors
        white: "#FFFFFF",
        black: "#000000",
        hotpink: "#FF2D8E",
        
        // Hello Gorgeous brand tokens
        hg: {
          pink: "#FF2D8E",
          pinkDeep: "#E6007E",
          dark: "#000000",
          light: "#FFFFFF",
        },
        
        // Clinical palette for admin (non-public)
        clinical: {
          bg: "#FFFFFF",
          surface: "#FFFFFF",
          border: "#000000",
          navy: "#002168",
          navyLight: "#1e3a5f",
          blue: "#2D63A4",
          blueLight: "#5E94C2",
        },
        
        // Brand scale (pink variations only)
        brand: {
          50: "#FFF0F7",
          100: "#FFE0F0",
          200: "#FFC1E2",
          300: "#FF92CC",
          400: "#FF5FB1",
          500: "#FF2D8E",
          600: "#E6007E",
          700: "#C90A68",
          800: "#9B0B52",
          900: "#730A3F",
          950: "#4B062A"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,45,142,.2), 0 18px 55px rgba(255,45,142,.18)",
        card: "0 4px 24px rgba(0,0,0,.08)",
        clinical: "0 1px 3px rgba(0,0,0,.06), 0 4px 12px rgba(0,0,0,.04)"
      },
      borderRadius: {
        xl: "16px",
        "2xl": "22px"
      },
      spacing: {
        // Luxury spacing system
        'section': '100px',
        'section-sm': '60px',
        'card-gap': '32px',
      },
      fontSize: {
        // Brand typography scale
        'display': ['52px', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['52px', { lineHeight: '1.15', fontWeight: '700' }],
        'h2': ['38px', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
      },
      maxWidth: {
        'container': '1280px',
      }
    }
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
