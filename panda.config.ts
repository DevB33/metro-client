import { defineConfig } from '@pandacss/dev';
import { error, warn } from 'console';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          black: { value: '#000000' },
          white: { value: '#FFFFFF' },
          gray: { value: '#B6B6B6' },
          warning: { value: '#FFA500' },
          error: { value: '#FF0000' },
          background: { value: '#F8F8F8' },
          lineOne: { value: '#034983' },
          lineTwo: { value: '#01A140' },
          lineThree: { value: '#EE6C0D' },
          lineFour: { value: '#009DCC' },
          lineFive: { value: '#794597' },
          lineSix: { value: '#7C4A32' },
        },
        spacing: {
          tiny: { value: '0.5rem' },
          small: { value: '1rem' },
          base: { value: '2rem' },
          large: { value: '4rem' },
          huge: { value: '6rem' },
        },
        fontSizes: {
          sm: { value: '0.5rem' },
          md: { value: '1rem' },
          lg: { value: '2rem' },
          xl: { value: '4rem' },
          xxl: { value: '6rem' },
        },
        shadows: {
          sidebar: { value: '0 0 10px 0 rgba(0, 0, 0, 0.20)' },
          loginButton: { value: '0 0 20px 0 rgba(0, 0, 0, 0.15)' },
        },
        fontWeights: {
          light: { value: '300' },
          regular: { value: '400' },
          medium: { value: '500' },
          semibold: { value: '600' },
          bold: { value: '700' },
          black: { value: '900' },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
});
