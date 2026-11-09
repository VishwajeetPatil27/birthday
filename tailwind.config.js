/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#FFF5F7',
          100: '#FFE4E9',
          200: '#FCD0D9',
          300: '#F9A8BA',
          400: '#F47291',
          500: '#E8436E',
          600: '#D12255',
        },
        lavender: {
          50: '#FAF8FF',
          100: '#F3EEFF',
          200: '#E6DCFF',
          300: '#CFBAFF',
          400: '#B28FFF',
          500: '#9462FB',
        },
        cream: {
          50: '#FFFEFA',
          100: '#FFFDF5',
          200: '#FFF9E8',
          300: '#FFF3D4',
        },
        peach: {
          50: '#FFF8F5',
          100: '#FFEFEA',
          200: '#FFD7CC',
          300: '#FFBAA6',
          400: '#FA8F73',
        },
        rosegold: {
          100: '#F7E7E5',
          200: '#EAC8C4',
          300: '#DCA7A2',
          400: '#C97D76',
          500: '#B76E79',
          600: '#995660',
        }
      },
      fontFamily: {
        handwriting: ['"Dancing Script"', '"Caveat"', 'cursive'],
        script: ['"Sacramento"', 'cursive'],
        rounded: ['"Quicksand"', '"Nunito"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 3s ease-in-out infinite',
        'sway': 'sway 4s ease-in-out infinite',
        'twinkle': 'twinkle 2.5s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(3deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(12px) rotate(-3deg)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.04)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      boxShadow: {
        'soft-pink': '0 10px 30px -10px rgba(244, 114, 145, 0.3)',
        'glow-pink': '0 0 25px rgba(244, 114, 145, 0.45)',
        'polaroid': '0 12px 28px rgba(183, 110, 121, 0.18), 0 4px 10px rgba(0, 0, 0, 0.05)',
        'envelope': '0 20px 45px -10px rgba(183, 110, 121, 0.25)',
      }
    },
  },
  plugins: [],
}

