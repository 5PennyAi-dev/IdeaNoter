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

**IdeaNoter** is a feature-rich note-taking application built with Next.js 15 (App Router), React 18, Tailwind CSS v3, and InstantDB for cloud persistence.

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v3 with custom colors
- **State Management**: React hooks (useState, useEffect) + InstantDB's useQuery hook
- **Database**: InstantDB (cloud-based real-time database)
- **Icons**: Lucide React
- **UI Language**: French

### Application Type
Single Page Application (SPA) with cloud backend. Data persists via InstantDB with real-time synchronization capabilities. The app uses client-side rendering with server-side data fetching.

## Core Architecture

### Component Structure
```
app/page.tsx (Main container - manages UI state and data operations)
├── Note.tsx (Display component with pin/delete actions)
├── NoteForm.tsx (Modal for add/edit with rich text and tags)
└── RichTextEditor.tsx (Rich text editing component)

lib/instant.ts (InstantDB configuration and schema)
lib/sanitize.ts (HTML sanitization utility with DOMPurify)

hooks/useKeyboardShortcuts.ts (Global keyboard shortcuts hook)
```

### Data Model

**InstantDB Schema** (defined in `lib/instant.ts`):

```typescript
interface NoteItem {
  id: string          // Generated via InstantDB's id()
  text: string        // Note content (supports HTML from rich text editor)
  title?: string      // Optional title
  color: string       // One of 10 predefined colors
  createdAt: number   // Timestamp (Date.now())
  tags: string[]      // Array of tag names
  isPinned: boolean   // Pin status (pinned notes appear first)
}

interface Tag {
  id: string          // Generated via InstantDB's id()
  name: string        // Tag name
}
```

The schema uses InstantDB's schema builder with type validation:
- `notes` entity with string, number, JSON, and boolean fields
- `tags` entity for managing available tags
- Relationships tracked via tag names in the notes.tags array

### State Flow

1. **Data Loading**: Notes and tags loaded from InstantDB on app mount via `db.useQuery({ notes: {}, tags: {} })`
2. **UI State**: Managed locally in `app/page.tsx` (showForm, editingId, searchQuery, filters)
3. **CRUD Operations**: Executed via InstantDB transactions (`db.transact()`)
4. **Real-time Sync**: InstantDB automatically syncs changes across clients
5. **Loading States**: Built-in loading and error states from useQuery

### InstantDB Integration

**Configuration** (`lib/instant.ts`):
- App ID: `b4000325-ee7c-4fb1-a80b-aace7ab11bac`
- Schema-first approach with type safety
- Entities: notes, tags

**Transaction Examples**:
```typescript
// Create note
db.transact([
  db.tx.notes[noteId].update({
    text, title, color, createdAt, tags, isPinned
  })
])

// Delete note
db.transact([db.tx.notes[noteId].delete()])

// Update note
db.transact([
  db.tx.notes[noteId].update({ text, title, tags })
])
```

## Color System

**10 custom Tailwind colors** defined in `tailwind.config.ts` with accent variants:

| Tailwind Class | Hex Color | Accent Color | Visual |
|---|---|---|---|
| `bg-note-coral` | #FF9999 | #FF6666 | Red/Coral |
| `bg-note-white` | #F5F5F5 | #E0E0E0 | Off-white |
| `bg-note-blue` | #A8D8FF | #5BB8FF | Sky blue |
| `bg-note-pink` | #E8D5F0 | #D4A5E8 | Lavender pink |
| `bg-note-gray` | #D4E4F7 | #9CBCE8 | Light gray-blue |
| `bg-note-yellow` | #FFE5B4 | #FFD280 | Pale yellow |
| `bg-note-green` | #B4E7B4 | #7DD87D | Mint green |
| `bg-note-peach` | #FFCC99 | #FFB366 | Peach |
| `bg-note-lavender` | #E6D7FF | #CCA8FF | Light lavender |
| `bg-note-mint` | #D4F0E8 | #A0E0D0 | Mint |

**Color Assignment**: Random color selected on note creation, persists with note during edits. Accent colors used for left border emphasis on note cards.

**Implementation** in `app/page.tsx`:
```typescript
const COLORS = ['note-coral', 'note-white', 'note-blue', /* ... */]
const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)]
```

## Feature Details

### Rich Text Editor (`app/components/RichTextEditor.tsx`)
- **Edit/Preview Modes**: Toggle between editing and rendered preview
- **Formatting Toolbar**: Bold, Italic, Underline, Strikethrough, Blockquote, Code, Lists
- **Keyboard Shortcuts** (in editor):
  - Ctrl/Cmd+B: Bold (`<strong>`)
  - Ctrl/Cmd+I: Italic (`<em>`)
  - Ctrl/Cmd+U: Underline (`<u>`)
- **Output**: Semantic HTML tags stored in note.text
- **Rendering**: Sanitized HTML displayed with `.note-content` class
- **Security**: All HTML content sanitized with DOMPurify before rendering

### Global Keyboard Shortcuts (`hooks/useKeyboardShortcuts.ts`)
Implemented via custom React hook with smart input field detection:

| Shortcut | Action | Description |
|----------|--------|-------------|
| **Ctrl/Cmd+N** | New Note | Opens note creation form (only when no modal is open) |
| **Ctrl/Cmd+F** | Search | Toggles search bar visibility |
| **Escape** | Close | Closes active modal/panel (priority: form → search → tag filter) |
| **Ctrl/Cmd+S** | Save Feedback | Shows visual confirmation "Données synchronisées avec InstantDB" |

**Features**:
- Smart input detection (shortcuts disabled in text fields except Escape)
- Cross-platform support (Ctrl for Windows/Linux, Cmd for macOS)
- Single match execution per event
- Configurable with `KeyboardShortcutConfig` interface

### Tag System
- **Global Tags**: Stored in separate `tags` entity in InstantDB
- **Tag Management**: Create tags via NoteForm, delete via tag filter dropdown
- **Tag Assignment**: Multi-select dropdown in NoteForm + create new tags inline
- **Tag Filtering**: Filter notes by single tag via header dropdown
- **Tag Display**: Chips on note cards with gradient background
- **Tag Deletion**: When deleted, automatically removed from all notes using that tag

### Search & Filtering
- **Search**: Real-time text search across note content (case-insensitive)
- **Tag Filter**: Filter by single tag (dropdown in header)
- **Combined Filters**: Search and tag filters work together
- **Empty States**: Different messages for "no notes" vs "no results"
- **Clear Actions**: Buttons to clear search/filters when active

### Note Pinning
- **Pin Toggle**: Pin icon in top-right of note card
- **Visual Indicator**: Filled yellow pin icon for pinned notes (always visible)
- **Sorting**: Pinned notes always appear first, then sorted by date (newest first)
- **Persistence**: isPinned boolean stored in database

### Note Organization
- **Sorting**: Pinned notes first, then by createdAt timestamp (descending)
- **Grid Layout**: Responsive - 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- **Timestamps**: Displayed as DD-MM-YYYY format at bottom of each note

## Component Details

### Note Component (`app/components/Note.tsx`)
- Displays single note with color background and accent border
- Click to edit (opens modal)
- Hover reveals pin and delete buttons (top-right corner)
- Pin button: Yellow when pinned, white when unpinned
- Delete button: Red with confirmation dialog
- Renders HTML content from rich text editor via `dangerouslySetInnerHTML`
- Shows tags as rounded chips at top
- Shows optional title as bold heading
- Shows formatted date at bottom
- Uses lucide-react icons (Pin, X)
- Maps color strings to Tailwind classes via `colorClasses` object
- Uses `stopPropagation()` on pin/delete to prevent triggering edit modal

### NoteForm Component (`app/components/NoteForm.tsx`)
- Modal overlay with fixed positioning and backdrop blur
- **Dual mode**: "Nouvelle note" (add) vs "Modifier la note" (edit)
- **Title input**: Optional text input for note titles
- **Rich text editor**: Embedded RichTextEditor component
- **Tag management**:
  - Multi-select dropdown for existing tags
  - Display selected tags as removable chips
  - Inline "Add new tag" input with Enter key support
  - Tags created here are added to global tags collection
- **Validation**: Requires non-empty content (strips HTML tags to check)
- **Cancel/Submit**: Buttons with different styling based on mode

### RichTextEditor Component (`app/components/RichTextEditor.tsx`)
- **Mode Tabs**: Edit vs Preview toggle
- **Edit Mode**:
  - Textarea with keyboard shortcut handling
  - Formatting toolbar with 8 buttons
  - Inserts semantic HTML tags around selection
  - Auto-focus and cursor position management
- **Preview Mode**:
  - Renders HTML content in scrollable div
  - Uses `.note-content` class for styling
- **Markup Functions**: Wraps selected text in HTML tags
- **Keyboard Handler**: Intercepts Ctrl/Cmd+B/I/U

### Main Page (`app/page.tsx`)
- **Header**:
  - Sticky with blur backdrop
  - Title: "Mes notes"
  - Search button with expandable search bar
  - Tag filter button with dropdown (includes delete functionality)
- **Search Bar**:
  - Appears when search button clicked
  - Auto-focus with clear button
  - Updates searchQuery state
- **Tag Filter Dropdown**:
  - Lists all available tags
  - "Tous les tags" option to clear filter
  - Delete button (×) next to each tag
  - Highlighted selection (blue background)
- **Floating Action Button (FAB)**:
  - Fixed bottom-right position
  - Opens NoteForm for new note
  - Rotating plus icon on hover
  - Tooltip: "Nouvelle note"
- **Notes Grid**:
  - Responsive layout
  - Empty state when no notes
  - "No results" state when filters return nothing
  - Clear filter buttons in empty states
- **Loading/Error States**:
  - Loading: "Chargement..." centered
  - Error: Red error message with details
- **Data Operations**:
  - handleAddNote: Creates note with InstantDB id()
  - handleEditNote: Loads note data into form state
  - handleUpdateNote: Updates note via transaction
  - handleDeleteNote: Deletes via transaction
  - handleTogglePin: Toggles isPinned boolean
  - handleAddTag: Creates new tag entity
  - handleDeleteTag: Removes tag from collection and all notes

## Configuration Files

### Tailwind (`tailwind.config.ts`)
- Custom colors in `theme.extend.colors` (10 note colors + 10 accents)
- Custom font stack (system fonts)
- Content paths: `app/**/*` and `components/**/*`

### TypeScript (`tsconfig.json`)
- Strict mode enabled
- ES2017 target
- Path alias `@/*` maps to root directory

### Next.js (`next.config.ts`)
- reactStrictMode enabled for development safety

## InstantDB Details

### App ID
`b4000325-ee7c-4fb1-a80b-aace7ab11bac`

### Schema Definition
Located in `lib/instant.ts` using InstantDB's schema builder:
```typescript
const schema = i.schema({
  entities: {
    notes: i.entity({
      text: i.string(),
      title: i.string().optional(),
      color: i.string(),
      createdAt: i.number(),
      tags: i.json<string[]>(),
      isPinned: i.boolean(),
    }),
    tags: i.entity({
      name: i.string(),
    }),
  },
})
```

### Query Pattern
```typescript
const { isLoading, error, data } = db.useQuery({ notes: {}, tags: {} })
const notes = data?.notes || []
const tags = data?.tags || []
```

### Transaction Pattern
All mutations use the transaction API:
```typescript
db.transact([
  db.tx.notes[noteId].update({ /* fields */ }),
  // Can batch multiple operations
])
```

## Dependencies

### Core
- `next`: ^15.0.0 (React framework)
- `react`: ^18.3.1
- `react-dom`: ^18.3.1

### Data & State
- `@instantdb/react`: ^0.22.51 (Cloud database with real-time sync)

### UI
- `lucide-react`: ^0.553.0 (Icon library - Pin, X, Search, Tag, Plus, FileText, SearchX)

### Security
- `dompurify`: ^3.2.3 (HTML sanitization to prevent XSS attacks)

### Styling
- `tailwindcss`: ^3.4.1
- `autoprefixer`: ^10.4.16
- `postcss`: ^8.4.32

### Dev Tools
- `typescript`: ^5.6.3
- `eslint`: ^8.56.0
- `eslint-config-next`: ^15.0.0
- `@types/node`, `@types/react`, `@types/react-dom`

## Important Implementation Notes

### Data Persistence
- **Cloud-based**: All data stored in InstantDB (not localStorage)
- **Real-time**: Changes sync automatically across clients
- **Offline**: May require InstantDB offline support configuration
- **Data Loss**: Depends on InstantDB account, not browser storage

### ID Generation
- Uses InstantDB's `id()` function from `@instantdb/react`
- Generates unique IDs for notes and tags
- More robust than timestamp-based IDs

### HTML Content Security
- Note content stored as HTML (from rich text editor)
- **Sanitization**: All HTML sanitized with DOMPurify before rendering
- **Utility**: `sanitizeHTML()` function in `lib/sanitize.ts`
- **Allowed tags**: Strong, em, u, s, p, br, blockquote, code, pre, lists, headings, links
- **XSS Protection**: Configured to prevent script injection and malicious attributes
- **Usage**: Applied in RichTextEditor preview and Note component display

### State Management
- **Server State**: Managed by InstantDB's useQuery hook
- **UI State**: Local state in components (useState)
- **No global state library**: Keep simple with props and callbacks

### Styling Approach
- Uses `.note-content` class for rendered HTML styling (defined in globals.css)
- Tailwind utility classes for everything else
- No CSS modules or styled-components

### French UI
All user-facing strings are in French:
- Buttons: "Ajouter", "Modifier", "Annuler"
- Placeholders: "Écrivez votre idée...", "Titre (optionnel)..."
- Headers: "Mes notes", "Nouvelle note", "Modifier la note"
- Empty states: "Aucune note pour le moment", "Aucun résultat"

## Current Feature Status

### Implemented ✅
- Note CRUD (create, read, update, delete)
- Rich text editing with toolbar and keyboard shortcuts
- Note titles (optional)
- 10 color system with random assignment
- Tag system with creation, assignment, filtering, and deletion
- Real-time search
- Note pinning with visual indicators
- Responsive grid layout
- Loading and error states
- Cloud persistence with InstantDB
- Date display (creation date)
- **HTML sanitization** (DOMPurify - XSS protection)
- **Global keyboard shortcuts** (Ctrl+N, Ctrl+F, Escape, Ctrl+S)
- **Save feedback notification** (visual confirmation)

### Placeholder/Future Features ⏳
Refer to `ROADMAP.md` for comprehensive feature planning including:
- Dark mode
- Manual color selection
- Folders/categories
- Drag & drop reordering
- Export (PDF, Markdown)
- Synchronization (already has cloud backend!)
- User accounts/authentication
- Sharing capabilities

## Development Workflow

### Adding a New Feature
1. Update data model in `lib/instant.ts` if needed (schema changes)
2. Modify transaction logic in `app/page.tsx`
3. Update UI components as needed
4. Test with InstantDB's real-time sync
5. Update this CLAUDE.md file

### Working with InstantDB
- **Schema changes**: Update `lib/instant.ts` and potentially need to migrate data
- **New entities**: Add to schema builder
- **Queries**: Use `db.useQuery()` with entity selectors
- **Mutations**: Always use `db.transact()` for consistency

### CSS Styling
- Use Tailwind utility classes first
- Custom styles in `app/globals.css` (currently has `.note-content` styles)
- Color system: Use predefined note colors from config

### Icons
- Use lucide-react components: `import { IconName } from 'lucide-react'`
- Standard size: 16-20px for buttons, 72px for empty states

## Testing Considerations

### Manual Testing Checklist
- [ ] Create note with/without title
- [ ] Create note with/without tags
- [ ] Edit note and verify changes sync
- [ ] Delete note with confirmation
- [ ] Pin/unpin notes and verify sorting
- [ ] Search with various queries
- [ ] Filter by tag
- [ ] Combine search + tag filter
- [ ] Create new tags via form
- [ ] Delete tags and verify removal from notes
- [ ] Test rich text formatting (all buttons + shortcuts)
- [ ] Test edit/preview toggle
- [ ] Test responsive layout (mobile, tablet, desktop)
- [ ] Test empty states (no notes, no results)
- [ ] Test HTML sanitization (inject malicious HTML, verify it's stripped)
- [ ] Test Ctrl+N shortcut (creates new note)
- [ ] Test Ctrl+F shortcut (toggles search)
- [ ] Test Escape key (closes modals/panels)
- [ ] Test Ctrl+S shortcut (shows save notification)
- [ ] Verify shortcuts don't trigger in text inputs (except Escape)

### Known Limitations
- No offline support (depends on InstantDB configuration)
- No user authentication (single shared database)
- No undo/redo functionality
- No note versioning
- No image/file attachments
- No note export
- No manual color selection (random assignment only)

## Architecture Decisions

### Why InstantDB?
- Real-time sync out of the box
- Schema-first with TypeScript support
- No backend code needed
- Easy scaling path for multi-user features

### Why Semantic HTML over Markdown?
- Direct rendering without conversion
- Richer formatting options
- Familiar editing experience (toolbar buttons)
- Easier to extend with complex formatting

### Why Separate Tags Entity?
- Global tag management (create, delete)
- Autocomplete/suggestion capability
- Consistency across notes
- Tag analytics potential

### Why Client-Side Filtering?
- Instant results (no network latency)
- Works with InstantDB's query result
- Simple implementation
- Scalable to ~1000 notes before performance issues

## Future Considerations

Refer to `ROADMAP.md` for detailed roadmap with phases, priorities, and implementation suggestions.

**Next recommended improvements:**
1. ✅ ~~HTML sanitization (security)~~ - COMPLETED
2. ✅ ~~Keyboard shortcuts (Ctrl+N, Ctrl+F, Esc)~~ - COMPLETED
3. Dark mode (user experience) - **NEXT PRIORITY**
4. Manual color picker (customization) - **NEXT PRIORITY**
5. Folder/category system (organization)
6. User authentication (prerequisite for sharing)

**Scaling concerns** (if >1000 notes):
- Implement virtualized list rendering
- Move filtering to server-side queries
- Add search indexing
- Lazy load note content

## Troubleshooting

### InstantDB Connection Issues
- Verify APP_ID in `lib/instant.ts`
- Check network connectivity
- Review InstantDB dashboard for errors
- Check browser console for error details

### Notes Not Appearing
- Check `isLoading` and `error` states
- Verify InstantDB schema matches code
- Check browser console for errors
- Verify data in InstantDB dashboard

### Rich Text Formatting Issues
- Check `.note-content` styles in `globals.css`
- Verify HTML tags are being inserted correctly
- Test in preview mode to see rendered output

### Tag Issues
- Verify tags entity exists in InstantDB
- Check that tag names are strings (not objects)
- Ensure tag deletion cascades to notes
