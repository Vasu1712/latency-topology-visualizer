import { create } from 'zustand';
import { AppState, Exchange, CloudRegion, LatencyData } from '@/lib/types';
import { CLOUD_PROVIDERS } from '@/lib/constants';

interface VisibilityControls {
  showExchanges: boolean;
  showConnections: boolean;
  showRegions: boolean;
}

interface FilterState {
  searchQuery: string;
  selectedClouds: string[];
  latencyRange: [number, number];
  timeRange: string;
  selectedExchange: Exchange | null;
}

interface AppStateWithFlow extends AppState {
  isStarted: boolean;
  hoveredCity: string | null;
  lastDataUpdate: Date | null;
  isDataLoading: boolean;
  visibility: VisibilityControls;
  filterState: FilterState;
}

interface StoreActions {
  updateLatencyData: (data: LatencyData[]) => void;
  setFilters: (filters: Partial<AppState['filters']>) => void;
  setSelectedPair: (pair: string | null) => void;
  toggleRealTime: () => void;
  toggleTheme: () => void;
  setExchanges: (exchanges: Exchange[]) => void;
  setCloudRegions: (regions: CloudRegion[]) => void;
  setStarted: (started: boolean) => void;
  setHoveredCity: (city: string | null) => void;
  setLastDataUpdate: (date: Date) => void;
  setDataLoading: (loading: boolean) => void;
  // Visibility controls
  toggleExchanges: () => void;
  toggleConnections: () => void;
  toggleRegions: () => void;
  setVisibility: (visibility: Partial<VisibilityControls>) => void;
  // Filter actions
  setSearchQuery: (query: string) => void;
  setSelectedClouds: (clouds: string[]) => void;
  setLatencyRange: (maxLatency: number) => void;
  setTimeRange: (range: string) => void;
  setSelectedExchange: (exchange: Exchange | null) => void;
  // Computed getters
  getAverageLatency: () => number;
  getTotalConnections: () => number;
  getLatencyStats: () => { low: number; medium: number; high: number };
  getFilteredExchanges: () => Exchange[];
  getFilteredLatencyData: () => LatencyData[];
}

export const useStore = create<AppStateWithFlow & StoreActions>((set, get) => ({
  // Initial State
  exchanges: [],
  cloudRegions: [],
  latencyData: [],
  historicalData: {},
  filters: {
    providers: Object.keys(CLOUD_PROVIDERS),
    exchanges: [],
    latencyRange: [0, 1000],
  },
  selectedPair: null,
  isRealTime: true,
  theme: 'dark',
  isStarted: false,
  hoveredCity: null,
  lastDataUpdate: null,
  isDataLoading: false,
  visibility: {
    showExchanges: true,
    showConnections: true,
    showRegions: true,
  },
  filterState: {
    searchQuery: '',
    selectedClouds: ['aws', 'gcp', 'azure'],
    latencyRange: [0, 500],
    timeRange: '24hrs',
    selectedExchange: null,
  },

  // Existing actions...
  updateLatencyData: (data) => set({ latencyData: data }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  setSelectedPair: (pair) => set({ selectedPair: pair }),
  toggleRealTime: () => set((state) => ({ isRealTime: !state.isRealTime })),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  setExchanges: (exchanges) => set({ exchanges, lastDataUpdate: new Date() }),
  setCloudRegions: (regions) => set({ cloudRegions: regions }),
  setStarted: (started) => set({ isStarted: started }),
  setHoveredCity: (city) => set({ hoveredCity: city }),
  setLastDataUpdate: (date) => set({ lastDataUpdate: date }),
  setDataLoading: (loading) => set({ isDataLoading: loading }),

  // Visibility controls
  toggleExchanges: () =>
    set((state) => ({
      visibility: { ...state.visibility, showExchanges: !state.visibility.showExchanges }
    })),
  toggleConnections: () =>
    set((state) => ({
      visibility: { ...state.visibility, showConnections: !state.visibility.showConnections }
    })),
  toggleRegions: () =>
    set((state) => ({
      visibility: { ...state.visibility, showRegions: !state.visibility.showRegions }
    })),
  setVisibility: (visibility) =>
    set((state) => ({
      visibility: { ...state.visibility, ...visibility }
    })),

  // Filter actions
  setSearchQuery: (query) =>
    set((state) => ({
      filterState: { ...state.filterState, searchQuery: query }
    })),
  setSelectedClouds: (clouds) =>
    set((state) => ({
      filterState: { ...state.filterState, selectedClouds: clouds }
    })),
  setLatencyRange: (maxLatency: number) =>
    set((state) => ({
      filterState: { ...state.filterState, latencyRange: [0, maxLatency] } // Sets the range from 0 to the provided maxLatency
    })),
  setTimeRange: (range) =>
    set((state) => ({
      filterState: { ...state.filterState, timeRange: range }
    })),
  setSelectedExchange: (exchange) =>
    set((state) => ({
      filterState: { ...state.filterState, selectedExchange: exchange }
    })),

  // Computed getters
  getAverageLatency: () => {
    const latencyData = get().getFilteredLatencyData();
    if (latencyData.length === 0) return 0;
    const total = latencyData.reduce((sum, data) => sum + data.latency, 0);
    return Math.round(total / latencyData.length * 10) / 10;
  },

  getTotalConnections: () => {
    return get().getFilteredLatencyData().length;
  },

  getLatencyStats: () => {
    const latencyData = get().getFilteredLatencyData();
    return {
      low: latencyData.filter(l => l.latency < 50).length,
      medium: latencyData.filter(l => l.latency >= 50 && l.latency <= 150).length,
      high: latencyData.filter(l => l.latency > 150).length,
    };
  },

  getFilteredExchanges: () => {
    const { exchanges, filterState } = get();
    let filtered = exchanges;

    // Filter by cloud providers
    if (filterState.selectedClouds.length > 0) {
      filtered = filtered.filter(exchange =>
        filterState.selectedClouds.includes(exchange.cloudProvider)
      );
    }

    // Filter by search query
    if (filterState.searchQuery.trim()) {
      const query = filterState.searchQuery.toLowerCase();
      filtered = filtered.filter(exchange =>
        exchange.name.toLowerCase().includes(query) ||
        exchange.region.toLowerCase().includes(query) ||
        exchange.cloudProvider.toLowerCase().includes(query)
      );
    }

    // Filter by selected exchange
    if (filterState.selectedExchange) {
      filtered = filtered.filter(exchange =>
        exchange.id === filterState.selectedExchange?.id
      );
    }

    return filtered;
  },

  getFilteredLatencyData: () => {
    const { latencyData, filterState } = get();
    let filtered = latencyData;

    // Filter by latency range
    filtered = filtered.filter(data =>
      data.latency >= filterState.latencyRange[0] &&
      data.latency <= filterState.latencyRange[1]
    );

    // Filter by time range (assuming timestamp is available)
    const now = Date.now();
    const timeRangeMs = {
      '1hr': 3600000,
      '6hrs': 21600000,
      '12hrs': 43200000,
      '24hrs': 86400000,
      '7days': 604800000,
      '30days': 2592000000,
    };

    const rangeMs = timeRangeMs[filterState.timeRange as keyof typeof timeRangeMs] || 86400000;
    filtered = filtered.filter(data =>
      (now - data.timestamp) <= rangeMs
    );

    return filtered;
  },
}));
