import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        // Light mode note colors
        'note-coral': '#FF9999',
        'note-coral-accent': '#FF6666',
        'note-white': '#F5F5F5',
        'note-white-accent': '#E0E0E0',
        'note-blue': '#A8D8FF',
        'note-blue-accent': '#5BB8FF',
        'note-pink': '#E8D5F0',
        'note-pink-accent': '#D4A5E8',
        'note-gray': '#D4E4F7',
        'note-gray-accent': '#9CBCE8',
        'note-yellow': '#FFE5B4',
        'note-yellow-accent': '#FFD280',
        'note-green': '#B4E7B4',
        'note-green-accent': '#7DD87D',
        'note-peach': '#FFCC99',
        'note-peach-accent': '#FFB366',
        'note-lavender': '#E6D7FF',
        'note-lavender-accent': '#CCA8FF',
        'note-mint': '#D4F0E8',
        'note-mint-accent': '#A0E0D0',

        // Dark mode note colors (darker, more muted variants)
        'note-coral-dark': '#B86B6B',
        'note-coral-dark-accent': '#CC5555',
        'note-white-dark': '#3A3A3A',
        'note-white-dark-accent': '#4A4A4A',
        'note-blue-dark': '#5A8FBF',
        'note-blue-dark-accent': '#4A7FAF',
        'note-pink-dark': '#9F7FAF',
        'note-pink-dark-accent': '#B88FC8',
        'note-gray-dark': '#6B8AAF',
        'note-gray-dark-accent': '#7B9ABF',
        'note-yellow-dark': '#BFA570',
        'note-yellow-dark-accent': '#D0B680',
        'note-green-dark': '#6B9F6B',
        'note-green-dark-accent': '#7CB87C',
        'note-peach-dark': '#BF9060',
        'note-peach-dark-accent': '#D0A070',
        'note-lavender-dark': '#9F85BF',
        'note-lavender-dark-accent': '#B095D0',
        'note-mint-dark': '#6BA090',
        'note-mint-dark-accent': '#7CB0A0',
      },
    },
  },
  plugins: [],
}
export default config
