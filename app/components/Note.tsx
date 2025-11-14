'use client'

import { Pin, X } from 'lucide-react'

interface NoteProps {
  id: string
  text: string
  title?: string
  color: string
  createdAt: string
  tags: string[]
  isPinned?: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onPin: (id: string) => void
}

export default function Note({ id, text, title, color, createdAt, tags, isPinned = false, onEdit, onDelete, onPin }: NoteProps) {
  const colorClasses: Record<string, string> = {
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

  const formatDate = (isoString: string): string => {
    try {
      const date = new Date(isoString)
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
      className={`${colorClasses[color]} rounded-xl p-6 min-h-[150px] flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer relative group border-l-4`}
      onClick={() => onEdit(id)}
    >
      {tags && tags.length > 0 && (
        <div className="mb-3">
          <span className="text-gray-700 text-xs font-semibold bg-black/10 rounded px-2 py-1 inline-block">
            {tags.join('-')}
          </span>
        </div>
      )}
      {title && (
        <h3 className="text-gray-900 text-xl font-bold mb-3 break-words pr-8 leading-tight">
          {title}
        </h3>
      )}
      <div
        className="text-gray-800 text-base leading-relaxed break-words pr-8 note-content"
        dangerouslySetInnerHTML={{ __html: text }}
      />
      <div className="flex justify-between items-end mt-4">
        <div></div>
        <span className="text-gray-700 text-xs font-medium">
          {formatDate(createdAt)}
        </span>
      </div>
      <div className={`absolute top-3 right-3 flex gap-2 transition-opacity duration-200 ${isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPin(id)
          }}
          className={`rounded-lg w-8 h-8 flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            isPinned
              ? 'bg-yellow-500/90 hover:bg-yellow-600/90 text-white shadow-lg'
              : 'bg-white/80 hover:bg-white/90 text-gray-700 shadow-md'
          }`}
          title={isPinned ? 'Retirer de la place' : 'Figer en place'}
        >
          <Pin size={16} className={isPinned ? 'fill-current' : ''} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
              onDelete(id)
            }
          }}
          className="bg-red-500/90 hover:bg-red-600/90 backdrop-blur-sm text-white rounded-lg w-8 h-8 flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
          title="Supprimer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
