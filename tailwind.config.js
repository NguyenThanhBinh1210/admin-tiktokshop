/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1DC071',
        'text-color': '#808191',
        textColor4: '#B2B3BD',
        violet: '#6F49FD',
        bgPrimary: '#4ACD8D',
        secondary: '#8C6DFD',
        textColorwhite: '#FFFFFF',
        iconColor: '#A2A2A8',
        bgClose: '#F9E3E3',
        textSearch: '#171725',
        textsearchColor: '#808191',
        textCart: '#f51010',
        active: 'rgba(0, 0, 0, 0.25)',
        textBlack: '#000000',
        boderErr: '#ff0000',
        borderNone: '#e5e7eb'
      }
    },
    screens: {
      mobile: { min: '350px', max: '600px' },
      tablet: { min: '601px', max: '1024px' }
    }
  }
}
