'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Tag, Plus, FileText, SearchX } from 'lucide-react'
import Note from './components/Note'
import NoteForm from './components/NoteForm'
import { db } from '@/lib/instant'
import { id } from '@instantdb/react'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

interface NoteItem {
  id: string
  text: string
  title?: string
  color: string
  createdAt: string
  tags: string[]
  isPinned?: boolean
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

const getRandomColor = (): string => {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

export default function Home() {
  // Query notes and tags from InstantDB
  const { isLoading, error, data } = db.useQuery({ notes: {}, tags: {} })
  const notes = data?.notes || []
  const tags = data?.tags || []

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingText, setEditingText] = useState('')
  const [editingTags, setEditingTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showTagFilter, setShowTagFilter] = useState(false)
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null)
  const [showSaveNotification, setShowSaveNotification] = useState(false)
  const saveNotificationTimeout = useRef<NodeJS.Timeout | null>(null)

  // Extract unique tag names from tags collection
  const allTags = tags.map((tag: any) => tag.name)

  // Handle save notification (Ctrl+S)
  const showSaveFeedback = () => {
    // Clear existing timeout if any
    if (saveNotificationTimeout.current) {
      clearTimeout(saveNotificationTimeout.current)
    }

    setShowSaveNotification(true)
    saveNotificationTimeout.current = setTimeout(() => {
      setShowSaveNotification(false)
      saveNotificationTimeout.current = null
    }, 2000)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveNotificationTimeout.current) {
        clearTimeout(saveNotificationTimeout.current)
      }
    }
  }, [])

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'n',
      ctrl: true,
      callback: () => {
        if (!showForm) {
          setEditingId(null)
          setEditingTitle('')
          setEditingText('')
          setEditingTags([])
          setShowForm(true)
        }
      },
      description: 'Créer une nouvelle note'
    },
    {
      key: 'f',
      ctrl: true,
      callback: () => {
        setShowSearch(!showSearch)
        if (showSearch) {
          setSearchQuery('')
        }
      },
      description: 'Activer/désactiver la recherche'
    },
    {
      key: 'Escape',
      callback: () => {
        if (showForm) {
          handleCancelForm()
        } else if (showSearch) {
          setShowSearch(false)
          setSearchQuery('')
        } else if (showTagFilter) {
          setShowTagFilter(false)
        }
      },
      description: 'Fermer les modals/panneaux'
    },
    {
      key: 's',
      ctrl: true,
      callback: () => {
        showSaveFeedback()
      },
      description: 'Feedback de sauvegarde'
    }
  ])

  const handleAddNote = (title: string, text: string, noteTags: string[]) => {
    const noteId = id()
    db.transact([
      db.tx.notes[noteId].update({
        text,
        title: title || undefined,
        color: getRandomColor(),
        createdAt: Date.now(),
        tags: noteTags,
        isPinned: false,
      })
    ])
    setShowForm(false)
    setEditingTitle('')
    setEditingTags([])
  }

  const handleEditNote = (noteId: string) => {
    const note = notes.find((n: any) => n.id === noteId)
    if (note) {
      setEditingId(noteId)
      setEditingTitle(note.title || '')
      setEditingText(note.text)
      setEditingTags(note.tags)
      setShowForm(true)
    }
  }

  const handleUpdateNote = (title: string, text: string, noteTags: string[]) => {
    if (editingId) {
      db.transact([
        db.tx.notes[editingId].update({
          text,
          title: title || undefined,
          tags: noteTags,
        })
      ])
      setEditingId(null)
      setEditingTitle('')
      setEditingText('')
      setEditingTags([])
      setShowForm(false)
    }
  }

  const handleDeleteNote = (noteId: string) => {
    db.transact([db.tx.notes[noteId].delete()])
  }

  const handleTogglePin = (noteId: string) => {
    const note = notes.find((n: any) => n.id === noteId)
    if (note) {
      db.transact([
        db.tx.notes[noteId].update({
          isPinned: !note.isPinned
        })
      ])
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setEditingTitle('')
    setEditingText('')
    setEditingTags([])
  }

  const handleAddTag = (tagName: string) => {
    const trimmedTag = tagName.trim()
    if (trimmedTag && !allTags.includes(trimmedTag)) {
      const tagId = id()
      db.transact([
        db.tx.tags[tagId].update({
          name: trimmedTag
        })
      ])
    }
  }

  const handleDeleteTag = (tagName: string) => {
    // Find the tag entity by name
    const tagToDelete = tags.find((t: any) => t.name === tagName)
    if (tagToDelete) {
      db.transact([db.tx.tags[tagToDelete.id].delete()])
    }

    // Remove tag from all notes that use it
    notes.forEach((note: any) => {
      if (note.tags.includes(tagName)) {
        db.transact([
          db.tx.notes[note.id].update({
            tags: note.tags.filter((t: string) => t !== tagName)
          })
        ])
      }
    })

    // Clear tag filter if the deleted tag is currently selected
    if (selectedTagFilter === tagName) {
      setSelectedTagFilter(null)
    }
  }

  const getFilteredAndSortedNotes = () => {
    let filtered = [...notes]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((note: any) =>
        note.text.toLowerCase().includes(query)
      )
    }

    // Apply tag filter
    if (selectedTagFilter) {
      filtered = filtered.filter((note: any) =>
        note.tags.includes(selectedTagFilter)
      )
    }

    // Sort by date (newest first), with pinned notes first
    return filtered.sort((a: any, b: any) => {
      // If one is pinned and the other isn't, pinned comes first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      // If both have same pin status, sort by date
      // createdAt is now a number (timestamp) instead of ISO string
      return b.createdAt - a.createdAt
    })
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Erreur de connexion à la base de données</p>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Mes notes</h1>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="flex-1 mx-4 max-w-sm animate-in fade-in slide-in-from-top-2 duration-200">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
                autoFocus
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowSearch(!showSearch)
                if (showSearch) {
                  setSearchQuery('')
                }
              }}
              className={`p-2 rounded-lg transition-colors ${
                showSearch ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              title={showSearch ? 'Fermer la recherche' : 'Rechercher'}
            >
              <Search size={20} />
            </button>
            {showSearch && searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center gap-1"
                title="Effacer la recherche"
              >
                <X size={14} />
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => setShowTagFilter(!showTagFilter)}
                className={`p-2 rounded-lg transition-colors ${
                  selectedTagFilter ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
                title="Filtrer par tag"
              >
                <Tag size={20} />
              </button>

              {/* Tag Filter Dropdown with delete functionality */}
              {showTagFilter && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3">
                    <button
                      onClick={() => {
                        setSelectedTagFilter(null)
                        setShowTagFilter(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-2 ${
                        selectedTagFilter === null
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      Tous les tags
                    </button>
                    <div className="border-t border-gray-300 my-2"></div>
                    {allTags.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-2">
                        Aucun tag disponible
                      </p>
                    ) : (
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {allTags.map((tag) => (
                          <div
                            key={tag}
                            className="flex items-stretch gap-2"
                          >
                            <button
                              onClick={() => {
                                setSelectedTagFilter(tag)
                                setShowTagFilter(false)
                              }}
                              className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                selectedTagFilter === tag
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                              }`}
                            >
                              {tag}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteTag(tag)
                              }}
                              className="w-8 h-full flex items-center justify-center text-white font-bold bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                              title="Supprimer ce tag"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Add Note Button */}
        <div className="fixed bottom-8 right-8 z-40 group">
          <button
            onClick={() => {
              setEditingId(null)
              setEditingTitle('')
              setEditingText('')
              setEditingTags([])
              setShowForm(true)
            }}
            className="mb-8 w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg hover:shadow-2xl transition-all hover:scale-110"
          >
            <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
          {/* Tooltip */}
          <span className="absolute bottom-24 right-0 bg-gray-900 text-white text-sm font-medium px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-xl">
            Nouvelle note
          </span>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
              <FileText size={72} className="mb-6 text-gray-300" strokeWidth={1.5} />
              <p className="text-xl font-semibold text-gray-500 mb-2">Aucune note pour le moment</p>
              <p className="text-sm text-gray-400">Cliquez sur le bouton + pour ajouter une note</p>
            </div>
          ) : getFilteredAndSortedNotes().length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
              <SearchX size={72} className="mb-6 text-gray-300" strokeWidth={1.5} />
              <p className="text-xl font-semibold text-gray-500 mb-2">Aucun résultat</p>
              <p className="text-sm text-gray-400 text-center max-w-md">
                {searchQuery && selectedTagFilter
                  ? `Aucune note ne contient "${searchQuery}" avec le tag "${selectedTagFilter}"`
                  : searchQuery
                  ? `Aucune note ne contient "${searchQuery}"`
                  : `Aucune note avec le tag "${selectedTagFilter}"`}
              </p>
              <div className="mt-4 flex gap-2">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:scale-105"
                  >
                    Effacer la recherche
                  </button>
                )}
                {selectedTagFilter && (
                  <button
                    onClick={() => setSelectedTagFilter(null)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:scale-105"
                  >
                    Effacer le filtre tag
                  </button>
                )}
              </div>
            </div>
          ) : (
            getFilteredAndSortedNotes().map((note) => (
              <Note
                key={note.id}
                id={note.id}
                text={note.text}
                title={note.title}
                color={note.color}
                createdAt={note.createdAt}
                tags={note.tags}
                isPinned={note.isPinned}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onPin={handleTogglePin}
              />
            ))
          )}
        </div>
      </main>

      {/* Note Form Modal */}
      {showForm && (
        <NoteForm
          onSubmit={editingId ? handleUpdateNote : handleAddNote}
          onCancel={handleCancelForm}
          initialTitle={editingTitle}
          initialText={editingText}
          initialTags={editingTags}
          isEditing={!!editingId}
          allTags={allTags}
          onAddTag={handleAddTag}
        />
      )}

      {/* Save Notification (Ctrl+S feedback) */}
      {showSaveNotification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">Données synchronisées avec InstantDB</span>
          </div>
        </div>
      )}
    </div>
  )
}
