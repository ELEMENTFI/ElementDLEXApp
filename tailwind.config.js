/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        themeDarkBlack: "#010006",
        themeBlack: "#0c0b11",
        themePurple: "#919CFF",
        themeLightPurple: "#D591FF",
        themeGray: {
          200: "#D2D2D2",
          400: "#B2B2B2",
          500: "#969696",
          600: "#666666",
          700: "#212123",
          800: "#0C0C0E",
          900: "#191919",
        },
      },
    },
    screens: {
      bigDesktop: "1700px",
      desktop: "1400px",
      midDestop: "1100px",
      bigTablet: "900px",
      tablet: "500px",
      sm: "391px",
    },
  },
  plugins: [],
};
