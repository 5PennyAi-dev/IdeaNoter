'use client'

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
    'note-coral': 'bg-note-coral',
    'note-white': 'bg-note-white',
    'note-blue': 'bg-note-blue',
    'note-pink': 'bg-note-pink',
    'note-gray': 'bg-note-gray',
    'note-yellow': 'bg-note-yellow',
    'note-green': 'bg-note-green',
    'note-peach': 'bg-note-peach',
    'note-lavender': 'bg-note-lavender',
    'note-mint': 'bg-note-mint',
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
      className={`${colorClasses[color]} rounded-lg p-6 min-h-[150px] flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow cursor-pointer relative group`}
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
        <h3 className="text-gray-800 text-lg font-bold mb-2 break-words pr-8">
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
      <div className={`absolute top-3 right-3 flex gap-2 transition-opacity ${isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPin(id)
          }}
          className={`rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold transition-colors ${
            isPinned
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
          }`}
          title={isPinned ? 'Retirer de la place' : 'Figer en place'}
        >
          📌
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(id)
          }}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold transition-colors"
          title="Supprimer"
        >
          ×
        </button>
      </div>
    </div>
  )
}
