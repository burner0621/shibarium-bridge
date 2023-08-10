/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        box_color: '#ffd091'
      },
      backgroundImage: {
        'main-body': "url('images/background.png')"
      },
      boxShadow: {
        // eslint-disable-next-line no-template-curly-in-string
        'main-box': '0 0 120px hsla(${COLORS.primary[500]} / 0.25)'
      }
    },
  },
  plugins: [],
}

