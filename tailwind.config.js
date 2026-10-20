/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pine: {
          700: '#1d4d3f',
          800: '#14362c',
          900: '#0e2921',
          950: '#081e18',
        },
        mint: {
          300: '#8fd8bd',
          400: '#4cc79a',
          500: '#22b07d',
          600: '#159466',
        },
        ivory: {
          50: '#fdfcf9',
          100: '#faf7f0',
          200: '#f3eee1',
          300: '#e9e1cd',
        },
        gold: {
          400: '#e3b94e',
          500: '#d4a017',
        },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(14,41,33,0.06), 0 8px 24px -12px rgba(14,41,33,0.12)',
      },
    },
  },
  plugins: [],
}
