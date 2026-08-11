/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{astro,html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm beige / neutral base — dominant ivory ground
        sand: {
          50: '#FBF7F1',
          100: '#F4EDE0',
          200: '#E8DECB',
          300: '#D8CBB2',
          400: '#C0B093',
          500: '#A59574',
          600: '#867758',
          700: '#675A43',
          800: '#4A4030',
          900: '#302920',
          950: '#1E1912',
        },
        // Chocolate brown — premium cocoa accent
        choco: {
          50: '#FAF6F1',
          100: '#F1E4D8',
          200: '#E1C7B0',
          300: '#C9A17C',
          400: '#AC7148',
          500: '#945531',
          600: '#7A4526',
          700: '#5E341D',
          800: '#452513',
          900: '#2C1709',
        },
        // Terracotta — warm clay accent
        terra: {
          50: '#FBF4EF',
          100: '#F6E3D8',
          200: '#EBC7B0',
          300: '#DCA384',
          400: '#CF7F5C',
          500: '#C2643F',
          600: '#A8502E',
          700: '#8A4024',
          800: '#6E321C',
          900: '#542512',
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
        sans: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(72,56,38,0.05), 0 8px 24px -10px rgba(72,56,38,0.10)',
        lift: '0 2px 4px rgba(72,56,38,0.06), 0 12px 32px -12px rgba(72,56,38,0.16)',
        ring: '0 0 0 3px rgba(148,85,49,0.18)',
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
