import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        bg: "#0A0A0A",
        "bg-2": "#0E0E0E",
        accent: "#14B8A6",
        "accent-soft": "rgba(20,184,166,0.14)",
        "accent-glow": "rgba(20,184,166,0.35)",
        border: "rgba(255,255,255,0.08)",
        "border-2": "rgba(255,255,255,0.14)",
        muted: "#6B6B6B",
        dim: "#8A8A8A",
        danger: "#FF4D4D",
        amber: "#E6B450",
        green: "#34D399",
      },
    },
  },
  plugins: [],
};

export default config;
