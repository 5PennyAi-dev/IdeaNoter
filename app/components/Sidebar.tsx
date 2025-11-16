'use client'

import { Folder, Star, FileText, Plus, X, Edit2, LayoutGrid } from 'lucide-react'
import type { Theme } from '@/hooks/useTheme'
import type { Folder as FolderType } from '@/lib/instant'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'

type ViewType = 'all' | 'favorites' | 'uncategorized' | string

interface SidebarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  folders: FolderType[]
  onCreateFolder: () => void
  onEditFolder: (folderId: string) => void
  onDeleteFolder: (folderId: string) => void
  noteCounts: {
    all: number
    favorites: number
    uncategorized: number
    byFolder: Record<string, number>
  }
  theme: Theme
  onDrop?: (folderId: string | null) => void
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({
  currentView,
  onViewChange,
  folders,
  onCreateFolder,
  onEditFolder,
  onDeleteFolder,
  noteCounts,
  theme,
  onDrop,
  isOpen = true,
  onClose,
}: SidebarProps) {
  // Detect touch device for button visibility
  const isTouchDevice = useIsTouchDevice()

  // Get folder color classes
  const getFolderColorClass = (color?: string) => {
    if (!color) return theme === 'dark' ? 'bg-folder-gray-dark' : 'bg-folder-gray'

    const colorMap: Record<string, string> = {
      blue: theme === 'dark' ? 'bg-folder-blue-dark' : 'bg-folder-blue',
      green: theme === 'dark' ? 'bg-folder-green-dark' : 'bg-folder-green',
      purple: theme === 'dark' ? 'bg-folder-purple-dark' : 'bg-folder-purple',
      orange: theme === 'dark' ? 'bg-folder-orange-dark' : 'bg-folder-orange',
      pink: theme === 'dark' ? 'bg-folder-pink-dark' : 'bg-folder-pink',
      gray: theme === 'dark' ? 'bg-folder-gray-dark' : 'bg-folder-gray',
    }

    return colorMap[color] || colorMap.gray
  }

  const getFolderHoverClass = (color?: string) => {
    if (!color) return theme === 'dark' ? 'hover:bg-folder-gray-dark-hover' : 'hover:bg-folder-gray-hover'

    const hoverMap: Record<string, string> = {
      blue: theme === 'dark' ? 'hover:bg-folder-blue-dark-hover' : 'hover:bg-folder-blue-hover',
      green: theme === 'dark' ? 'hover:bg-folder-green-dark-hover' : 'hover:bg-folder-green-hover',
      purple: theme === 'dark' ? 'hover:bg-folder-purple-dark-hover' : 'hover:bg-folder-purple-hover',
      orange: theme === 'dark' ? 'hover:bg-folder-orange-dark-hover' : 'hover:bg-folder-orange-hover',
      pink: theme === 'dark' ? 'hover:bg-folder-pink-dark-hover' : 'hover:bg-folder-pink-hover',
      gray: theme === 'dark' ? 'hover:bg-folder-gray-dark-hover' : 'hover:bg-folder-gray-hover',
    }

    return hoverMap[color] || hoverMap.gray
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDropOnFolder = (e: React.DragEvent, folderId: string | null) => {
    e.preventDefault()
    if (onDrop) {
      onDrop(folderId)
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          flex flex-col transition-all duration-300 z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Organisation</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Special Views Section */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2 px-2">
              Vues
            </h3>
            <div className="space-y-1">
              {/* All Notes */}
              <button
                onClick={() => onViewChange('all')}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnFolder(e, null)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors
                  ${
                    currentView === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <LayoutGrid size={18} />
                  <span className="text-sm font-medium">Toutes les notes</span>
                </div>
                <span
                  className={`
                    text-xs px-2 py-0.5 rounded-full
                    ${
                      currentView === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }
                  `}
                >
                  {noteCounts.all}
                </span>
              </button>

              {/* Favorites */}
              <button
                onClick={() => onViewChange('favorites')}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors
                  ${
                    currentView === 'favorites'
                      ? 'bg-amber-500 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <Star size={18} className={currentView === 'favorites' ? 'fill-current' : ''} />
                  <span className="text-sm font-medium">Favoris</span>
                </div>
                <span
                  className={`
                    text-xs px-2 py-0.5 rounded-full
                    ${
                      currentView === 'favorites'
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }
                  `}
                >
                  {noteCounts.favorites}
                </span>
              </button>

              {/* Uncategorized */}
              <button
                onClick={() => onViewChange('uncategorized')}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnFolder(e, null)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors
                  ${
                    currentView === 'uncategorized'
                      ? 'bg-gray-500 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <FileText size={18} />
                  <span className="text-sm font-medium">Non classées</span>
                </div>
                <span
                  className={`
                    text-xs px-2 py-0.5 rounded-full
                    ${
                      currentView === 'uncategorized'
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }
                  `}
                >
                  {noteCounts.uncategorized}
                </span>
              </button>
            </div>
          </div>

          {/* Folders Section */}
          <div>
            <div className="flex items-center justify-between mb-2 px-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Dossiers
              </h3>
              <button
                onClick={onCreateFolder}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="Créer un dossier"
              >
                <Plus size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {folders.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-4 px-2">
                Aucun dossier
              </p>
            ) : (
              <div className="space-y-1">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnFolder(e, folder.id)}
                    className={`
                      group flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer
                      ${
                        currentView === folder.id
                          ? `${getFolderColorClass(folder.color)} text-white`
                          : `text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`
                      }
                    `}
                    onClick={() => onViewChange(folder.id)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Folder size={18} className="flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{folder.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className={`
                          text-xs px-2 py-0.5 rounded-full
                          ${
                            currentView === folder.id
                              ? 'bg-black/20 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }
                        `}
                      >
                        {noteCounts.byFolder[folder.id] || 0}
                      </span>
                      <div className={`transition-opacity flex gap-1 ${isTouchDevice ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditFolder(folder.id)
                          }}
                          className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded min-w-[44px] min-h-[44px] flex items-center justify-center"
                          title="Modifier"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (window.confirm(`Supprimer le dossier "${folder.name}" ?`)) {
                              onDeleteFolder(folder.id)
                            }
                          }}
                          className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded min-w-[44px] min-h-[44px] flex items-center justify-center"
                          title="Supprimer"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
