/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // For Next.js use: "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'fadeInDown': 'fadeInDown 1s ease-out forwards',
        'fadeInUp': 'fadeInUp 1s ease-out forwards',
      },
    },
  },
  plugins: [],
}