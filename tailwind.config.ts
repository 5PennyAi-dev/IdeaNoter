import type { Config } from 'tailwindcss'

const config: Config = {
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
      },
    },
  },
  plugins: [],
}
export default config
