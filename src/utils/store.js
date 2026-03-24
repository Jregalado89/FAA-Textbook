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
      fontSize: 16,
      showACSBadges: true,

      // Reading progress (chapter_id: page_number)
      readingProgress: {},

      // User notes
      notes: [],

      // User highlights
      highlights: [],

      // Bookmarks
      bookmarks: [],

      // ACS page state (persisted so back button restores it)
      acsState: {
        activeArea: 'I',
        selectedCode: null,
        panelOpen: false,
        expandedTasks: {},
      },

      setACSState: (updates) =>
        set((state) => ({
          acsState: { ...state.acsState, ...updates },
        })),

      setCurrentPosition: (book, chapter, page) =>
        set({ currentBook: book, currentChapter: chapter, currentPage: page }),

      toggleLeftSidebar: () =>
        set((state) => ({ leftSidebarOpen: !state.leftSidebarOpen })),

      toggleRightSidebar: () =>
        set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),

      toggleNightMode: () =>
        set((state) => ({ nightMode: !state.nightMode })),

      toggleACSBadges: () =>
        set((state) => ({ showACSBadges: !state.showACSBadges })),

      clearNotes: () => set({ notes: [] }),
      clearHighlights: () => set({ highlights: [] }),
      clearBookmarks: () => set({ bookmarks: [] }),
      clearReadingProgress: () => set({ readingProgress: {} }),
      clearAllData: () => set({
        notes: [],
        highlights: [],
        bookmarks: [],
        readingProgress: {},
      }),

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
          notes: [...state.notes, { 
            ...note, 
            id: Date.now(), 
            timestamp: new Date().toISOString(),
            linkedText: note.linkedText || null 
          }],
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
        readingProgress: state.readingProgress,
        notes: state.notes,
        highlights: state.highlights,
        bookmarks: state.bookmarks,
        nightMode: state.nightMode,
        fontSize: state.fontSize,
        showACSBadges: state.showACSBadges,
        acsState: state.acsState,
      }),
    }
  )
);
