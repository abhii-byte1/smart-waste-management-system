/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbf7',
          100: '#d4f5ea',
          200: '#a8ebcf',
          300: '#6ddcaf',
          400: '#33c890',
          500: '#14b87a',
          600: '#0f9563',
          700: '#0c7450',
          800: '#095a3e',
          900: '#06402d'
        },
        ink: {
          900: '#13151A', // Outside background
          800: '#1A1D24', // Main Container
          700: '#232730', // Inner elements / hover
        },
        exact: {
          purple: '#a855f7',
          red: '#ef4444',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          green: '#22c55e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: []
};
