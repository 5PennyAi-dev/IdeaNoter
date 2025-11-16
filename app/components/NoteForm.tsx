'use client'

import { useState, useEffect } from 'react'
import RichTextEditor from './RichTextEditor'
import ColorPicker from './ColorPicker'
import { useTheme } from '@/hooks/useTheme'
import { Folder } from 'lucide-react'
import type { Folder as FolderType } from '@/lib/instant'

interface NoteFormProps {
  onSubmit: (title: string, text: string, tags: string[], color: string, folderId?: string) => void
  onCancel: () => void
  initialTitle?: string
  initialText?: string
  initialTags?: string[]
  initialColor?: string
  initialFolderId?: string
  isEditing?: boolean
  allTags: string[]
  onAddTag: (tag: string) => void
  folders: FolderType[]
  currentView?: string
}

export default function NoteForm({
  onSubmit,
  onCancel,
  initialTitle = '',
  initialText = '',
  initialTags = [],
  initialColor = 'note-blue',
  initialFolderId,
  isEditing = false,
  allTags,
  onAddTag,
  folders,
  currentView,
}: NoteFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [text, setText] = useState(initialText)
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags)
  const [selectedColor, setSelectedColor] = useState(initialColor)
  const [selectedFolder, setSelectedFolder] = useState<string>(initialFolderId || '')
  const [newTag, setNewTag] = useState('')
  const [showNewTagInput, setShowNewTagInput] = useState(false)

  const { theme } = useTheme()

  // Auto-select current folder when creating new note
  useEffect(() => {
    if (!isEditing && !initialFolderId && currentView && currentView !== 'all' && currentView !== 'favorites' && currentView !== 'uncategorized') {
      // If we're in a folder view, pre-select that folder
      setSelectedFolder(currentView)
    }
  }, [currentView, isEditing, initialFolderId])

  useEffect(() => {
    setTitle(initialTitle)
    setText(initialText)
    setSelectedTags(initialTags)
    setSelectedColor(initialColor)
    setSelectedFolder(initialFolderId || '')
  }, [initialTitle, initialText, initialTags, initialColor, initialFolderId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Check if the rich text content has actual text (remove HTML tags and whitespace)
    const plainText = text.replace(/<[^>]*>/g, '').trim()
    if (plainText) {
      onSubmit(title, text, selectedTags, selectedColor, selectedFolder || undefined)
      setTitle('')
      setText('')
      setSelectedTags([])
      setSelectedColor('note-blue')
      setSelectedFolder('')
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleAddNewTag = () => {
    const trimmedTag = newTag.trim()
    if (trimmedTag) {
      onAddTag(trimmedTag)
      setSelectedTags([...selectedTags, trimmedTag])
      setNewTag('')
      setShowNewTagInput(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-backdrop">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto modal-content transition-colors duration-200">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 tracking-tight">
            {isEditing ? 'Modifier la note' : 'Nouvelle note'}
          </h2>

          {/* Title input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre (optionnel)..."
            className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-sm font-semibold mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />

          {/* Color Picker */}
          <ColorPicker
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
            theme={theme}
          />

          {/* Folder Selector */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
              <Folder size={16} />
              Dossier
            </label>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-h-[44px]"
            >
              <option value="">📂 Aucun dossier</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  📁 {folder.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rich Text Editor */}
          <div className="mb-4 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <RichTextEditor value={text} onChange={setText} />
          </div>

          {/* Tags Section */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Tags
            </label>

            {/* Tag Dropdown */}
            {allTags.length > 0 && (
              <div className="mb-3">
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
                  Sélectionner des tags existants (Ctrl+Click pour plusieurs)
                </label>
                <select
                  multiple
                  value={selectedTags}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value)
                    setSelectedTags(selected)
                  }}
                  className="w-full h-24 p-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Selected Tags Display */}
            {selectedTags.length > 0 && (
              <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
                  Tags sélectionnés
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1 transition-all hover:bg-blue-600 hover:shadow-md"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className="ml-1 hover:text-red-200 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* New Tag Input */}
            <div className="mt-3">
              {showNewTagInput ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nouveau tag..."
                    className="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-h-[44px]"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddNewTag()
                      }
                      if (e.key === 'Escape') {
                        setShowNewTagInput(false)
                        setNewTag('')
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddNewTag}
                    className="px-3 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewTagInput(false)
                      setNewTag('')
                    }}
                    className="px-3 py-2 bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors min-h-[44px]"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowNewTagInput(true)}
                  className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  + Ajouter un nouveau tag
                </button>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition-all hover:shadow-md min-h-[44px]"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:scale-105 min-h-[44px]"
            >
              {isEditing ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
