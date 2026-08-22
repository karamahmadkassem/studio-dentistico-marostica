/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#000340',
          deep: '#030D1D',
          cyan: '#4AACE1',
          'cyan-soft': '#E8F6FC',
          'cyan-hover': '#3A9AD0',
        },
        surface: '#FFFFFF',
        'surface-muted': '#F4F7FA',
        ink: '#0F172A',
        'ink-muted': '#475569',
        'ink-soft': '#94A3B8',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
        brand: ['"Elite Danger"', 'sans-serif'],
      },
      fontSize: {
        display: ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        heading: ['2rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '700' }],
        'heading-sm': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
      },
      maxWidth: {
        content: '72rem',
        narrow: '42rem',
      },
      spacing: {
        header: '5rem',
        section: '6rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(3, 13, 29, 0.08)',
        focus: '0 0 0 3px rgba(74, 172, 225, 0.45)',
      },
    },
  },
  plugins: [],
};
