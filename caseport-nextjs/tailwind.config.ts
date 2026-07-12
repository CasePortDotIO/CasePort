import type { Config } from "tailwindcss";

/**
 * The complete visual design lives in `src/styles/globals.css` (ported verbatim
 * from the source `styles.css`). Tailwind is configured here only to (a) expose
 * the brand tokens to any utility classes and (b) keep Preflight OFF so it never
 * resets the design system.
 */
const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  corePlugins: {
    // Never reset the ported design system.
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        teal: { DEFAULT: "#1a4a5a", light: "#2d6b7f", deep: "#0f2e3a" },
        sage: "#4a8c7e",
        terra: { DEFAULT: "#c4714a", hover: "#b35f3a" },
        gold: { DEFAULT: "#c9a84c", deep: "#a8842f" },
        bg: { DEFAULT: "#f9f5ef", warm: "#faf8f5", 2: "#f0f8f6" },
        ink: "#2e4350",
        text: "#1c2b32",
        line: "#e8e2d8",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
