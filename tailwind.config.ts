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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        blink: 'blink 200ms infinite',
      },
      keyframes: {
        blink: {
          '0%': { backgroundColor: 'red' },
          '50%': { backgroundColor: 'green' },
          '100%': { backgroundColor: 'red' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
