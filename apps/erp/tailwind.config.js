/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        prohealth: {
          primary: '#1F5084',       // Deep trust blue
          'primary-hover': '#164273',
          secondary: '#2B78C6',     // Medium brand blue
          accent: '#3B82F6',        // Active sky blue
          'accent-hover': '#2563eb',
          cyan: '#0284c7',
          ice: '#EAF2F9',           // Soft ice-blue backdrop
          tint: '#F0F6FB',          // Light tint
          canvas: '#F8FAFC',        // Neutral canvas
          heading: '#1D2939',       // Charcoal headings
          body: '#475467',          // Slate body text
          muted: '#667085',         // Muted secondary
          border: '#E4E7EC',        // Clean border
        },
        brand: {
          navy: '#1F5084',
          dark: '#101828',
          slate: '#1D2939',
          blue: '#2B78C6',
          cyan: '#0284c7',
          sky: '#38bdf8',
          accent: '#3B82F6',
          emergency: '#ef4444',
          light: '#F0F6FB',
          border: '#E4E7EC',
        },
      },
      boxShadow: {
        'prohealth': '0px 10px 30px rgba(0, 0, 0, 0.05)',
        'prohealth-lg': '0px 20px 40px rgba(31, 80, 132, 0.08)',
        'prohealth-hover': '0px 15px 35px rgba(43, 120, 198, 0.12)',
      },
    },
  },
  plugins: [],
};
