import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'note-coral': '#FF9999',
        'note-white': '#F5F5F5',
        'note-blue': '#A8D8FF',
        'note-pink': '#E8D5F0',
        'note-gray': '#D4E4F7',
        'note-yellow': '#FFE5B4',
        'note-green': '#B4E7B4',
        'note-peach': '#FFCC99',
        'note-lavender': '#E6D7FF',
        'note-mint': '#D4F0E8',
      },
    },
  },
  plugins: [],
}
export default config
