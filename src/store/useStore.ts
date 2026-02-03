import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Trail, SearchFilters, Coordinates, ChatMessage, Weather, HikingSuitability } from '@/types';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/lib/constants';

// Default filters
const defaultFilters: SearchFilters = {
  query: '',
  difficulty: [],
  distanceRange: [0, 50],
  elevationRange: [0, 2000],
  trailType: [],
  facilities: [],
};

interface AppState {
  // Search state
  searchQuery: string;
  filters: SearchFilters;
  searchResults: Trail[];
  isSearching: boolean;

  // Selected trail
  selectedTrail: Trail | null;
  trailWeather: Weather | null;
  trailSuitability: HikingSuitability | null;

  // Map state
  mapCenter: Coordinates;
  mapZoom: number;
  userLocation: Coordinates | null;

  // UI state
  isSidebarOpen: boolean;
  isChatOpen: boolean;
  isFilterPanelOpen: boolean;
  activeView: 'list' | 'details';

  // Chat state
  chatMessages: ChatMessage[];
  isChatLoading: boolean;

  // Favorites (persisted)
  favoriteTrailIds: string[];

  // Preferences (persisted)
  useImperialUnits: boolean;
  darkMode: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  setSearchResults: (results: Trail[]) => void;
  setIsSearching: (isSearching: boolean) => void;

  selectTrail: (trail: Trail | null) => void;
  setTrailWeather: (weather: Weather | null) => void;
  setTrailSuitability: (suitability: HikingSuitability | null) => void;

  setMapCenter: (center: Coordinates) => void;
  setMapZoom: (zoom: number) => void;
  setUserLocation: (location: Coordinates | null) => void;

  toggleSidebar: () => void;
  toggleChat: () => void;
  toggleFilterPanel: () => void;
  setActiveView: (view: 'list' | 'details') => void;

  addChatMessage: (message: ChatMessage) => void;
  clearChatMessages: () => void;
  setIsChatLoading: (loading: boolean) => void;

  toggleFavorite: (trailId: string) => void;
  isFavorite: (trailId: string) => boolean;

  toggleUnits: () => void;
  toggleDarkMode: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      searchQuery: '',
      filters: defaultFilters,
      searchResults: [],
      isSearching: false,

      selectedTrail: null,
      trailWeather: null,
      trailSuitability: null,

      mapCenter: DEFAULT_MAP_CENTER,
      mapZoom: DEFAULT_MAP_ZOOM,
      userLocation: null,

      isSidebarOpen: true,
      isChatOpen: false,
      isFilterPanelOpen: false,
      activeView: 'list',

      chatMessages: [],
      isChatLoading: false,

      favoriteTrailIds: [],

      useImperialUnits: false,
      darkMode: false,

      // Actions
      setSearchQuery: (query) => set({ searchQuery: query }),

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      resetFilters: () => set({ filters: defaultFilters }),

      setSearchResults: (results) => set({ searchResults: results }),

      setIsSearching: (isSearching) => set({ isSearching }),

      selectTrail: (trail) =>
        set({
          selectedTrail: trail,
          activeView: trail ? 'details' : 'list',
          trailWeather: null,
          trailSuitability: null,
        }),

      setTrailWeather: (weather) => set({ trailWeather: weather }),

      setTrailSuitability: (suitability) => set({ trailSuitability: suitability }),

      setMapCenter: (center) => set({ mapCenter: center }),

      setMapZoom: (zoom) => set({ mapZoom: zoom }),

      setUserLocation: (location) => set({ userLocation: location }),

      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

      toggleFilterPanel: () => set((state) => ({ isFilterPanelOpen: !state.isFilterPanelOpen })),

      setActiveView: (view) => set({ activeView: view }),

      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, message],
        })),

      clearChatMessages: () => set({ chatMessages: [] }),

      setIsChatLoading: (loading) => set({ isChatLoading: loading }),

      toggleFavorite: (trailId) =>
        set((state) => ({
          favoriteTrailIds: state.favoriteTrailIds.includes(trailId)
            ? state.favoriteTrailIds.filter((id) => id !== trailId)
            : [...state.favoriteTrailIds, trailId],
        })),

      isFavorite: (trailId) => get().favoriteTrailIds.includes(trailId),

      toggleUnits: () => set((state) => ({ useImperialUnits: !state.useImperialUnits })),

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'hiking-advisor-storage',
      partialize: (state) => ({
        favoriteTrailIds: state.favoriteTrailIds,
        useImperialUnits: state.useImperialUnits,
        darkMode: state.darkMode,
      }),
    }
  )
);
