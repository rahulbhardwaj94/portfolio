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
        // Homepage (design spec) families
        plex: ["var(--font-plex)", "system-ui", "sans-serif"],
        plexmono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
        grotesk: ["var(--font-grotesk)", "system-ui", "sans-serif"],
      },
      colors: {
        // Homepage (design spec) tokens
        night: "#030303",
        cyan: "#00d4ff",
        violet: "#a855f7",
        ink: {
          hi: "#f4f5f6",
          body: "#e8e9ea",
          soft: "#9da1a6",
          dim: "#777b80",
          faint: "#525659",
        },
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
