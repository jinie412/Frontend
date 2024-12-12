module.exports = {
  content: [
    "./login/**/*.{html,js}",
    "./setting/**/*.{html,js}",
    "./homepage/**/*.{html,js}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        grayBg: "#f5f5f5",
        blueTaskbar: "#396CF0",
        redNote: "#EF6E6E",
        greenNote: "#53C797",
        yellowNote: "#F1B561",
        grayBut: "#D9D9D9",
        lightBlue: "#D6E2F2",
        whiteBlue: "#eef2f6",
      },
      width: {
        1296: "1296px",
      },
      height: {
        820: "820px",
      },
      borderRadius: {
        40: "40px",
      },
    },
  },
  plugins: [],
};
