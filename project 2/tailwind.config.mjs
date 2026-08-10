import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sand: {
          50: 'hsl(40 30% 97%)',
          100: 'hsl(40 30% 94%)',
          200: 'hsl(38 28% 88%)',
          300: 'hsl(36 26% 80%)',
          400: 'hsl(34 24% 70%)',
          500: 'hsl(32 22% 60%)',
          600: 'hsl(30 20% 50%)',
          700: 'hsl(28 18% 40%)',
          800: 'hsl(26 16% 30%)',
          900: 'hsl(24 14% 20%)',
          950: 'hsl(22 12% 12%)',
        },
        choco: {
          50: 'hsl(25 40% 95%)',
          100: 'hsl(25 38% 88%)',
          200: 'hsl(25 36% 78%)',
          300: 'hsl(25 34% 68%)',
          400: 'hsl(25 32% 58%)',
          500: 'hsl(25 30% 48%)',
          600: 'hsl(25 28% 38%)',
          700: 'hsl(25 26% 30%)',
          800: 'hsl(25 24% 22%)',
          900: 'hsl(25 22% 16%)',
          950: 'hsl(25 20% 10%)',
        },
        ink: {
          DEFAULT: 'hsl(30 10% 12%)',
          light: 'hsl(30 10% 30%)',
          muted: 'hsl(30 8% 45%)',
        },
        success: {
          DEFAULT: 'hsl(145 50% 45%)',
          foreground: 'hsl(145 50% 97%)',
          light: 'hsl(145 50% 95%)',
        },
        warning: {
          DEFAULT: 'hsl(38 80% 50%)',
          foreground: 'hsl(38 80% 10%)',
          light: 'hsl(38 80% 95%)',
        },
        error: {
          DEFAULT: 'hsl(0 70% 50%)',
          foreground: 'hsl(0 70% 97%)',
          light: 'hsl(0 70% 95%)',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-fast': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-fast': 'fade-in-fast 0.2s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
