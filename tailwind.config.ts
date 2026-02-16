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
        white: "#FFFFFF",
        black: "#000000",
        hotpink: "#FF2D8E",
        "hotpink-deep": "#E01A7A",
        hg: {
          pink: "#FF2D8E",
          pinkDeep: "#E01A7A",
          dark: "#000000",
        },
      },
      maxWidth: {
        "container": "1280px",
      },
      spacing: {
        "section": "100px",
        "subsection": "60px",
        "card-gap": "32px",
      },
      borderRadius: {
        "btn": "8px",
      },
      fontSize: {
        "hero": ["3.25rem", { lineHeight: "1.15" }],
        "section": ["2.375rem", { lineHeight: "1.2" }],
        "sub": ["1.75rem", { lineHeight: "1.3" }],
        "body": ["1.125rem", { lineHeight: "1.6" }],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
