/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    

  ],
  theme: {
    extend: {
      colors: {
        border: "#e2e8f0",
        background: "#fff",
        foreground: "#000",
      },
      backgroundColor: {
        background: "var(--background)",
      },
      textColor: {
        foreground: "var(--foreground)",
      },
      borderColor: {
        border: "var(--border)",
      }
    },
  },
  plugins: [],
}

