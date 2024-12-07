/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        hotelBg: "url('/hotelBg.jpg')",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
