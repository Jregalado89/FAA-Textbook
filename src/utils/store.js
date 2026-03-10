import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Main app store
export const useAppStore = create(
  persist(
    (set, get) => ({
      // Current reading position
      currentBook: 'phak',
      currentChapter: 1,
      currentPage: '1-1',

      // UI state
      leftSidebarOpen: true,
      rightSidebarOpen: true,
      nightMode: false,
      fontSize: 16, // base font size in px

      // Reading progress (chapter_id: page_number)
      readingProgress: {},

      // User notes
      notes: [],

      // User highlights
      highlights: [],

      // Bookmarks
      bookmarks: [],

      // Actions
      setCurrentPosition: (book, chapter, page) =>
        set({ currentBook: book, currentChapter: chapter, currentPage: page }),

      toggleLeftSidebar: () =>
        set((state) => ({ leftSidebarOpen: !state.leftSidebarOpen })),

      toggleRightSidebar: () =>
        set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),

      toggleNightMode: () =>
        set((state) => ({ nightMode: !state.nightMode })),

      increaseFontSize: () =>
        set((state) => ({
          fontSize: Math.min(state.fontSize + 2, 24),
        })),

      decreaseFontSize: () =>
        set((state) => ({
          fontSize: Math.max(state.fontSize - 2, 12),
        })),

      updateReadingProgress: (chapterId, pageNumber) =>
        set((state) => ({
          readingProgress: {
            ...state.readingProgress,
            [chapterId]: pageNumber,
          },
        })),

      addNote: (note) =>
        set((state) => ({
          notes: [...state.notes, { ...note, id: Date.now(), timestamp: new Date().toISOString() }],
        })),

      deleteNote: (noteId) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== noteId),
        })),

      updateNote: (noteId, updates) =>
        set((state) => ({
          notes: state.notes.map((n) => (n.id === noteId ? { ...n, ...updates } : n)),
        })),

      addHighlight: (highlight) =>
        set((state) => ({
          highlights: [...state.highlights, { ...highlight, id: Date.now() }],
        })),

      deleteHighlight: (highlightId) =>
        set((state) => ({
          highlights: state.highlights.filter((h) => h.id !== highlightId),
        })),

      toggleBookmark: (page) =>
        set((state) => {
          const exists = state.bookmarks.includes(page);
          return {
            bookmarks: exists
              ? state.bookmarks.filter((p) => p !== page)
              : [...state.bookmarks, page],
          };
        }),
    }),
    {
      name: 'phak-reader-storage', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        readingProgress: state.readingProgress,
        notes: state.notes,
        highlights: state.highlights,
        bookmarks: state.bookmarks,
        nightMode: state.nightMode,
        fontSize: state.fontSize,
      }),
    }
  )
);
