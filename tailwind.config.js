/** @type {import('tailwindcss').Config} */
import getBreakpoints from './src/static/mediaBreakpoints';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      backdrop: 'rgb(0,0,0,0.3)',
      border: 'rgba(0, 0, 0, 0.12)',
      primary: '#568ce1',
      secondary: '#26a69a',
      secondaryHigh: '#2CCAA1',
      accent: '#9c27b0',
      positive: '#21ba45',
      negative: '#c10015',
      info: '#31ccec',
      warning: '#c29a2f',
      dark: '#1d1d1d',
      white: '#fff',
      inputbg: '#f2f3f7cc',
      softgray: '#eeeeee',
      softgray3: '#9e9e9e',
      softgray4: '#494949',
    },
    screens: {
      ...getBreakpoints(true),
    },
    extend: {
      fontSize: {
        xs: '0.75rem', // 12px
        sm: '0.875rem', // 14px
        base: '1rem', // 16px
        lg: '1.125rem', // 18px
        xl: '1.25rem', // 20px
        '2xl': '1.5rem', // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem', // 48px
        '6xl': '3.75rem', // 60px
        '7xl': '4.5rem', // 72px
        '8xl': '6rem', // 96px
        '9xl': '8rem', // 128px
      },
      gridTemplateColumns: {
        'auto-fill-300': 'repeat(auto-fill, minmax(300px, 1fr))',
        'auto-fit-300': 'repeat(auto-fit, minmax(300px, 1fr))',
        'auto-fill-500': 'repeat(auto-fill, minmax(500px, 1fr))',
        'auto-fit-500': 'repeat(auto-fit, minmax(500px, 1fr))',
      },
    },
  },
  plugins: [],
};
