const colors = require('./node_modules/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'suyati-blue' : '#273986',
        'suyati-yellow' : '#FDB92D',
        'suyati-gray' : '#7F8191',
        rose: colors.rose
      },
      fontFamily: {
        'playfair': ['Playfair', 'sans-serif'],
        'oswald': ['Oswald', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tw-elements/dist/plugin')
  ],
}