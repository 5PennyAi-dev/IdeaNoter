'use client'

import type { Theme } from '@/hooks/useTheme'

interface ColorPickerProps {
  selectedColor: string
  onColorChange: (color: string) => void
  theme: Theme
}

const COLORS = [
  'note-coral',
  'note-white',
  'note-blue',
  'note-pink',
  'note-gray',
  'note-yellow',
  'note-green',
  'note-peach',
  'note-lavender',
  'note-mint',
]

export default function ColorPicker({ selectedColor, onColorChange, theme }: ColorPickerProps) {
  // Map color names to Tailwind classes for light and dark modes
  const getColorClass = (color: string) => {
    if (theme === 'dark') {
      return `bg-${color}-dark`
    }
    return `bg-${color}`
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
        Couleur de la note
      </label>
      <div className="grid grid-cols-5 gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onColorChange(color)}
            className={`
              w-full aspect-square rounded-lg transition-all duration-200
              ${getColorClass(color)}
              ${
                selectedColor === color
                  ? 'ring-4 ring-blue-500 dark:ring-blue-400 scale-110 shadow-xl'
                  : 'hover:scale-105 hover:shadow-lg ring-2 ring-gray-300 dark:ring-gray-600'
              }
            `}
            title={color.replace('note-', '').charAt(0).toUpperCase() + color.replace('note-', '').slice(1)}
          />
        ))}
      </div>
    </div>
  )
}
