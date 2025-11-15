'use client'

import { useRef, useState } from 'react'
import { sanitizeHTML } from '@/lib/sanitize'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit')

  const insertMarkup = (before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end)

    onChange(newText)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + selectedText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check for Ctrl/Cmd + key combinations
    const isCtrlOrCmd = e.ctrlKey || e.metaKey

    if (isCtrlOrCmd) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault()
          insertMarkup('<strong>', '</strong>')
          break
        case 'i':
          e.preventDefault()
          insertMarkup('<em>', '</em>')
          break
        case 'u':
          e.preventDefault()
          insertMarkup('<u>', '</u>')
          break
        default:
          break
      }
    }
  }

  return (
    <div className="flex flex-col">
      {/* Mode Tabs */}
      <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 p-2 items-center transition-colors duration-200">
        <button
          type="button"
          onClick={() => setEditorMode('edit')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editorMode === 'edit'
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-500'
          }`}
        >
          Édition
        </button>
        <button
          type="button"
          onClick={() => setEditorMode('preview')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editorMode === 'preview'
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-500'
          }`}
        >
          Aperçu
        </button>
        <div className="flex-1"></div>
      </div>

      {/* Toolbar (visible only in edit mode) */}
      {editorMode === 'edit' && (
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 p-2 transition-colors duration-200">
          <button
            type="button"
            onClick={() => insertMarkup('<strong>', '</strong>')}
            className="px-3 py-1 bg-white dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500 rounded text-sm font-bold text-gray-800 dark:text-gray-200"
            title="Gras (Ctrl+B)"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => insertMarkup('<em>', '</em>')}
            className="px-3 py-1 bg-white dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500 rounded text-sm italic text-gray-800 dark:text-gray-200"
            title="Italique (Ctrl+I)"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => insertMarkup('<u>', '</u>')}
            className="px-3 py-1 bg-white dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500 rounded text-sm underline text-gray-800 dark:text-gray-200"
            title="Souligné (Ctrl+U)"
          >
            U
          </button>
          <button
            type="button"
            onClick={() => insertMarkup('<s>', '</s>')}
            className="px-3 py-1 bg-white dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500 rounded text-sm line-through text-gray-800 dark:text-gray-200"
            title="Barré"
          >
            S
          </button>
          <div className="border-l border-gray-300 dark:border-gray-500 mx-1"></div>
          <button
            type="button"
            onClick={() => insertMarkup('<blockquote>', '</blockquote>')}
            className="px-3 py-1 bg-white dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500 rounded text-sm text-gray-800 dark:text-gray-200"
            title="Bloc de citation"
          >
            &quot;
          </button>
          <button
            type="button"
            onClick={() => insertMarkup('<code>', '</code>')}
            className="px-3 py-1 bg-white dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500 rounded text-sm font-mono text-gray-800 dark:text-gray-200"
            title="Code en ligne"
          >
            &lt;&gt;
          </button>
          <button
            type="button"
            onClick={() => insertMarkup('<ul>\n<li>', '</li>\n</ul>')}
            className="px-3 py-1 bg-white dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500 rounded text-sm text-gray-800 dark:text-gray-200"
            title="Liste à puces"
          >
            •
          </button>
          <button
            type="button"
            onClick={() => insertMarkup('<ol>\n<li>', '</li>\n</ol>')}
            className="px-3 py-1 bg-white dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500 rounded text-sm text-gray-800 dark:text-gray-200"
            title="Liste numérotée"
          >
            1.
          </button>
        </div>
      )}

      {/* Content Area */}
      {editorMode === 'edit' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrivez votre idée..."
          className="w-full h-48 p-3 border-0 rounded-none focus:outline-none focus:ring-0 resize-none font-inherit bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          style={{ fontFamily: 'inherit' }}
        />
      ) : (
        <div className="w-full h-48 p-3 border-0 rounded-none overflow-y-auto bg-white dark:bg-gray-700 note-content text-gray-900 dark:text-gray-100" dangerouslySetInnerHTML={{ __html: sanitizeHTML(value) }} />
      )}
    </div>
  )
}
