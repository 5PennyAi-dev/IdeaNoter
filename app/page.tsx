'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Search, X, Tag, MoreVertical, Plus, FileText, SearchX } from 'lucide-react'
import Note from './components/Note'
import NoteForm from './components/NoteForm'

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
  const [notes, setNotes] = useState<NoteItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingText, setEditingText] = useState('')
  const [editingTags, setEditingTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showTagFilter, setShowTagFilter] = useState(false)
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null)

  // Load notes and tags from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes')
    if (savedNotes) {
      try {
        let parsedNotes = JSON.parse(savedNotes)
        // Migrate old notes without tags and isPinned fields
        parsedNotes = parsedNotes.map((note: any) => ({
          ...note,
          tags: note.tags || [],
          isPinned: note.isPinned ?? false,
        }))
        setNotes(parsedNotes)
      } catch (error) {
        console.error('Error loading notes:', error)
      }
    }

    const savedTags = localStorage.getItem('tags')
    if (savedTags) {
      try {
        setAllTags(JSON.parse(savedTags))
      } catch (error) {
        console.error('Error loading tags:', error)
      }
    }
    setIsLoading(false)
  }, [])

  // Save notes to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('notes', JSON.stringify(notes))
    }
  }, [notes, isLoading])

  // Save tags to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('tags', JSON.stringify(allTags))
    }
  }, [allTags, isLoading])

  const handleAddNote = (title: string, text: string, tags: string[]) => {
    const newNote: NoteItem = {
      id: Date.now().toString(),
      text,
      title: title || undefined,
      color: getRandomColor(),
      createdAt: new Date().toISOString(),
      tags,
      isPinned: false,
    }
    setNotes([newNote, ...notes])
    setShowForm(false)
    setEditingTitle('')
    setEditingTags([])
  }

  const handleEditNote = (id: string) => {
    const note = notes.find((n) => n.id === id)
    if (note) {
      setEditingId(id)
      setEditingTitle(note.title || '')
      setEditingText(note.text)
      setEditingTags(note.tags)
      setShowForm(true)
    }
  }

  const handleUpdateNote = (title: string, text: string, tags: string[]) => {
    if (editingId) {
      setNotes(
        notes.map((note) =>
          note.id === editingId ? { ...note, title: title || undefined, text, tags } : note
        )
      )
      setEditingId(null)
      setEditingTitle('')
      setEditingText('')
      setEditingTags([])
      setShowForm(false)
    }
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const handleTogglePin = (id: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    )
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setEditingTitle('')
    setEditingText('')
    setEditingTags([])
  }

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !allTags.includes(trimmedTag)) {
      setAllTags([...allTags, trimmedTag])
    }
  }

  const getFilteredAndSortedNotes = () => {
    let filtered = [...notes]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((note) =>
        note.text.toLowerCase().includes(query)
      )
    }

    // Apply tag filter
    if (selectedTagFilter) {
      filtered = filtered.filter((note) =>
        note.tags.includes(selectedTagFilter)
      )
    }

    // Sort by date (newest first), with pinned notes first
    return filtered.sort((a, b) => {
      // If one is pinned and the other isn't, pinned comes first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      // If both have same pin status, sort by date
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft size={24} />
            </button>
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

              {/* Tag Filter Dropdown */}
              {showTagFilter && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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
                      <div className="max-h-48 overflow-y-auto">
                        {allTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              setSelectedTagFilter(tag)
                              setShowTagFilter(false)
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${
                              selectedTagFilter === tag
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Add Note Button */}
        <button
          onClick={() => {
            setEditingId(null)
            setEditingTitle('')
            setEditingText('')
            setEditingTags([])
            setShowForm(true)
          }}
          className="mb-8 w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg hover:shadow-2xl transition-all hover:scale-110 fixed bottom-8 right-8 z-40 group"
          title="Ajouter une note"
        >
          <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

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
    </div>
  )
}
