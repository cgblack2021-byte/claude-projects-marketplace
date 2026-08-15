import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12121a",
        paper: "#faf9f7",
        accent: "#6d5efc",
        accentDark: "#5648d8",
        accentLight: "#8b7bff",
        coral: "#ff8a65",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(55% 45% at 12% 0%, rgba(109,94,252,0.16), transparent 60%), radial-gradient(45% 40% at 92% 8%, rgba(255,138,101,0.14), transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
