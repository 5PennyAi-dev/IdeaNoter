'use client'

import { Pin, X, Star } from 'lucide-react'
import { sanitizeHTML } from '@/lib/sanitize'
import type { Theme } from '@/hooks/useTheme'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'

interface NoteProps {
  id: string
  text: string
  title?: string
  color: string
  createdAt: string | number  // Support both ISO string and timestamp
  tags: string[]
  isPinned?: boolean
  isFavorite?: boolean
  theme: Theme
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onPin: (id: string) => void
  onFavorite: (id: string) => void
  onDragStart?: (id: string) => void
  onDragEnd?: () => void
}

export default function Note({ id, text, title, color, createdAt, tags, isPinned = false, isFavorite = false, theme, onEdit, onDelete, onPin, onFavorite, onDragStart, onDragEnd }: NoteProps) {
  // Detect touch device for button visibility
  const isTouchDevice = useIsTouchDevice()

  // Color classes for light and dark modes
  const colorClassesLight: Record<string, string> = {
    'note-coral': 'bg-note-coral border-note-coral-accent',
    'note-white': 'bg-note-white border-note-white-accent',
    'note-blue': 'bg-note-blue border-note-blue-accent',
    'note-pink': 'bg-note-pink border-note-pink-accent',
    'note-gray': 'bg-note-gray border-note-gray-accent',
    'note-yellow': 'bg-note-yellow border-note-yellow-accent',
    'note-green': 'bg-note-green border-note-green-accent',
    'note-peach': 'bg-note-peach border-note-peach-accent',
    'note-lavender': 'bg-note-lavender border-note-lavender-accent',
    'note-mint': 'bg-note-mint border-note-mint-accent',
  }

  const colorClassesDark: Record<string, string> = {
    'note-coral': 'bg-note-coral-dark border-note-coral-dark-accent',
    'note-white': 'bg-note-white-dark border-note-white-dark-accent',
    'note-blue': 'bg-note-blue-dark border-note-blue-dark-accent',
    'note-pink': 'bg-note-pink-dark border-note-pink-dark-accent',
    'note-gray': 'bg-note-gray-dark border-note-gray-dark-accent',
    'note-yellow': 'bg-note-yellow-dark border-note-yellow-dark-accent',
    'note-green': 'bg-note-green-dark border-note-green-dark-accent',
    'note-peach': 'bg-note-peach-dark border-note-peach-dark-accent',
    'note-lavender': 'bg-note-lavender-dark border-note-lavender-dark-accent',
    'note-mint': 'bg-note-mint-dark border-note-mint-dark-accent',
  }

  const colorClasses = theme === 'dark' ? colorClassesDark : colorClassesLight

  const formatDate = (dateValue: string | number): string => {
    try {
      // Handle both ISO string and timestamp
      const date = typeof dateValue === 'number' ? new Date(dateValue) : new Date(dateValue)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}-${month}-${year}`
    } catch {
      return 'Invalid date'
    }
  }

  return (
    <div
      draggable
      onDragStart={() => onDragStart && onDragStart(id)}
      onDragEnd={() => onDragEnd && onDragEnd()}
      className={`${colorClasses[color]} rounded-xl p-6 min-h-[150px] flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer relative group border-l-4`}
      onClick={() => onEdit(id)}
    >
      {tags && tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-gray-700 dark:text-gray-300 text-xs font-semibold bg-gradient-to-r from-black/10 to-black/5 dark:from-white/20 dark:to-white/10 hover:from-black/15 hover:to-black/10 dark:hover:from-white/25 dark:hover:to-white/15 rounded-full px-3 py-1 inline-block shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {title && (
        <h3 className="text-gray-900 dark:text-gray-100 text-xl font-bold mb-3 break-words pr-8 leading-tight">
          {title}
        </h3>
      )}
      <div
        className="text-gray-800 dark:text-gray-200 text-base leading-relaxed break-words pr-8 note-content"
        dangerouslySetInnerHTML={{ __html: sanitizeHTML(text) }}
      />
      <div className="flex justify-between items-end mt-4">
        <div></div>
        <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">
          {formatDate(createdAt)}
        </span>
      </div>
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onFavorite(id)
          }}
          className={`rounded-lg w-11 h-11 md:w-11 md:h-11 flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            isFavorite
              ? 'bg-amber-500/90 hover:bg-amber-600/90 text-white shadow-lg opacity-100'
              : `bg-white/80 dark:bg-gray-700/80 hover:bg-white/90 dark:hover:bg-gray-700/90 text-gray-700 dark:text-gray-300 shadow-md ${isTouchDevice ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`
          }`}
          title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Star size={18} className={isFavorite ? 'fill-current' : ''} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPin(id)
          }}
          className={`rounded-lg w-11 h-11 md:w-11 md:h-11 flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            isPinned
              ? 'bg-yellow-500/90 hover:bg-yellow-600/90 text-white shadow-lg opacity-100'
              : `bg-white/80 dark:bg-gray-700/80 hover:bg-white/90 dark:hover:bg-gray-700/90 text-gray-700 dark:text-gray-300 shadow-md ${isTouchDevice ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`
          }`}
          title={isPinned ? 'Retirer de la place' : 'Figer en place'}
        >
          <Pin size={18} className={isPinned ? 'fill-current' : ''} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
              onDelete(id)
            }
          }}
          className={`bg-red-500/90 hover:bg-red-600/90 backdrop-blur-sm text-white rounded-lg w-11 h-11 md:w-11 md:h-11 flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg ${isTouchDevice ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          title="Supprimer"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
