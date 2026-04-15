/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbf7',
          100: '#d4f5ea',
          500: '#14b87a',
          600: '#0f9563',
          700: '#0c7450'
        },
        ink: '#06131c'
      },
      boxShadow: {
        glow: '0 20px 60px rgba(20, 184, 122, 0.16)'
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top, rgba(20,184,122,0.18), transparent 30%), linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)'
      },
      backgroundSize: {
        'hero-grid': 'auto, 44px 44px, 44px 44px'
      }
    }
  },
  plugins: []
};
