/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A', // Deep Navy - Primary Background
        card: '#1E293B', // Slate Gray - Card Background
        accent: '#E2B870', // Muted Gold - Accent / Action
        success: '#10B981', // Emerald - Success / Positive
        text: '#F8FAFC', // Off-White - Text (Primary)
      },
    },
  },
  plugins: [],
}

