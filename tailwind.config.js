/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fef7ed",   // Light peach
          100: "#fed7aa",  // Light orange
          200: "#fdba74",  // Medium light orange
          300: "#fb923c",  // Medium orange
          400: "#f97316",  // Bright orange
          500: "#ea580c",  // Deep orange
          600: "#dc2626",  // Red orange
          700: "#b91c1c",  // Dark red
          800: "#7f1d1d",  // Very dark red
          900: "#451a03",  // Dark brown
        },
        dark: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",  // Medium brown
          800: "#292524",  // Dark brown (main background)
          900: "#1c1917",  // Very dark brown
        },
        secondary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'product': '0 4px 15px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
