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

**IdeaNoter** is a feature-rich note-taking Progressive Web Application (PWA) built with Next.js 15 (App Router), React 18, Tailwind CSS v3, and InstantDB for cloud persistence.

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v3 with custom colors and dark mode
- **State Management**: React hooks (useState, useEffect) + InstantDB's useQuery hook
- **Database**: InstantDB (cloud-based real-time database)
- **Icons**: Lucide React
- **UI Language**: French
- **PWA**: Optimized for mobile devices (iPhone, Android)

### Application Type
Progressive Web Application (PWA) with cloud backend. Data persists via InstantDB with real-time synchronization capabilities. The app uses client-side rendering with server-side data fetching and supports full-screen mobile experience.

## Core Architecture

### Component Structure
```
app/page.tsx (Main container - manages UI state and data operations)
├── Sidebar.tsx (Navigation sidebar with folders and views)
├── Note.tsx (Display component with pin/favorite/delete actions)
├── NoteForm.tsx (Modal for add/edit with rich text, tags, and color picker)
├── RichTextEditor.tsx (Rich text editing component)
├── ColorPicker.tsx (Manual color selection component)
└── FolderForm.tsx (Modal for creating/editing folders)

lib/instant.ts (InstantDB configuration and schema)
lib/sanitize.ts (HTML sanitization utility with DOMPurify)

hooks/useKeyboardShortcuts.ts (Global keyboard shortcuts hook)
hooks/useTheme.ts (Dark/light theme management hook)
hooks/useIsMobile.ts (Mobile viewport detection hook)
hooks/useIsTouchDevice.ts (Touch device detection hook)
```

### Data Model

**InstantDB Schema** (defined in `lib/instant.ts`):

```typescript
interface Note {
  id: string          // Generated via InstantDB's id()
  text: string        // Note content (supports HTML from rich text editor)
  title?: string      // Optional title
  color: string       // One of 10 predefined colors (manual or random)
  createdAt: number   // Timestamp (Date.now())
  tags: string[]      // Array of tag names
  isPinned: boolean   // Pin status (pinned notes appear first)
  isFavorite: boolean // Favorite status (accessible via sidebar)
  folderId?: string   // Optional folder ID for organization
}

interface Tag {
  id: string          // Generated via InstantDB's id()
  name: string        // Tag name
}

interface Folder {
  id: string          // Generated via InstantDB's id()
  name: string        // Folder name
  color?: string      // Folder color (blue, green, purple, orange, pink, gray)
  createdAt: number   // Timestamp (Date.now())
}
```

The schema uses InstantDB's schema builder with type validation:
- `notes` entity with string, number, JSON, and boolean fields
- `tags` entity for managing available tags
- `folders` entity for organizing notes
- Relationships tracked via tag names and folder IDs

### State Flow

1. **Data Loading**: Notes, tags, and folders loaded from InstantDB on app mount via `db.useQuery({ notes: {}, tags: {}, folders: {} })`
2. **UI State**: Managed locally in `app/page.tsx` (showForm, editingId, searchQuery, filters, currentView, sidebarOpen)
3. **CRUD Operations**: Executed via InstantDB transactions (`db.transact()`)
4. **Real-time Sync**: InstantDB automatically syncs changes across clients
5. **Loading States**: Built-in loading and error states from useQuery
6. **Theme State**: Persisted in localStorage and managed via useTheme hook

### InstantDB Integration

**Configuration** (`lib/instant.ts`):
- App ID: `b4000325-ee7c-4fb1-a80b-aace7ab11bac`
- Schema-first approach with type safety
- Entities: notes, tags, folders

**Transaction Examples**:
```typescript
// Create note
db.transact([
  db.tx.notes[noteId].update({
    text, title, color, createdAt, tags, isPinned, isFavorite, folderId
  })
])

// Delete note
db.transact([db.tx.notes[noteId].delete()])

// Update note
db.transact([
  db.tx.notes[noteId].update({ text, title, tags, color })
])

// Create folder
db.transact([
  db.tx.folders[folderId].update({
    name, color, createdAt
  })
])

// Move note to folder (drag & drop)
db.transact([
  db.tx.notes[noteId].update({ folderId })
])
```

## Color System

### Note Colors

**10 custom Tailwind colors** with light and dark mode variants:

| Color Name | Light Mode | Dark Mode | Accent (Light) | Accent (Dark) |
|-----------|-----------|----------|----------------|---------------|
| `note-coral` | #FF9999 | #B86B6B | #FF6666 | #CC5555 |
| `note-white` | #F5F5F5 | #3A3A3A | #E0E0E0 | #4A4A4A |
| `note-blue` | #A8D8FF | #5A8FBF | #5BB8FF | #4A7FAF |
| `note-pink` | #E8D5F0 | #9F7FAF | #D4A5E8 | #B88FC8 |
| `note-gray` | #D4E4F7 | #6B8AAF | #9CBCE8 | #7B9ABF |
| `note-yellow` | #FFE5B4 | #BFA570 | #FFD280 | #D0B680 |
| `note-green` | #B4E7B4 | #6B9F6B | #7DD87D | #7CB87C |
| `note-peach` | #FFCC99 | #BF9060 | #FFB366 | #D0A070 |
| `note-lavender` | #E6D7FF | #9F85BF | #CCA8FF | #B095D0 |
| `note-mint` | #D4F0E8 | #6BA090 | #A0E0D0 | #7CB0A0 |

**Color Selection**:
- **Manual**: Via ColorPicker component in NoteForm (grid of 10 colors)
- **Random**: Auto-assigned if user doesn't select
- **Persistence**: Color persists with note during edits
- **Theme Aware**: Automatically switches between light/dark variants

### Folder Colors

**6 folder colors** with light and dark mode variants:

| Color | Light | Dark | Hover (Light) | Hover (Dark) |
|-------|-------|------|---------------|--------------|
| Blue | #3B82F6 | #60A5FA | #2563EB | #3B82F6 |
| Green | #10B981 | #34D399 | #059669 | #10B981 |
| Purple | #8B5CF6 | #A78BFA | #7C3AED | #8B5CF6 |
| Orange | #F97316 | #FB923C | #EA580C | #F97316 |
| Pink | #EC4899 | #F472B6 | #DB2777 | #EC4899 |
| Gray | #6B7280 | #9CA3AF | #4B5563 | #6B7280 |

**Implementation** in `app/page.tsx`:
```typescript
const COLORS = ['note-coral', 'note-white', 'note-blue', /* ... */]
const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)]
```

## Feature Details

### Dark Mode (`hooks/useTheme.ts`)
Full dark mode implementation with seamless transitions:
- **Theme Toggle**: Sun/Moon button in header with 180° rotation animation
- **Persistence**: Saved to localStorage (`ideanoted-theme`)
- **System Preference**: Auto-detects user's OS preference on first load
- **Color Adaptation**: All note colors, folder colors, and UI elements have dark variants
- **Smooth Transitions**: CSS transitions for all color changes (200ms duration)
- **Hydration Safe**: Prevents flash of wrong theme on page load

**Theme Classes**:
- Light mode: Default styles
- Dark mode: Applied via `dark:` Tailwind prefix when `<html class="dark">`
- Background: `bg-gray-50` → `dark:bg-gray-900`
- Text: `text-gray-900` → `dark:text-gray-100`
- Cards: `bg-white` → `dark:bg-gray-800`

### Folder System (`app/components/Sidebar.tsx`, `app/components/FolderForm.tsx`)
Complete folder organization with drag & drop:
- **CRUD Operations**: Create, edit, rename, change color, delete folders
- **Folder Colors**: 6 color options with theme-aware variants
- **Folder Views**: Click folder to filter notes by that folder
- **Drag & Drop**: Drag notes from grid to folders in sidebar
- **Note Counts**: Real-time count badges on each folder
- **Cascading Delete**: When folder deleted, notes become uncategorized
- **Icons**: Lucide React Folder icon with color-coded backgrounds

**Special Views**:
- **All Notes** (`all`): Shows all notes across all folders
- **Favorites** (`favorites`): Shows only favorited notes (amber star icon)
- **Uncategorized** (`uncategorized`): Shows notes without folder assignment

### Favorites System
Quick-access favorite notes:
- **Favorite Toggle**: Star button in top-right of note card
- **Visual Indicator**: Filled amber star icon for favorited notes (always visible on touch devices)
- **Sidebar View**: Dedicated "Favoris" view in sidebar
- **Count Badge**: Shows number of favorited notes
- **Independent**: Works alongside pin and folder organization
- **Persistence**: isFavorite boolean stored in database

### Sidebar Navigation (`app/components/Sidebar.tsx`)
Comprehensive navigation and organization:
- **Responsive**: Fixed sidebar on desktop (lg+), slide-out drawer on mobile
- **Mobile Overlay**: Dark backdrop when sidebar open on mobile
- **Sections**:
  - **Vues**: All Notes, Favorites, Uncategorized (with count badges)
  - **Dossiers**: List of all folders with colors and counts
- **Folder Management**: Create (+), edit, delete folders
- **Drag & Drop Zones**: Drop notes on folders or "All Notes"/"Uncategorized" to move
- **Touch Support**: Edit/delete buttons always visible on touch devices
- **Sticky**: Scrolls independently of main content

### Color Picker (`app/components/ColorPicker.tsx`)
Manual color selection for notes:
- **Grid Layout**: 5×2 grid (10 colors)
- **Visual Preview**: Color swatches with theme-aware backgrounds
- **Selection State**: Selected color has blue ring and scale animation
- **Theme Aware**: Shows light or dark variants based on current theme
- **Hover Effects**: Scale and shadow on hover
- **Accessible**: Clear visual feedback and tooltips

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
- **Dark Mode**: Full support with theme-aware colors

### Global Keyboard Shortcuts (`hooks/useKeyboardShortcuts.ts`)
Implemented via custom React hook with smart input field detection:

| Shortcut | Action | Description |
|----------|--------|-------------|
| **Ctrl/Cmd+N** | New Note | Opens note creation form (only when no modal is open) |
| **Ctrl/Cmd+F** | Search | Toggles search bar visibility |
| **Escape** | Close | Closes active modal/panel (priority: form → folder form → search → tag filter) |
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
- **Dark Mode**: Theme-aware tag styling

### Search & Filtering
- **Search**: Real-time text search across note content (case-insensitive)
- **Tag Filter**: Filter by single tag (dropdown in header)
- **Folder Filter**: Filter by folder (via sidebar views)
- **Combined Filters**: Search, tag, and folder filters work together
- **Empty States**: Different messages for "no notes" vs "no results"
- **Clear Actions**: Buttons to clear search/filters when active

### Note Pinning
- **Pin Toggle**: Pin icon in top-right of note card
- **Visual Indicator**: Filled yellow pin icon for pinned notes (always visible on touch devices)
- **Sorting**: Pinned notes always appear first, then sorted by date (newest first)
- **Persistence**: isPinned boolean stored in database
- **Works with Folders**: Pinned notes appear first within their folder view

### Drag & Drop
Notes can be dragged to folders for organization:
- **Draggable Notes**: All notes have `draggable` attribute
- **Drop Zones**: Folders in sidebar, "All Notes", "Uncategorized"
- **Visual Feedback**: Cursor changes during drag
- **State Management**: `draggedNoteId` tracks current drag operation
- **Folder Assignment**: Dropping on folder sets `note.folderId`
- **Remove from Folder**: Drop on "All Notes" or "Uncategorized" to remove folder

### Mobile & Touch Support
Full mobile optimization with PWA features:

**useIsMobile Hook** (`hooks/useIsMobile.ts`):
- Detects viewport < 768px
- Media query listener for responsive changes
- SSR-safe with hydration mismatch prevention
- Used for conditional UI elements (e.g., hiding tooltips)

**useIsTouchDevice Hook** (`hooks/useIsTouchDevice.ts`):
- Detects touch capability (ontouchstart, maxTouchPoints)
- Used to show/hide action buttons
- Touch devices: Buttons always visible
- Mouse devices: Buttons appear on hover

**Mobile Features**:
- Sidebar drawer with overlay
- Minimum touch target sizes (44×44px)
- Responsive grid (1/2/3 columns)
- Full-screen PWA mode for iPhone
- No tooltips on mobile (controlled by useIsMobile)
- Always-visible action buttons (controlled by useIsTouchDevice)

### Note Organization
- **Sorting**: Pinned notes first, then by createdAt timestamp (descending)
- **Grid Layout**: Responsive - 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- **Timestamps**: Displayed as DD-MM-YYYY format at bottom of each note
- **Folders**: Organize notes into colored folders
- **Favorites**: Quick access to important notes
- **Uncategorized**: Default state for new notes

## Component Details

### Sidebar Component (`app/components/Sidebar.tsx`)
Navigation and organization hub:
- **Props**: currentView, onViewChange, folders, noteCounts, theme, onDrop, isOpen, onClose
- **Views Section**:
  - All Notes (LayoutGrid icon, blue highlight)
  - Favorites (Star icon, amber highlight)
  - Uncategorized (FileText icon, gray highlight)
- **Folders Section**:
  - Create folder button (+)
  - List of folders with color indicators
  - Edit/delete buttons (visible on hover or touch devices)
  - Drag & drop zones
- **Mobile**: Slide-out drawer with overlay
- **Desktop**: Sticky sidebar (w-64, scrollable)
- **Count Badges**: Real-time note counts for each view

### Note Component (`app/components/Note.tsx`)
- Displays single note with color background and accent border
- Click to edit (opens modal)
- **Action Buttons** (top-right corner, visible on touch or hover):
  - **Favorite**: Star button (amber when favorited)
  - **Pin**: Pin button (yellow when pinned)
  - **Delete**: X button (red with confirmation dialog)
- Renders HTML content from rich text editor via `dangerouslySetInnerHTML`
- Shows tags as rounded chips at top
- Shows optional title as bold heading
- Shows formatted date at bottom
- Uses lucide-react icons (Pin, X, Star)
- Maps color strings to Tailwind classes via `colorClasses` object
- **Theme Aware**: Separate color maps for light/dark modes
- **Draggable**: Can be dragged to folders
- Uses `stopPropagation()` on buttons to prevent triggering edit modal

### NoteForm Component (`app/components/NoteForm.tsx`)
- Modal overlay with fixed positioning and backdrop blur
- **Dual mode**: "Nouvelle note" (add) vs "Modifier la note" (edit)
- **Title input**: Optional text input for note titles
- **ColorPicker**: Grid of 10 colors for manual selection
- **Rich text editor**: Embedded RichTextEditor component
- **Tag management**:
  - Multi-select dropdown for existing tags
  - Display selected tags as removable chips
  - Inline "Add new tag" input with Enter key support
  - Tags created here are added to global tags collection
- **Validation**: Requires non-empty content (strips HTML tags to check)
- **Cancel/Submit**: Buttons with different styling based on mode
- **Dark Mode**: Full theme support with dark variant colors

### ColorPicker Component (`app/components/ColorPicker.tsx`)
Manual color selection component:
- **Props**: selectedColor, onColorChange, theme
- **Layout**: 5×2 grid (10 colors)
- **Visual Feedback**:
  - Selected: Blue ring (4px) + scale-110 + shadow-xl
  - Hover: scale-105 + shadow-lg
- **Theme Aware**: Uses `bg-${color}` for light, `bg-${color}-dark` for dark
- **Tooltips**: Capitalized color names
- **Accessible**: Clear selection state and keyboard support

### FolderForm Component (`app/components/FolderForm.tsx`)
Folder creation and editing modal:
- **Props**: onSubmit, onCancel, initialName, initialColor, isEditing, theme
- **Fields**:
  - Name input (text)
  - Color picker (6 folder colors)
- **Dual Mode**: "Nouveau dossier" vs "Modifier le dossier"
- **Color Selection**: Grid of 6 colors with selection state
- **Theme Aware**: Dark mode support
- **Keyboard**: Enter to submit, Escape to cancel

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
- **Dark Mode**: Theme-aware background and text colors

### Main Page (`app/page.tsx`)
- **Layout**: Flexbox with sidebar + main content
- **Header**:
  - Sticky with blur backdrop
  - Mobile menu button (hamburger)
  - Title: "Mes notes"
  - Search button with expandable search bar
  - Theme toggle button (Moon/Sun icon with rotation)
  - Tag filter button with dropdown
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
  - Tooltip: "Nouvelle note" (hidden on mobile)
- **Notes Grid**:
  - Responsive layout (1/2/3 columns)
  - Filtered by current view (all/favorites/uncategorized/folder)
  - Empty state when no notes
  - "No results" state when filters return nothing
  - Clear filter buttons in empty states
- **Loading/Error States**:
  - Loading: "Chargement..." centered
  - Error: Red error message with details
- **Data Operations**:
  - handleAddNote, handleEditNote, handleUpdateNote, handleDeleteNote
  - handleTogglePin, handleToggleFavorite
  - handleAddTag, handleDeleteTag
  - handleCreateFolder, handleEditFolder, handleSubmitFolder, handleDeleteFolder
  - handleDrop (drag & drop)
- **Save Notification**: Green toast when Ctrl+S pressed

## Configuration Files

### Tailwind (`tailwind.config.ts`)
- **Dark Mode**: Class-based (`darkMode: 'class'`)
- **Custom colors**:
  - 10 note colors × 2 (base + accent) × 2 (light + dark) = 40 note colors
  - 6 folder colors × 2 (base + hover) × 2 (light + dark) = 24 folder colors
- **Custom font stack** (system fonts)
- **Content paths**: `app/**/*` and `components/**/*`

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
      isFavorite: i.boolean(),
      folderId: i.string().optional(),
    }),
    tags: i.entity({
      name: i.string(),
    }),
    folders: i.entity({
      name: i.string(),
      color: i.string().optional(),
      createdAt: i.number(),
    }),
  },
})
```

### Query Pattern
```typescript
const { isLoading, error, data } = db.useQuery({ notes: {}, tags: {}, folders: {} })
const notes = data?.notes || []
const tags = data?.tags || []
const folders = data?.folders || []
```

### Transaction Pattern
All mutations use the transaction API:
```typescript
db.transact([
  db.tx.notes[noteId].update({ /* fields */ }),
  db.tx.folders[folderId].update({ /* fields */ }),
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
- `lucide-react`: ^0.553.0 (Icons: Pin, X, Search, Tag, Plus, FileText, SearchX, Moon, Sun, Menu, Folder, Star, LayoutGrid, Edit2)

### Security
- `dompurify`: ^3.3.0 (HTML sanitization to prevent XSS attacks)
- `@types/dompurify`: ^3.0.5 (TypeScript definitions)

### Styling
- `tailwindcss`: ^3.4.1
- `autoprefixer`: ^10.4.16
- `postcss`: ^8.4.32

### Dev Tools
- `typescript`: ^5.6.3
- `eslint`: ^8.56.0
- `eslint-config-next`: ^15.0.0
- `sharp`: ^0.34.5 (Image optimization for PWA)
- `@types/node`, `@types/react`, `@types/react-dom`

## Important Implementation Notes

### Data Persistence
- **Cloud-based**: All data stored in InstantDB (not localStorage)
- **Real-time**: Changes sync automatically across clients
- **Offline**: May require InstantDB offline support configuration
- **Data Loss**: Depends on InstantDB account, not browser storage

### ID Generation
- Uses InstantDB's `id()` function from `@instantdb/react`
- Generates unique IDs for notes, tags, and folders
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
- **Theme State**: localStorage + useTheme hook
- **No global state library**: Keep simple with props and callbacks

### Styling Approach
- Uses `.note-content` class for rendered HTML styling (defined in globals.css)
- Tailwind utility classes for everything else
- Dark mode via `dark:` prefix
- No CSS modules or styled-components

### French UI
All user-facing strings are in French:
- Buttons: "Ajouter", "Modifier", "Annuler", "Créer"
- Placeholders: "Écrivez votre idée...", "Titre (optionnel)...", "Entrez le nom..."
- Headers: "Mes notes", "Nouvelle note", "Modifier la note", "Organisation"
- Views: "Toutes les notes", "Favoris", "Non classées", "Dossiers"
- Empty states: "Aucune note pour le moment", "Aucun résultat"

## Current Feature Status

### Implemented ✅
- Note CRUD (create, read, update, delete)
- Rich text editing with toolbar and keyboard shortcuts
- Note titles (optional)
- **10 color system with manual selection via ColorPicker**
- Tag system with creation, assignment, filtering, and deletion
- Real-time search
- Note pinning with visual indicators
- **Favorites system with dedicated sidebar view**
- **Folder/category system with CRUD operations**
- **Drag & drop notes to folders**
- Responsive grid layout
- Loading and error states
- Cloud persistence with InstantDB
- Date display (creation date)
- HTML sanitization (DOMPurify - XSS protection)
- Global keyboard shortcuts (Ctrl+N, Ctrl+F, Escape, Ctrl+S)
- Save feedback notification (visual confirmation)
- **Dark mode with theme persistence and system preference detection**
- **Mobile optimization with touch device detection**
- **PWA support for full-screen mobile experience**
- **Sidebar navigation with responsive drawer**

### Future Features ⏳
Refer to `ROADMAP.md` for comprehensive feature planning including:
- Drag & drop reordering within folders
- Export (PDF, Markdown)
- User accounts/authentication
- Sharing capabilities
- Note versioning/history
- Image/file attachments
- Undo/redo functionality
- Offline mode

## Development Workflow

### Adding a New Feature
1. Update data model in `lib/instant.ts` if needed (schema changes)
2. Modify transaction logic in `app/page.tsx`
3. Update UI components as needed
4. Add dark mode support (light + dark variants)
5. Test with InstantDB's real-time sync
6. Test on mobile/touch devices
7. Update this CLAUDE.md file

### Working with InstantDB
- **Schema changes**: Update `lib/instant.ts` and potentially need to migrate data
- **New entities**: Add to schema builder
- **Queries**: Use `db.useQuery()` with entity selectors
- **Mutations**: Always use `db.transact()` for consistency

### CSS Styling
- Use Tailwind utility classes first
- Add dark mode variants with `dark:` prefix
- Custom styles in `app/globals.css` (currently has `.note-content` styles)
- Color system: Use predefined note and folder colors from config
- Ensure minimum touch targets (44×44px) for mobile

### Icons
- Use lucide-react components: `import { IconName } from 'lucide-react'`
- Standard size: 16-20px for buttons, 18px for sidebar, 72px for empty states
- Available icons: Pin, X, Search, Tag, Plus, FileText, SearchX, Moon, Sun, Menu, Folder, Star, LayoutGrid, Edit2

### Dark Mode Development
- Always provide both light and dark variants for new colors
- Use `theme` prop passed from useTheme hook
- Test theme toggle to ensure smooth transitions
- Check color contrast in both modes
- Use `dark:` prefix for dark mode Tailwind classes

## Testing Considerations

### Manual Testing Checklist
- [ ] Create note with/without title
- [ ] Create note with/without tags
- [ ] Edit note and verify changes sync
- [ ] Delete note with confirmation
- [ ] Pin/unpin notes and verify sorting
- [ ] Favorite/unfavorite notes
- [ ] Create folders with different colors
- [ ] Drag notes to folders
- [ ] Rename and delete folders
- [ ] Switch between sidebar views (All, Favorites, Uncategorized, Folders)
- [ ] Search with various queries
- [ ] Filter by tag
- [ ] Combine search + tag + folder filters
- [ ] Create new tags via form
- [ ] Delete tags and verify removal from notes
- [ ] Test rich text formatting (all buttons + shortcuts)
- [ ] Test edit/preview toggle
- [ ] **Toggle dark mode and verify all colors**
- [ ] **Test on mobile viewport (< 768px)**
- [ ] **Test on touch devices (buttons always visible)**
- [ ] **Open sidebar on mobile (hamburger menu)**
- [ ] **Test drag & drop on touch devices**
- [ ] Test responsive layout (mobile, tablet, desktop)
- [ ] Test empty states (no notes, no results, no folders)
- [ ] Test HTML sanitization (inject malicious HTML, verify it's stripped)
- [ ] Test Ctrl+N shortcut (creates new note)
- [ ] Test Ctrl+F shortcut (toggles search)
- [ ] Test Escape key (closes modals/panels)
- [ ] Test Ctrl+S shortcut (shows save notification)
- [ ] Verify shortcuts don't trigger in text inputs (except Escape)
- [ ] **Test PWA install and full-screen mode on mobile**

### Known Limitations
- No offline support (depends on InstantDB configuration)
- No user authentication (single shared database)
- No undo/redo functionality
- No note versioning
- No image/file attachments
- No note export
- No manual reordering within folders (relies on creation date)
- Drag & drop may not work well on some touch devices

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

### Why Folders + Favorites?
- **Folders**: Hierarchical organization for projects/topics
- **Favorites**: Quick access across all folders
- **Uncategorized**: Default state, no forced organization
- **Flexible**: Users can choose their organization method

### Why Class-Based Dark Mode?
- More control than media query approach
- Allows user preference override
- Easy to toggle programmatically
- Persists across sessions

### Why Touch Device Detection?
- Better UX: Always show buttons on touch devices
- Cleaner UI: Hide buttons on hover-capable devices
- Accessibility: Ensures touch targets are always reachable
- Performance: Avoids hover state issues on touch devices

## Future Considerations

Refer to `ROADMAP.md` for detailed roadmap with phases, priorities, and implementation suggestions.

**Next recommended improvements:**
1. ✅ ~~HTML sanitization (security)~~ - COMPLETED
2. ✅ ~~Keyboard shortcuts (Ctrl+N, Ctrl+F, Esc)~~ - COMPLETED
3. ✅ ~~Dark mode (user experience)~~ - COMPLETED
4. ✅ ~~Manual color picker (customization)~~ - COMPLETED
5. ✅ ~~Folder/category system (organization)~~ - COMPLETED
6. User authentication (prerequisite for sharing) - **NEXT PRIORITY**
7. Note export (PDF, Markdown) - **NEXT PRIORITY**
8. Image/file attachments
9. Offline mode support

**Scaling concerns** (if >1000 notes):
- Implement virtualized list rendering
- Move filtering to server-side queries
- Add search indexing
- Lazy load note content
- Consider pagination for large folders

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

### Dark Mode Issues
- Check localStorage for `ideanoted-theme` key
- Verify `dark` class is applied to `<html>` element
- Ensure all color variants are defined in tailwind.config.ts
- Check for missing `dark:` prefixes in components

### Folder Issues
- Verify folders entity exists in InstantDB
- Check that folder colors are valid (blue, green, purple, orange, pink, gray)
- Ensure folder deletion removes folderId from notes
- Verify drag & drop handlers are properly bound

### Mobile Issues
- Check viewport meta tag in layout.tsx
- Verify minimum touch target sizes (44×44px)
- Test sidebar overlay and close functionality
- Check useIsMobile and useIsTouchDevice hooks
- Verify PWA manifest and service worker configuration
