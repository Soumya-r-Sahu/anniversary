/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          pink: '#ec4899',
          red: '#ef4444',
          light: '#fdf2f8'
        },
        secondary: {
          pink: '#f472b6',
          purple: '#a855f7'
        },
        gradient: {
          start: '#ff6b9d',
          middle: '#ffa8cc',
          end: '#ffb3d6'
        }
      },
      fontFamily: {
        'dancing': ['Dancing Script', 'cursive'],
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'bubble': 'bubble 8s ease-in-out infinite',
        'heart': 'heart 4s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        bubble: {
          '0%': { transform: 'translateY(100vh) scale(0)' },
          '10%': { transform: 'translateY(90vh) scale(0.3)' },
          '50%': { transform: 'translateY(50vh) scale(1)' },
          '90%': { transform: 'translateY(10vh) scale(0.3)' },
          '100%': { transform: 'translateY(-10vh) scale(0)' }
        },
        heart: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' }
        },
        sparkle: {
          '0%, 100%': { opacity: 0, transform: 'scale(0)' },
          '50%': { opacity: 1, transform: 'scale(1)' }
        },
        glow: {
          '0%': { textShadow: '0 0 10px currentColor' },
          '100%': { textShadow: '0 0 20px currentColor, 0 0 30px currentColor' }
        }
      },
      backdropBlur: {
        xs: '2px'
      },
      screens: {
        'xs': '475px'
      }
    },
  },
  plugins: [],
}
