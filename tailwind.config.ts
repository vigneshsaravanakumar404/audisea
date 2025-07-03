import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#96aa97',
        offwhite: '#fbf8f6',
        dark: '#494a4a',
        accent: '#7a7b7b',
        light: '#e6ede7',
      },
    },
  },
  plugins: [],
} satisfies Config;