# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Create optimized production build
npm run start    # Run production server
npm run lint     # Run ESLint
```

## Architecture Overview

**IdeaNoter** is a simple note-taking application built with Next.js 15 (App Router), React 18, and Tailwind CSS v3.

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v3 with custom colors
- **State Management**: React hooks only (useState, useEffect)
- **Persistence**: Client-side localStorage
- **UI Language**: French

### Application Type
Single Page Application (SPA) - all code runs in the browser with no backend. Complete data persistence via localStorage with automatic save-on-change.

## Core Architecture

### Component Structure
```
app/page.tsx (Main container - manages all state)
├── Note.tsx (Display component)
└── NoteForm.tsx (Modal for add/edit)
```

### Data Model
```typescript
interface NoteItem {
  id: string        // Timestamp-based: Date.now().toString()
  text: string      // Note content
  color: string     // One of 10 predefined colors
}
```

### State Flow
1. Notes loaded from localStorage on app mount
2. All state managed in `app/page.tsx` (parent component)
3. CRUD operations handled via callbacks to child components
4. Auto-save to localStorage on any change (with loading state to prevent initial save)

## Color System

**10 custom Tailwind colors** defined in `tailwind.config.ts`:

| Tailwind Class | Hex Color | Visual |
|---|---|---|
| `bg-note-coral` | #FF9999 | Red/Coral |
| `bg-note-white` | #F5F5F5 | Off-white |
| `bg-note-blue` | #A8D8FF | Sky blue |
| `bg-note-pink` | #E8D5F0 | Lavender pink |
| `bg-note-gray` | #D4E4F7 | Light gray-blue |
| `bg-note-yellow` | #FFE5B4 | Pale yellow |
| `bg-note-green` | #B4E7B4 | Mint green |
| `bg-note-peach` | #FFCC99 | Peach |
| `bg-note-lavender` | #E6D7FF | Light lavender |
| `bg-note-mint` | #D4F0E8 | Mint |

**Color Assignment**: Random color selected on note creation, persists with note during edits. Implementation in `app/page.tsx`:

```typescript
const COLORS = ['note-coral', 'note-white', /* ... */]
const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)]
```

## localStorage Pattern

**Key**: `'notes'` stores JSON array of NoteItem objects.

**Two-phase loading** to prevent unintended data loss:

```typescript
// Phase 1: Load from storage + set loading flag
useEffect(() => {
  const savedNotes = localStorage.getItem('notes')
  if (savedNotes) {
    try { setNotes(JSON.parse(savedNotes)) }
    catch (error) { console.error('Error loading notes:', error) }
  }
  setIsLoading(false)
}, [])

// Phase 2: Save only after loading is complete
useEffect(() => {
  if (!isLoading) {
    localStorage.setItem('notes', JSON.stringify(notes))
  }
}, [notes, isLoading])
```

This prevents overwriting valid stored data with empty initial state.

## Component Details

### Note Component (`app/components/Note.tsx`)
- Displays single note with color background
- Click to edit
- Hover reveals delete button (red "×")
- Maps color strings to Tailwind classes via `colorClasses` object
- Uses `stopPropagation()` on delete to prevent triggering edit modal

### NoteForm Component (`app/components/NoteForm.tsx`)
- Modal overlay with fixed positioning and semi-transparent backdrop
- Dual mode: "Nouvelle note" (add) vs "Modifier la note" (edit)
- Controlled textarea with auto-focus
- Trim whitespace before submission
- Cancel/Submit buttons

### Main Page (`app/page.tsx`)
- Sticky header with navigation buttons (non-functional UI placeholders)
- Fixed floating action button (FAB) for adding notes
- Responsive grid layout: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Empty state message when no notes
- Modal state management: `showForm`, `editingId`, `editingText`

## Configuration

**Tailwind**: Custom colors in theme.extend.colors. Content paths configured for `app/**/*` and `components/**/*`.

**TypeScript**: Strict mode enabled, ES2017 target, path alias `@/*` available.

**Next.js**: reactStrictMode enabled for development safety.

## Future Feature Placeholders

The header includes non-functional buttons for:
- Back button (←)
- Search (🔍)
- Tags (🏷️)
- Menu (⋯)

These can be implemented when needed.

## Important Notes

- **No backend**: Everything happens client-side. localStorage is cleared if user clears browser data.
- **Simple ID generation**: Uses timestamp. For collaborative apps, would need better IDs.
- **No external state library**: Small enough app to use useState. Props drilling is minimal.
- **French UI**: All strings hardcoded in French (buttons, placeholders, headings).
