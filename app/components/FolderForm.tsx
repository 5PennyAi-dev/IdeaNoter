'use client'

import { useState, useEffect } from 'react'
import type { Theme } from '@/hooks/useTheme'

interface FolderFormProps {
  onSubmit: (name: string, color: string) => void
  onCancel: () => void
  initialName?: string
  initialColor?: string
  isEditing?: boolean
  theme: Theme
}

const FOLDER_COLORS = ['blue', 'green', 'purple', 'orange', 'pink', 'gray']

export default function FolderForm({
  onSubmit,
  onCancel,
  initialName = '',
  initialColor = 'blue',
  isEditing = false,
  theme,
}: FolderFormProps) {
  const [name, setName] = useState(initialName)
  const [selectedColor, setSelectedColor] = useState(initialColor)

  useEffect(() => {
    setName(initialName)
    setSelectedColor(initialColor)
  }, [initialName, initialColor])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    if (trimmedName) {
      onSubmit(trimmedName, selectedColor)
      setName('')
      setSelectedColor('blue')
    }
  }

  // Get folder color classes
  const getFolderColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: theme === 'dark' ? 'bg-folder-blue-dark' : 'bg-folder-blue',
      green: theme === 'dark' ? 'bg-folder-green-dark' : 'bg-folder-green',
      purple: theme === 'dark' ? 'bg-folder-purple-dark' : 'bg-folder-purple',
      orange: theme === 'dark' ? 'bg-folder-orange-dark' : 'bg-folder-orange',
      pink: theme === 'dark' ? 'bg-folder-pink-dark' : 'bg-folder-pink',
      gray: theme === 'dark' ? 'bg-folder-gray-dark' : 'bg-folder-gray',
    }
    return colorMap[color] || colorMap.blue
  }

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transition-colors duration-200">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 tracking-tight">
            {isEditing ? 'Modifier le dossier' : 'Nouveau dossier'}
          </h2>

          {/* Name input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Nom du dossier
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Entrez le nom..."
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              autoFocus
            />
          </div>

          {/* Color Picker */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Couleur du dossier
            </label>
            <div className="grid grid-cols-6 gap-2">
              {FOLDER_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`
                    w-full aspect-square rounded-lg transition-all duration-200
                    ${getFolderColorClass(color)}
                    ${
                      selectedColor === color
                        ? 'ring-4 ring-blue-500 dark:ring-blue-400 scale-110 shadow-xl'
                        : 'hover:scale-105 hover:shadow-lg ring-2 ring-gray-300 dark:ring-gray-600'
                    }
                  `}
                  title={color.charAt(0).toUpperCase() + color.slice(1)}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition-all hover:shadow-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:scale-105"
            >
              {isEditing ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
