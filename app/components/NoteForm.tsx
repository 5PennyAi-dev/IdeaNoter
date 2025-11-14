'use client'

import { useState, useEffect } from 'react'
import RichTextEditor from './RichTextEditor'

interface NoteFormProps {
  onSubmit: (title: string, text: string, tags: string[]) => void
  onCancel: () => void
  initialTitle?: string
  initialText?: string
  initialTags?: string[]
  isEditing?: boolean
  allTags: string[]
  onAddTag: (tag: string) => void
}

export default function NoteForm({
  onSubmit,
  onCancel,
  initialTitle = '',
  initialText = '',
  initialTags = [],
  isEditing = false,
  allTags,
  onAddTag,
}: NoteFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [text, setText] = useState(initialText)
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags)
  const [newTag, setNewTag] = useState('')
  const [showNewTagInput, setShowNewTagInput] = useState(false)

  useEffect(() => {
    setTitle(initialTitle)
    setText(initialText)
    setSelectedTags(initialTags)
  }, [initialTitle, initialText, initialTags])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Check if the rich text content has actual text (remove HTML tags and whitespace)
    const plainText = text.replace(/<[^>]*>/g, '').trim()
    if (plainText) {
      onSubmit(title, text, selectedTags)
      setTitle('')
      setText('')
      setSelectedTags([])
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-backdrop">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto modal-content">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 tracking-tight">
            {isEditing ? 'Modifier la note' : 'Nouvelle note'}
          </h2>

          {/* Title input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre (optionnel)..."
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm font-semibold mb-3"
          />

          {/* Rich Text Editor */}
          <div className="mb-4 bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
            <RichTextEditor value={text} onChange={setText} />
          </div>

          {/* Tags Section */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Tags
            </label>

            {/* Tag Dropdown */}
            {allTags.length > 0 && (
              <div className="mb-3">
                <label className="text-xs text-gray-600 mb-2 block">
                  Sélectionner des tags existants (Ctrl+Click pour plusieurs)
                </label>
                <select
                  multiple
                  value={selectedTags}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value)
                    setSelectedTags(selected)
                  }}
                  className="w-full h-24 p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
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
              <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                <label className="text-xs text-gray-600 mb-2 block">
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
                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
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
                    className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewTagInput(false)
                      setNewTag('')
                    }}
                    className="px-3 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowNewTagInput(true)}
                  className="text-xs text-blue-500 hover:text-blue-700 font-medium"
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
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all hover:shadow-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:scale-105"
            >
              {isEditing ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
