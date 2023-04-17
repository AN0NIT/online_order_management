module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'suyati-blue' : '#273986',
        'suyati-yellow' : '#FDB92D',
        'suyati-gray' : '#7F8191'
      },
    },
  },
  plugins: [
    require('tw-elements/dist/plugin')
  ],
}