/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'brand-orange': '#f97316',
        'brand-gray': '#6b7280',
        'brand-dark': '#1e293b',
        'brand-light': '#f9fafb',
      },
      animation: {
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 1s ease-in',
        'pulse-custom': 'pulse 2s infinite',
      },
      keyframes: {
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(249, 115, 22, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(249, 115, 22, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(249, 115, 22, 0)' },
        },
      },
    },
  },
  plugins: [],
} 