import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // Enable dark mode with class strategy
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // Custom colors for dark theme
        dark: {
          DEFAULT: '#121212',
          light: '#1E1E1E',
          accent: '#BB86FC', // Example accent color for dark mode
        },
      },
      textColor: {
        dark: {
          primary: '#E0E0E0', // Light gray for text
          secondary: '#B0B0B0', // Muted gray for secondary text
        },
      },
      borderColor: {
        dark: '#333333', // Borders for dark mode
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Optional: Improve form styling
    require('@tailwindcss/typography'), // Optional: Better typography
  ],
};

export default config;
