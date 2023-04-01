/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'xs': '475px',
      ...defaultTheme.screens,
    },
    extend: {
      backgroundColor: {
        'blue-600': '#185ee0',
        'blue-200': '#e6eef9',
      },
      textColor: {
        'blue-600': '#185ee0',
      },
    },
  },
  daisyui: {
    styled: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: false,
    themes: [
      {
        mytheme: {
          "primary": "#0ea5e9",
          "secondary": "#c026d3",
          "accent": "#22c55e",
          "neutral": "#191D24",
          "base-100": "#2A303C",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        }
      },
      "light"
    ],
  },
  plugins: [
    require("daisyui"),
    require('tailwind-scrollbar-hide')
  ],
}
