

import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lao: ["var(--font-noto-lao)", "sans-serif"],
        sans: ["var(--font-noto-lao)", "sans-serif"],
      },
    },
  },
  plugins: [animate],
};

export default config;