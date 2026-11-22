/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A121C',
          900: '#101D2C', // Deep Midnight Navy
          800: '#172B43', // Dark Blue
          700: '#223C5E',
          600: '#32547E',
        },
        emerald: {
          800: '#1B5E4B',
          700: '#21735C',
          600: '#27856B', // Emerald Green
          500: '#30A383',
          100: '#E6F4F0',
          50: '#F2FAF7',
        },
        gold: {
          600: '#A98956',
          500: '#C6A879', // Champagne Gold
          400: '#D9C29D',
          100: '#F8F4ED',
          50: '#FCFAF6',
        },
        ivory: {
          100: '#EFECE4',
          50: '#F7F5F0', // Warm Ivory
        },
        muted: '#87919D',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
