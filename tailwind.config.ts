import type { Config } from "tailwindcss";

// Design system Stakk — tokens uniques, aucun défaut Tailwind "reconnaissable".
// ink    : fond profond de l'app
// paper  : texte principal, blanc cassé chaud
// ember  : rouge accent — réservé aux moments forts (score, records, alertes)
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101114",
        raise: "#17181D",
        raise2: "#1E2026",
        paper: "#F5F3EE",
        muted: "#8F8D86",
        faint: "#57554F",
        line: "rgba(245,243,238,0.08)",
        ember: {
          DEFAULT: "#D6362B",
          deep: "#A3251C",
          glow: "rgba(214,54,43,0.16)",
        },
      },
      fontFamily: {
        display: ["var(--font-anton)", "sans-serif"],
        sans: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      borderRadius: {
        card: "20px",
        pill: "999px",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.45, 0.64, 1)",
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "70%": { opacity: "1", transform: "scale(1.015)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        rise: "rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pop-in": "pop-in 0.45s cubic-bezier(0.34, 1.45, 0.64, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
