/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14323f",
        mist: "#eef4f2",
        mint: "#d9ece7",
        foam: "#f6fbf8",
      },
      boxShadow: {
        panel: "0 16px 40px rgba(20, 50, 63, 0.08)",
      },
      backgroundImage: {
        aurora:
          "radial-gradient(circle at top left, rgba(101, 190, 167, 0.22), transparent 34%), linear-gradient(180deg, #f6fbf8 0%, #eef4f2 100%)",
      },
    },
  },
  plugins: [],
};
