import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f5ff",
          100: "#dbe6ff",
          300: "#8fabff",
          500: "#3a5cf5",
          600: "#2a45d6",
          700: "#2036ad",
          900: "#141f66",
        },
      },
    },
  },
  plugins: [],
};

export default config;
