import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#FFC700",
          "yellow-dark": "#F5BF00",
        },
        blue: {
          steel: "#3A6EA5",
          "steel-dark": "#2C5580",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "1200px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.14)",
        "card-dark": "0 2px 12px rgba(0,0,0,0.3)",
        "card-dark-hover": "0 8px 24px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
