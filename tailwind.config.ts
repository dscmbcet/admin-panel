import type { Config } from "tailwindcss";

const safeList = [
  "bg-backgroundPrimary",
  "bg-backgroundSecondary",
  "bg-backgroundEmPrimary",
  "bg-backgroundEmSecondary",
  "bg-backgroundEmTertiary",
  "text-backgroundEmPrimary",
  "text-backgroundEmSecondary",
  "text-backgroundEmTertiary",
  "text-backgroundNeutralPrimary",
  "hover:text-onBackgroundEmPrimary",
  "hover:text-onBackgroundEmSecondary",
  "hover:text-onBackgroundEmTertiary",
  "hover:bg-onBackgroundEmPrimary",
  "hover:bg-onBackgroundEmSecondary",
  "hover:bg-onBackgroundEmTertiary",
  "hover:border-onBackgroundEmPrimary",
  "hover:border-onBackgroundEmSecondary",
  "hover:border-onBackgroundEmTertiary",
  "hover:border-onBackgroundNeutralPrimary",
  "hover:outline-borderEmPrimary",
  "hover:outline-borderEmSecondary",
  "hover:outline-borderEmTertiary",
  "hover:outline-borderSecondary",
  
  
];

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Project Colours
        onBackgroundPrimary: "var(--on-background-primary)",
        onBackgroundSecondary: "var(--on-background-secondary)",
        onBackgroundTertiary: "var(--on-background-tertiary)",

        onBackgroundEmPrimary: "var(--on-background-em-primary)",
        onBackgroundEmSecondary: "var(--on-background-em-secondary)",
        onBackgroundEmTertiary: "var(--on-background-em-tertiary)",
        onBackgroundEmQuaternary: "var(--on-background-em-quaternary)",

        onBackgroundNeutralPrimary: "var(--on-background-neutral-primary)",

        backgroundPrimary: "var(--background-primary)",
        backgroundSecondary: "var(--background-secondary)",
        backgroundTeritiary: "var(--background-teritiary)",

        backgroundEmPrimary: "var(--background-em-primary)",
        backgroundEmSecondary: "var(--background-em-secondary)",
        backgroundEmTertiary: "var(--background-em-tertiary)",
        backgroundEmQuaternary: "var(--background-em-quaternary)",

        backgroundNeutralPrimary : "var(--background-neutral-primary)",

        backgroundInversePrimary: "var(--background-inverse-primary)",

        surfacePrimary: "var(--surface-primary)",
        surfaceSecondary: "var(--surface-secondary)",
        surfaceTertiary: "var(--surface-tertiary)",

        onBackgroundInversePrimary: "var(--on-background-inverse-primary)",
        onBackgroundInverseSecondary: "var(--on-background-inverse-secondary)",

        borderPrimary : "var(--border-primary)",
        borderSecondary : "var(--border-secondary)",

        borderEmPrimary : "var(--border-em-primary)",
        borderEmSecondary : "var(--border-em-secondary)",
        borderEmTertiary : "var(--border-em-tertiary)",

        illoSurfacePrimary: "var(--illo-surface-primary)",

        // Shadcn Colours
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage:{
        'clouds':"url('/images/clouds.svg')"
      },
      backgroundPosition:{

      }
    },
  },
  safelist: safeList,

  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;