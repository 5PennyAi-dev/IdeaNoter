'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Tag, Plus, FileText, SearchX, Moon, Sun, Menu } from 'lucide-react'
import Note from './components/Note'
import NoteForm from './components/NoteForm'
import Sidebar from './components/Sidebar'
import FolderForm from './components/FolderForm'
import { db } from '@/lib/instant'
import { id } from '@instantdb/react'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useTheme } from '@/hooks/useTheme'

interface NoteItem {
  id: string
  text: string
  title?: string
  color: string
  createdAt: string
  tags: string[]
  isPinned?: boolean
  isFavorite?: boolean
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
  // Query notes, tags, and folders from InstantDB
  const { isLoading, error, data } = db.useQuery({ notes: {}, tags: {}, folders: {} })
  const notes = data?.notes || []
  const tags = data?.tags || []
  const folders = data?.folders || []

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingText, setEditingText] = useState('')
  const [editingTags, setEditingTags] = useState<string[]>([])
  const [editingColor, setEditingColor] = useState('note-blue')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showTagFilter, setShowTagFilter] = useState(false)
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null)
  const [showSaveNotification, setShowSaveNotification] = useState(false)
  const saveNotificationTimeout = useRef<NodeJS.Timeout | null>(null)

  // Folder and view state
  const [currentView, setCurrentView] = useState<'all' | 'favorites' | 'uncategorized' | string>('all')
  const [showFolderForm, setShowFolderForm] = useState(false)
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [editingFolderName, setEditingFolderName] = useState('')
  const [editingFolderColor, setEditingFolderColor] = useState('blue')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null)

  // Extract unique tag names from tags collection
  const allTags = tags.map((tag: any) => tag.name)

  // Theme management
  const { theme, toggleTheme, mounted } = useTheme()

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
          setEditingColor('note-blue')
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

  const handleAddNote = (title: string, text: string, noteTags: string[], color: string) => {
    const noteId = id()
    db.transact([
      db.tx.notes[noteId].update({
        text,
        title: title || undefined,
        color,
        createdAt: Date.now(),
        tags: noteTags,
        isPinned: false,
        isFavorite: false,
      })
    ])
    setShowForm(false)
    setEditingTitle('')
    setEditingTags([])
    setEditingColor('note-blue')
  }

  const handleEditNote = (noteId: string) => {
    const note = notes.find((n: any) => n.id === noteId)
    if (note) {
      setEditingId(noteId)
      setEditingTitle(note.title || '')
      setEditingText(note.text)
      setEditingTags(note.tags)
      setEditingColor(note.color)
      setShowForm(true)
    }
  }

  const handleUpdateNote = (title: string, text: string, noteTags: string[], color: string) => {
    if (editingId) {
      db.transact([
        db.tx.notes[editingId].update({
          text,
          title: title || undefined,
          tags: noteTags,
          color,
        })
      ])
      setEditingId(null)
      setEditingTitle('')
      setEditingText('')
      setEditingTags([])
      setEditingColor('note-blue')
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

  const handleToggleFavorite = (noteId: string) => {
    const note = notes.find((n: any) => n.id === noteId)
    if (note) {
      db.transact([
        db.tx.notes[noteId].update({
          isFavorite: !note.isFavorite
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
    setEditingColor('note-blue')
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

  // Folder CRUD handlers
  const handleCreateFolder = () => {
    setEditingFolderId(null)
    setEditingFolderName('')
    setEditingFolderColor('blue')
    setShowFolderForm(true)
  }

  const handleEditFolder = (folderId: string) => {
    const folder = folders.find((f: any) => f.id === folderId)
    if (folder) {
      setEditingFolderId(folderId)
      setEditingFolderName(folder.name)
      setEditingFolderColor(folder.color || 'blue')
      setShowFolderForm(true)
    }
  }

  const handleSubmitFolder = (name: string, color: string) => {
    if (editingFolderId) {
      // Update existing folder
      db.transact([
        db.tx.folders[editingFolderId].update({
          name,
          color,
        })
      ])
    } else {
      // Create new folder
      const folderId = id()
      db.transact([
        db.tx.folders[folderId].update({
          name,
          color,
          createdAt: Date.now(),
        })
      ])
    }
    setShowFolderForm(false)
    setEditingFolderId(null)
    setEditingFolderName('')
    setEditingFolderColor('blue')
  }

  const handleDeleteFolder = (folderId: string) => {
    // Delete the folder
    db.transact([db.tx.folders[folderId].delete()])

    // Remove folderId from all notes that use it
    notes.forEach((note: any) => {
      if (note.folderId === folderId) {
        db.transact([
          db.tx.notes[note.id].update({
            folderId: undefined
          })
        ])
      }
    })

    // Switch to 'all' view if the deleted folder is currently selected
    if (currentView === folderId) {
      setCurrentView('all')
    }
  }

  const handleCancelFolderForm = () => {
    setShowFolderForm(false)
    setEditingFolderId(null)
    setEditingFolderName('')
    setEditingFolderColor('blue')
  }

  // Drag and drop handler
  const handleDrop = (folderId: string | null) => {
    if (draggedNoteId) {
      db.transact([
        db.tx.notes[draggedNoteId].update({
          folderId: folderId || undefined
        })
      ])
      setDraggedNoteId(null)
    }
  }

  // Calculate note counts for sidebar
  const getNoteCounts = () => {
    const byFolder: Record<string, number> = {}
    let favorites = 0
    let uncategorized = 0

    notes.forEach((note: any) => {
      if (note.isFavorite) favorites++
      if (!note.folderId) {
        uncategorized++
      } else {
        byFolder[note.folderId] = (byFolder[note.folderId] || 0) + 1
      }
    })

    return {
      all: notes.length,
      favorites,
      uncategorized,
      byFolder,
    }
  }

  const getFilteredAndSortedNotes = () => {
    let filtered = [...notes]

    // Apply view filter
    if (currentView === 'favorites') {
      filtered = filtered.filter((note: any) => note.isFavorite)
    } else if (currentView === 'uncategorized') {
      filtered = filtered.filter((note: any) => !note.folderId)
    } else if (currentView !== 'all') {
      // Filter by folder ID
      filtered = filtered.filter((note: any) => note.folderId === currentView)
    }

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        folders={folders}
        onCreateFolder={handleCreateFolder}
        onEditFolder={handleEditFolder}
        onDeleteFolder={handleDeleteFolder}
        noteCounts={getNoteCounts()}
        theme={theme}
        onDrop={handleDrop}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40 shadow-sm transition-colors duration-200">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg transition-colors text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Mes notes</h1>
            </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="flex-1 mx-4 max-w-sm animate-in fade-in slide-in-from-top-2 duration-200">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 transition-all text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                showSearch ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'
              }`}
              title={showSearch ? 'Fermer la recherche' : 'Rechercher'}
            >
              <Search size={20} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 hover:rotate-180 duration-500"
              title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
            >
              {mounted && theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            {showSearch && searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-1"
                title="Effacer la recherche"
              >
                <X size={14} />
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => setShowTagFilter(!showTagFilter)}
                className={`p-2 rounded-lg transition-colors ${
                  selectedTagFilter ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'
                }`}
                title="Filtrer par tag"
              >
                <Tag size={20} />
              </button>

              {/* Tag Filter Dropdown with delete functionality */}
              {showTagFilter && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3">
                    <button
                      onClick={() => {
                        setSelectedTagFilter(null)
                        setShowTagFilter(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-2 ${
                        selectedTagFilter === null
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      Tous les tags
                    </button>
                    <div className="border-t border-gray-300 dark:border-gray-600 my-2"></div>
                    {allTags.length === 0 ? (
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
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
                                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
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
              setEditingColor(getRandomColor())
              setShowForm(true)
            }}
            className="mb-8 w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white flex items-center justify-center shadow-lg hover:shadow-2xl transition-all hover:scale-110"
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
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
              <FileText size={72} className="mb-6 text-gray-300 dark:text-gray-700" strokeWidth={1.5} />
              <p className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">Aucune note pour le moment</p>
              <p className="text-sm text-gray-400 dark:text-gray-600">Cliquez sur le bouton + pour ajouter une note</p>
            </div>
          ) : getFilteredAndSortedNotes().length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
              <SearchX size={72} className="mb-6 text-gray-300 dark:text-gray-700" strokeWidth={1.5} />
              <p className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">Aucun résultat</p>
              <p className="text-sm text-gray-400 dark:text-gray-600 text-center max-w-md">
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
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:scale-105"
                  >
                    Effacer la recherche
                  </button>
                )}
                {selectedTagFilter && (
                  <button
                    onClick={() => setSelectedTagFilter(null)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:scale-105"
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
                isFavorite={note.isFavorite}
                theme={theme}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onPin={handleTogglePin}
                onFavorite={handleToggleFavorite}
                onDragStart={setDraggedNoteId}
                onDragEnd={() => setDraggedNoteId(null)}
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
          initialColor={editingColor}
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

      {/* Folder Form Modal */}
      {showFolderForm && (
        <FolderForm
          onSubmit={handleSubmitFolder}
          onCancel={handleCancelFolderForm}
          initialName={editingFolderName}
          initialColor={editingFolderColor}
          isEditing={!!editingFolderId}
          theme={theme}
        />
      )}
      </div>
    </div>
  )
}
