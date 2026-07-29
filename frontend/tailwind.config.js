/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#fefefe",
        surface: {
          DEFAULT: "#f8f9fb",
          alt: "#f3f5f9",
        },
        ink: {
          DEFAULT: "#0c1929",
          soft: "#2d3a4d",
          muted: "#6b7a8d",
          faint: "#a3afbd",
        },
        line: {
          DEFAULT: "#e5e9f0",
          soft: "#f0f2f6",
        },
        brand: {
          DEFAULT: "#1a6ff5",
          hover: "#155dd4",
          deep: "#0f3f8f",
          soft: "#eef5ff",
          faint: "#dce9fd",
        },
        accent: {
          DEFAULT: "#0ea5e9",
          hover: "#0284c7",
          soft: "#f0f9ff",
          faint: "#e0f2fe",
        },
        // Warm Senegalese-inspired earth tones
        warm: {
          DEFAULT: "#c2644a",
          hover: "#a84d35",
          soft: "#fdf5f0",
          faint: "#f9e5d8",
        },
        // Health & wellness greens
        leaf: {
          DEFAULT: "#2d9f6d",
          hover: "#1f7d53",
          soft: "#ecf9f3",
          faint: "#d4f1e3",
        },
        // Soft lavender for analytics
        bloom: {
          DEFAULT: "#7c5ce7",
          hover: "#6448d4",
          soft: "#f4f2ff",
          faint: "#e7e2fd",
        },
        danger: {
          DEFAULT: "#e74b4b",
          hover: "#d63030",
          soft: "#fef4f4",
          faint: "#fde0e0",
        },
        warn: {
          DEFAULT: "#e8a020",
          hover: "#c78715",
          soft: "#fffcf5",
          faint: "#fef3d6",
        },
        ok: {
          DEFAULT: "#2d9f6d",
          hover: "#1f7d53",
          soft: "#ecf9f3",
          faint: "#d4f1e3",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SF Mono", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(12, 25, 41, 0.04), 0 4px 12px rgba(12, 25, 41, 0.04)",
        lift: "0 4px 6px rgba(12, 25, 41, 0.03), 0 12px 24px rgba(12, 25, 41, 0.06)",
        xl: "0 8px 16px rgba(12, 25, 41, 0.04), 0 24px 48px rgba(12, 25, 41, 0.08)",
        focus: "0 0 0 4px rgba(26, 111, 245, 0.12)",
        glow: "0 0 0 1px rgba(26, 111, 245, 0.08), 0 8px 32px rgba(26, 111, 245, 0.12)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fadeIn 0.5s ease-out both",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "slide-right": "slideRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
