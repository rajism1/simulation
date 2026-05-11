import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          950: "#07111f"
        },
        sky: {
          450: "#2b8fff"
        }
      },
      boxShadow: {
        panel: "0 18px 60px rgba(7, 17, 31, 0.12)"
      },
      backgroundImage: {
        "mesh-glow":
          "radial-gradient(circle at 20% 20%, rgba(43, 143, 255, 0.16), transparent 32%), radial-gradient(circle at 80% 0%, rgba(71, 221, 190, 0.14), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.96), rgba(244,247,251,0.98))"
      }
    }
  },
  plugins: []
};

export default config;
