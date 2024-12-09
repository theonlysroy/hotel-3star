/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        hotelBg: "url('/hotelBg.jpg')",
        hotelBg2: "url('/hotelBg2.jpg')",
        hotelBg3: "url('/hotelBg3.jpg')",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
