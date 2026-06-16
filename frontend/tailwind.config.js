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
        ink: '#06131c',
        surface: '#0a1a24',
        'surface-light': '#0f2430',
        neon: {
          green: '#14b87a',
          red: '#ef4444',
          cyan: '#22d3ee',
          amber: '#f59e0b'
        }
      },
      boxShadow: {
        glow: '0 20px 60px rgba(20, 184, 122, 0.16)',
        'glow-lg': '0 30px 80px rgba(20, 184, 122, 0.22)',
        'glow-sm': '0 8px 30px rgba(20, 184, 122, 0.12)',
        'neon-green': '0 0 20px rgba(20, 184, 122, 0.4), 0 0 40px rgba(20, 184, 122, 0.15)',
        'neon-red': '0 0 20px rgba(239, 68, 68, 0.4), 0 0 40px rgba(239, 68, 68, 0.15)',
        'neon-cyan': '0 0 20px rgba(34, 211, 238, 0.4), 0 0 40px rgba(34, 211, 238, 0.15)',
        'neon-amber': '0 0 20px rgba(245, 158, 11, 0.4), 0 0 40px rgba(245, 158, 11, 0.15)'
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top, rgba(20,184,122,0.18), transparent 30%), linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)'
      },
      backgroundSize: {
        'hero-grid': 'auto, 44px 44px, 44px 44px'
      },
      screens: {
        xs: '475px'
      }
    }
  },
  plugins: []
};
