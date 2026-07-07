/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue':  '#05059b',
        'brand-red':   '#ff5050',
        'brand-dark':  '#0a0a1a',
        'brand-light': '#f7f8fc',
        'brand-text':  '#1a1a2e',
        'brand-muted': '#6b7280',
      },
      fontFamily: {
        sora:   ['Sora', 'sans-serif'],
        dm:     ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
