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
        ink: '#06131c'
      },
      boxShadow: {
        glow: '0 20px 60px rgba(20, 184, 122, 0.16)',
        'glow-lg': '0 30px 80px rgba(20, 184, 122, 0.22)',
        'glow-sm': '0 8px 30px rgba(20, 184, 122, 0.12)'
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top, rgba(20,184,122,0.18), transparent 30%), linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)'
      },
      backgroundSize: {
        'hero-grid': 'auto, 44px 44px, 44px 44px'
      },
      screens: {
        'xs': '475px'
      }
    }
  },
  plugins: []
};
