module.exports = {
  content: ["./src/**/*.{html,js}", "./public/**/*.{html,js}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        blueTaskbar: "#396CF0",
        redNote: "#EF6E6E",
        greenNote: "#53C797",
        yellowNote: "#F1B561",
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
