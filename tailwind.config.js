/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        blink: { to: { visibility: 'hidden' } },
        shake: {
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        wave: {
          '0%,40%,100%': { transform: 'translateY(0)' },
          '20%': { transform: 'translateY(-10px)' },
        },
      },
      animation: { blink: 'blink 1s steps(2,start) infinite', shake: 'shake 0.2s infinite', wave: 'wave 1s' },
    },
  },
  plugins: [require('daisyui')],
  daisyui: { themes: ['light', 'dark'] },
};
