/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 10px 30px -12px rgba(0,0,0,0.25)',
        softLg: '0 20px 60px -24px rgba(0,0,0,0.35)'
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem'
      },
      colors: {
        accent: {
          DEFAULT: '#6366F1', // indigo-500
          600: '#4F46E5'
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}