import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CPSS Color Palette - hyphenated for easier use
        'cpss-green': '#3A7D44',      // Primary Green (CPSS Main) - Lighter
        'cpss-gold': '#E8C547',        // Griffin Gold
        'cpss-black': '#0D0D0D',       // Deep Black
        'cpss-white': '#F8F8F8',       // Apple White
        'cpss-grey': '#E5E5E7',        // Soft Grey
        primary: {
          DEFAULT: '#3A7D44',     // CPSS Green - Lighter
          dark: '#1F4D2B',         // Darker green
          light: '#3FA66B',       // Lighter green
        },
        gold: {
          DEFAULT: '#E8C547',     // Griffin Gold
          dark: '#D4B03A',        // Darker gold
          light: '#F5D76E',       // Lighter gold
        },
        // Dark mode colors
        dark: {
          bg: '#0D0D0D',
          'bg-secondary': '#1A1A1A',
          'bg-card': '#1C1C1E',
          text: '#F8F8F8',
          'text-secondary': '#E5E5E7',
          'text-muted': '#A0A0A5',
          border: '#3A3A3C',
        },
      },
      borderRadius: {
        'apple': '12px',
        'apple-lg': '16px',
        'apple-xl': '20px',
      },
      boxShadow: {
        'apple': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'apple-lg': '0 8px 24px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
export default config

