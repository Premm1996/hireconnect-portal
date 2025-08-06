/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          600: '#4f46e5',
          700: '#4338ca',
        },
        purple: {
          600: '#9333ea',
        },
        pink: {
          600: '#db2777',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          900: '#0f172a',
        }
      },
    },
  },
  plugins: [],
}
