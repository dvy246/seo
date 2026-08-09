/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm beige / neutral base
        sand: {
          50: '#FBF8F3',
          100: '#F5EFE6',
          200: '#EBE2D3',
          300: '#DCD0BC',
          400: '#C4B69E',
          500: '#A89878',
          600: '#8A7B5E',
          700: '#6B5E47',
          800: '#4D4435',
          900: '#322B21',
          950: '#1F1A14',
        },
        // Chocolate brown — primary accent
        choco: {
          50: '#F8F4F1',
          100: '#EDE0D8',
          200: '#D9C2B3',
          300: '#BF9A82',
          400: '#A47657',
          500: '#8B5E3C',
          600: '#6F4A2E',
          700: '#553824',
          800: '#3D281A',
          900: '#271A11',
        },
        // Blue pastel — secondary accent
        pastel: {
          50: '#F0F6FA',
          100: '#DEEBF5',
          200: '#BCD7EC',
          300: '#94BBD9',
          400: '#6E9CC2',
          500: '#5686B0',
          600: '#436E94',
          700: '#355777',
          800: '#28425C',
          900: '#1C2E41',
        },
        // Semantic
        success: '#5C8956',
        warning: '#C9962B',
        error: '#B5453C',
        ink: {
          DEFAULT: '#2A2620',
          soft: '#5A5346',
          muted: '#8A8273',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(50,43,33,0.04), 0 4px 16px rgba(50,43,33,0.06)',
        lift: '0 2px 6px rgba(50,43,33,0.06), 0 12px 32px rgba(50,43,33,0.08)',
        ring: '0 0 0 3px rgba(139,94,60,0.18)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
